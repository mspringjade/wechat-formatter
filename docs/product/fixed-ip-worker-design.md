# Fixed-IP Worker Design

> Status: paused / optional future path
> Created: 2026-05-12
> Last reviewed: 2026-05-14
> Depends on: license gate, adapter abstraction, optional remote worker code path
> Audience: owner, Claude Code, implementation agents

## 0. Current Decision

This design is no longer the active Phase 1 deployment path. The project is not buying or operating a VPS solely for a fixed-IP worker at this stage.

Current product behavior:

- The default WeChat sync path stays inside the Next.js app unless `SYNC_WORKER_URL` is configured.
- When WeChat returns an IP whitelist error, TypeZen parses the current server egress IP from the WeChat error and shows it to the user for whitelist setup.
- This current IP detection is a diagnostic feature, not a fixed-IP stability guarantee.
- The worker code remains in `worker/` as an optional future path if paid usage justifies a stable hosted relay.

Do not market fixed-IP sync as active unless a real fixed-IP worker is deployed and configured.

## 1. Problem

WeChat Official Account API requires servers to register a fixed IP in the IP whitelist. Vercel serverless functions can have dynamic IPs. If TypeZen later reactivates a fixed-IP sync promise, it needs a relay worker that sits between the Next.js app and WeChat API.

## 2. Goals and Non-Goals

### 2.1 Goals

- Provide a single, stable, publicly routable IP that users register in WeChat IP whitelist.
- Relay WeChat API calls (access token, image upload, cover upload, draft creation) on behalf of the Next.js app.
- Authenticate requests from the Next.js app via HMAC signature (not shared secret in header).
- Never expose AppSecret to the Next.js app or browser.
- Maintain the existing `PublishAdapter` interface so the sync route is unchanged.

### 2.2 Non-Goals

- No database in MVP. Worker holds per-account AppSecret in its own environment variables.
- No user account system on the worker.
- No article content persistence on the worker. Worker processes in-memory and discards.
- No multi-region deployment. Single region, single IP.
- No support for platforms other than WeChat in this phase. Future platform adapters get their own workers or routes.
- No payment integration on the worker. License validation stays on the Next.js app.

## 3. Request Boundary

```
Browser
  │
  │  POST /api/wechat/sync
  │  Headers: X-TypeZen-License: <raw-key>
  │  Body: { html, markdown, title, config: { appId, author }, coverImage }
  │        (Note: config.appSecret is NOT sent from browser)
  │
  ▼
Next.js App (Vercel)
  │
  │  1. verifyLicense(header) → 403 if invalid
  │  2. Validate body (html, title, appId present)
  │  3. adapter = getWeChatAdapter() → wechatRemoteAdapter
  │  4. adapter.createDraft({ article, credentials: { appId } })
  │
  ▼
wechatRemoteAdapter
  │
  │  POST ${SYNC_WORKER_URL}/wechat/draft
  │  Headers:
  │    Content-Type: application/json
  │    X-TypeZen-Timestamp: <unix-seconds>
  │    X-TypeZen-Nonce: <uuid>
  │    X-TypeZen-Signature: <HMAC-SHA256>
  │  Body: { article: CanonicalArticle, appId: string }
  │        (No appSecret, no licenseKey. CanonicalArticle sent to worker contains
│         title, html, digest, author, coverImage — but NOT markdown.
│         Next.js generates the digest from markdown before calling the adapter,
│         so the worker never receives raw markdown.)
  │
  ▼
Fixed-IP Worker
  │
  │  1. Verify HMAC signature → reject if invalid
  │  2. Look up AppSecret by appId (from worker env)
  │  3. Call WeChat API (access token → image transfer → cover → draft)
  │  4. Return { success, externalDraftId?, error?, details?, detectedIp? }
  │
  ▼
Next.js App → Browser
```

### 3.1 What the browser sends to Next.js

| Field | Sent to server | Notes |
|-------|---------------|-------|
| `html` | Yes | Rendered article HTML, needed for image extraction and draft creation |
| `markdown` | Yes | Source markdown, used for digest generation |
| `title` | Yes | Article title |
| `config.appId` | Yes | WeChat AppID (public identifier, not a secret) |
| `config.appSecret` | **No** | Will be removed from browser request in Phase 2. Currently still present for local adapter backward compatibility |
| `config.author` | Yes | Display name, optional |
| `coverImage` | Yes | Base64 or URL |
| `licenseKey` | Header | Not in body |

### 3.2 What Next.js sends to Worker

| Field | Sent | Notes |
|-------|------|-------|
| `article` | Yes | CanonicalArticle (title, html, digest, author, coverImage) — markdown excluded; Next.js pre-computes digest before calling adapter |
| `appId` | Yes | Worker uses this to look up AppSecret |
| `appSecret` | **Never** | Worker already owns it |
| `licenseKey` | **Never** | License is validated before the adapter is called |

### 3.3 What Worker sends to WeChat API

Standard WeChat API calls. Worker owns AppSecret and manages access token lifecycle internally.

## 4. WeChatCredentials Strategy

### 4.1 Options Considered

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| **A. Worker holds AppSecret in env** | Each AppID + AppSecret pair is a `WECHAT_ACCOUNT_<appId>=<appSecret>` env var on the worker | Simple, no infra dependency, secrets stay on a single machine | Env var proliferation at scale, manual rotation |
| B. App encrypts and passes AppSecret | Next.js encrypts AppSecret with worker's public key, worker decrypts | No worker-side storage | AppSecret transits the network (encrypted but still present), key management complexity |
| C. Database/key-value store | Worker reads from Vercel KV, Redis, or D1 | Centralized, supports many accounts | Adds infra dependency, violates "no database in MVP" |

### 4.2 Recommendation: Option A (Worker env vars) for MVP

Rationale:

- TypeZen targets individual writers and small teams. The first 10-50 Pro users each have one WeChat account. 50 env vars is manageable.
- AppSecret never leaves the worker machine. The network path from Next.js to Worker carries only the article payload and appId.
- No database, no key management service, no additional attack surface.
- When account count exceeds ~100 or rotation becomes painful, migrate to Option C (database). The adapter interface does not change — only the worker's internal secret lookup does.

### 4.3 Env var format on Worker

```
# Single account (MVP)
WECHAT_DEFAULT_APPID=wx1234567890abcdef
WECHAT_DEFAULT_APPSECRET=secret_here

# Multiple accounts (future)
WECHAT_ACCOUNTS=wx123:secret1,wx456:secret2
```

Worker matches incoming `appId` against stored accounts. If no match, returns 403.

### 4.4 Phase 2 transition: remove appSecret from browser request

Currently `WeChatSyncRequest.config` still contains `appSecret` because the local adapter needs it. Once the remote adapter path is the default for Pro users:

1. Browser-side `wechat-sync-modal.tsx` continues to save AppSecret to localStorage (for local adapter fallback).
2. The `fetch("/api/wechat/sync")` call strips `appSecret` from the body when sending.
3. Sync route validates: if adapter is remote and appSecret is present in body, ignore it (defense in depth).

This is a Phase 2 item, not MVP.

## 5. HMAC Signature Scheme

### 5.1 Why HMAC, not shared secret header

Earlier skeletons used `X-TypeZen-Worker-Secret: <plaintext>`, a shared secret sent in every request. Problems:

- Any network observer (proxy, log aggregator, CDN edge log) can capture it.
- No replay protection. A captured request can be re-sent.
- No body integrity. An attacker who knows the secret can forge arbitrary payloads.

HMAC-SHA256 over the request body with timestamp and nonce solves all three.

### 5.2 Signing process (Next.js side, in `wechat-remote.ts`)

```
Input:
  - body: JSON string of the request payload
  - timestamp: current Unix time in seconds (string)
  - nonce: crypto.randomUUID()
  - workerSecret: SYNC_WORKER_HMAC_SECRET env var (shared key for HMAC, not AppSecret)

Steps:
  1. payload = `${timestamp}\n${nonce}\n${SHA256(body)}`
  2. signature = HMAC-SHA256(payload, workerSecret) → hex lowercase
  3. Headers:
       X-TypeZen-Timestamp: <timestamp>
       X-TypeZen-Nonce: <nonce>
       X-TypeZen-Signature: <signature>
```

### 5.3 Verification process (Worker side)

```
Input:
  - headers: X-TypeZen-Timestamp, X-TypeZen-Nonce, X-TypeZen-Signature
  - body: raw request body string

Steps:
  1. Check timestamp is within ±300 seconds of worker's clock → reject if stale
  2. Check nonce has not been seen in the last 600 seconds (in-memory set) → reject if duplicate
  3. Recompute payload = `${timestamp}\n${nonce}\n${SHA256(body)}`
  4. Recompute expected = HMAC-SHA256(payload, workerSecret)
  5. Constant-time compare expected vs received signature → reject if mismatch
```

### 5.4 Security properties

| Property | Mechanism |
|----------|-----------|
| Authentication | Only holders of `SYNC_WORKER_HMAC_SECRET` can compute valid HMAC |
| Integrity | Signature covers body hash, so body tampering invalidates signature |
| Replay protection | Timestamp window (±300s) + nonce dedup (600s TTL set) |
| Clock skew tolerance | 5-minute window handles minor drift |
| No AppSecret transit | AppSecret is never in the request; worker looks it up by appId |

### 5.5 Nonce storage on Worker

In-memory `Map<string, number>` mapping nonce → expiry timestamp. A `setInterval` sweep every 60 seconds removes expired entries. At ~100 requests/day this is negligible memory.

## 6. Log Sanitization Rules

### 6.1 Worker logs

| Data | Log? | Format |
|------|------|--------|
| appId | Yes | Full value (public identifier, not a secret) |
| article title | Partial | `title_preview` (first 20–40 chars) or `title_hash` (SHA-256 prefix). Title may contain sensitive content; never log full value |
| article HTML body | **No** | Never log |
| article markdown body | **No** | Never log |
| AppSecret | **Never** | Must not appear in any log path |
| WeChat access token | **Never** | Redacted |
| WeChat API response (success) | Yes | mediaId only |
| WeChat API response (error) | Yes | errcode + errmsg (WeChat's own error format) |
| Request IP (from Next.js) | Yes | For abuse detection |
| HMAC signature | **No** | Never log |
| SYNC_WORKER_HMAC_SECRET | **Never** | Must not appear in any log path |
| coverImage (base64) | **No** | Log only "cover:base64" or "cover:url" or "cover:none" |
| External image URLs fetched | **No** | Log only "image:remote:N" (count) |

### 6.2 Next.js app logs (existing, no changes needed)

Current `wechat.ts` adapter already logs only image source type and error message. Sync route logs only `err.message`. No changes required.

## 7. Error Response Format

Worker returns a JSON body with a consistent shape. The Next.js sync route maps this to the client response.

### 7.1 Worker → Next.js

```typescript
// Success
{
  "success": true,
  "externalDraftId": "MEDIA_ID_FROM_WECHAT"
}

// Failure
{
  "success": false,
  "error": "short human-readable category",
  "details": "optional longer message for debugging",
  "detectedIp": "optional, only for IP whitelist errors"
}
```

### 7.2 Error categories

| Worker error string | HTTP status | Meaning |
|---------------------|-------------|---------|
| `"签名验证失败"` | 401 | HMAC mismatch, stale timestamp, or replayed nonce |
| `"未授权的公众号"` | 403 | appId not found in worker's account registry |
| `"参数不完整"` | 400 | Missing article, appId, or required fields |
| `"微信授权失败"` | 401 | WeChat access token request failed (wraps errcode 40001/40164 etc.) |
| `"内容处理失败"` | 500 | Image transfer or HTML processing error |
| `"封面图上传失败"` | 500 | Cover upload to WeChat failed |
| `"新建草稿失败"` | 500 | WeChat draft creation API error |
| `"Worker 内部错误"` | 500 | Uncaught exception on worker |

### 7.3 Next.js sync route mapping

| Worker result | Next.js HTTP status to browser |
|---------------|-------------------------------|
| `success: true` | 200, `{ success: true, mediaId }` |
| `error: "签名验证失败"` | 502 (worker rejected us, not user's fault) |
| `error: "未授权的公众号"` | 403 |
| `error: "微信授权失败"` | 401 |
| Other errors | 500 |
| Worker unreachable / timeout | 504 |

## 8. Code Touchpoints

### 8.1 `app/_lib/publishing/adapters/wechat-remote.ts`

Current state: implemented as an optional remote adapter. It uses `SYNC_WORKER_HMAC_SECRET`, signs timestamp + nonce + body hash, sends `X-TypeZen-Timestamp`, `X-TypeZen-Nonce`, and `X-TypeZen-Signature`, and posts only `{ article, appId }` to the worker.

Remaining caveat:
- The remote path is inactive unless `SYNC_WORKER_URL` is configured.
- Do not configure it in production unless a real fixed-IP worker is deployed and tested.

### 8.2 `app/_lib/publishing/adapters/index.ts`

Current state: correct. `process.env.SYNC_WORKER_URL` switches local ↔ remote.

Changes needed: none. The selector logic is already correct.

### 8.3 `app/api/wechat/sync/route.ts`

Current state: license check runs before sync work, the route delegates to the selected adapter, and it does not pass `appSecret` into the adapter credentials when `SYNC_WORKER_URL` is configured.

Remaining caveat:
- The browser request body and UI still require AppSecret because the local adapter path remains the default fallback.

### 8.4 `app/_lib/publishing/types.ts`

Current state: `CreateDraftInput.credentials` uses `WeChatCredentials` with optional `appSecret`, making the local/remote adapter contract explicit.

## 9. Phased Implementation Plan

Status: paused. The codebase already contains an optional Hono/Node worker with HMAC verification and WeChat draft relay logic, but it is not deployed as the active product path. The following phases apply only if fixed-IP deployment is reactivated.

### Phase A: MVP Worker

**Goal**: Worker relays WeChat API calls on a fixed IP. HMAC authenticates requests. Worker holds AppSecret in env.

Current code state:
- Worker project exists under `worker/`.
- HMAC verification exists in `worker/src/hmac.ts`.
- WeChat draft relay exists in `worker/src/wechat.ts`.
- Worker reads AppSecret from `WECHAT_DEFAULT_APPID` / `WECHAT_DEFAULT_APPSECRET` or `WECHAT_ACCOUNTS`.
- Worker returns `{ success, externalDraftId?, error?, details?, detectedIp? }`.
- Nonce dedup exists with an in-memory TTL map.
- Health check exists, but currently returns `{ status: "ok" }` without the worker public IP.

On the Next.js side:
- `wechat-remote.ts` signs requests with HMAC and excludes AppSecret from the worker body.
- `WeChatCredentials` is defined with optional `appSecret`.
- The sync route does not pass AppSecret into adapter credentials when using remote mode.
- `SYNC_WORKER_URL` and `SYNC_WORKER_HMAC_SECRET` must be set only when a real worker deployment is ready.

Still required before reactivation:
- Deploy the worker on infrastructure with a stable public IPv4.
- Add the stable IPv4 to the WeChat IP whitelist for the configured account(s).
- Confirm end-to-end draft sync from the Next.js app through the worker.
- Update user-facing copy to explicitly promise fixed-IP sync only after this is verified.

### Phase B: Credential Hardening

**Goal**: AppSecret management beyond raw env vars.

Scope:
- [ ] Worker supports multiple accounts via `WECHAT_ACCOUNTS` env (comma-separated `appId:secret`).
- [ ] Worker returns account-not-found as distinct error (403, not 500).
- [ ] Next.js strips `appSecret` from browser request body for the remote adapter path.
- [ ] Access token caching on worker (WeChat tokens are valid for 7200s, cache with TTL).
- [ ] Rate limiting on worker: max 100 requests/minute per appId.
- [ ] Worker request logging to a file or log service (with sanitization rules from §6).

### Phase C: Database / Account Integration

**Goal**: Support 100+ Pro users without env var sprawl.

Scope:
- [ ] Migrate worker secret storage from env vars to a lightweight store (Cloudflare KV, Vercel KV, or SQLite/D1).
- [ ] Admin API on worker: `POST /admin/accounts` to register appId + AppSecret, `DELETE /admin/accounts/:appId` to revoke.
- [ ] Next.js Pro user onboarding flow: user enters AppID + AppSecret → Next.js calls worker admin API → worker stores encrypted.
- [ ] AppSecret encrypted at rest on worker (AES-256-GCM with a master key in env).
- [ ] Access token refresh: worker manages token lifecycle, caches, and rotates automatically.

### Phase D: Multi-Platform Worker Expansion

**Goal**: Worker becomes a generic publishing relay, not WeChat-specific.

Scope:
- [ ] Worker routes: `/wechat/draft`, `/xiaohongshu/post`, `/zhihu/draft`, etc.
- [ ] Each platform has its own credential storage namespace.
- [ ] `PublishAdapter` interface unchanged on Next.js side — new adapters for new platforms follow the same pattern.
- [ ] Worker may need multiple fixed IPs if platforms have separate whitelists (or use a single IP with port-based routing).
- [ ] Monitoring dashboard: success rate, latency, error breakdown per platform.

## 10. Current Code Status

The worker path is implemented enough to compile and remain available as an optional future deployment, but it is not the active product path.

Current status:

- `wechat-remote.ts` uses HMAC headers, not a plaintext worker-secret header.
- `adapters/index.ts` still correctly switches to remote mode only when `SYNC_WORKER_URL` is set.
- `sync/route.ts` validates the license first and avoids passing `appSecret` into adapter credentials for remote mode.
- `worker/src/index.ts` exposes `/health` and `/wechat/draft`.
- `worker/src/hmac.ts` implements timestamp, nonce, body hash, and constant-time signature verification.
- `worker/src/accounts.ts` supports single-account and multi-account env configuration.
- `worker/src/wechat.ts` implements access token, image transfer, cover upload, and draft creation.

Current default behavior:

1. `SYNC_WORKER_URL` is unset in normal app deployments.
2. `getWeChatAdapter()` returns the local adapter.
3. The local adapter calls WeChat from the Next.js runtime.
4. If WeChat rejects the request with an IP whitelist error, the app surfaces the detected current egress IP to the user.

Do not set `SYNC_WORKER_URL` unless the worker has been deployed on a stable fixed-IP host and tested end to end.
