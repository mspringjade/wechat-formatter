# TypeZen Sync Worker

Fixed-IP relay worker for WeChat Official Account API. Sits between the Next.js app and WeChat, providing a single static IP for IP whitelist registration.

> Current status: optional future path. TypeZen does not currently buy or operate a VPS worker by default. The main app can sync through the local Next.js adapter and diagnose the current server egress IP from WeChat whitelist errors. Deploy this worker only if fixed-IP sync is reactivated.

## Quick Start

```bash
npm install
npm run dev        # development with hot reload (tsx watch)
npm run build      # compile to dist/
npm run start      # production: node dist/index.js
npm run typecheck  # type check without emit
```

Default port: `3001`. Override with `PORT` env var.

## Required Environment Variables

| Variable | Description |
|----------|-------------|
| `SYNC_WORKER_HMAC_SECRET` | Shared HMAC key. Must match the Next.js side. Used to verify request signatures. |
| `WECHAT_DEFAULT_APPID` | WeChat Official Account AppID. |
| `WECHAT_DEFAULT_APPSECRET` | WeChat Official Account AppSecret. |
| `PORT` | Optional. Server listen port, defaults to `3001`. |

Multi-account (optional): `WECHAT_ACCOUNTS=wx123:secret1,wx456:secret2`

## Deploy to a Fixed-IP VPS

1. Provision a VPS with a static public IP (e.g. AWS EC2, DigitalOcean Droplet, Aliyun ECS).

2. Copy the project to the server:
   ```bash
   scp -r worker/ user@your-vps:/opt/typezen-worker/
   ```

3. Install and build:
   ```bash
   ssh user@your-vps
   cd /opt/typezen-worker
   npm ci
   npm run build
   npm prune --omit=dev
   ```

4. Create a `.env` file (do NOT commit):
   ```
   SYNC_WORKER_HMAC_SECRET=your-random-secret-here
   WECHAT_DEFAULT_APPID=wx1234567890abcdef
   WECHAT_DEFAULT_APPSECRET=your-app-secret
   PORT=3001
   ```

5. Run with a process manager:
   ```bash
   # systemd unit example
   [Unit]
   Description=TypeZen Sync Worker
   After=network.target

   [Service]
   Type=simple
   WorkingDirectory=/opt/typezen-worker
   ExecStart=/usr/bin/node dist/index.js
   EnvironmentFile=/opt/typezen-worker/.env
   Restart=on-failure
   RestartSec=5

   [Install]
   WantedBy=multi-user.target
   ```
   ```bash
   sudo systemctl enable typezen-worker
   sudo systemctl start typezen-worker
   ```

6. Verify the worker is running:
   ```bash
   curl http://localhost:3001/health
   # → {"status":"ok"}
   ```

## Configure WeChat IP Whitelist

1. Confirm the VPS public IP:
   ```bash
   curl -s https://ifconfig.me
   ```

2. Log in to [WeChat Official Account Admin](https://mp.weixin.qq.com/).

3. Go to: Settings & Development → Basic Configuration → IP Whitelist.

4. Add the VPS public IP.

5. Save. WeChat will immediately enforce the whitelist for your AppID.

## Connect Next.js to the Worker

In the Next.js project (Vercel dashboard or `.env.local`):

```
SYNC_WORKER_URL=http://<your-vps-ip>:3001
SYNC_WORKER_HMAC_SECRET=<same value as worker>
```

When `SYNC_WORKER_URL` is set, `getWeChatAdapter()` automatically returns the remote adapter. When unset, the local adapter is used (browser sends AppSecret directly). No code changes needed.

## Smoke Test

After both sides are configured:

```bash
# 1. Health check
curl http://<your-vps-ip>:3001/health
# Expected: {"status":"ok"}

# 2. Send a signed test request (replace values)
#    Requires SYNC_WORKER_HMAC_SECRET to compute the signature.
#    Easiest: trigger a real sync from the Next.js app and check worker logs.

# 3. Check worker logs for:
#    - "TypeZen Sync Worker starting on port 3001"
#    - "WeChat accounts loaded: 1"
#    - "HMAC secret configured: yes"

# 4. From the Next.js app, click "同步到草稿箱" on any article.
#    Worker logs should show:
#    - [draft] success appId=wx... title="..." mediaId=...
#    Or on error, a clear Chinese error message.
```

## Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/health` | None | Health check, returns `{ status: "ok" }` |
| `POST` | `/wechat/draft` | HMAC-SHA256 | Create a WeChat draft article |

## Request Size Limit

Max body size: **5 MB**. Requests exceeding this return HTTP 413.

## Log Sanitization

The worker never logs: AppSecret, access token, article HTML body, article markdown, HMAC signature, or the full article title. Only `appId`, `title_preview` (first 30 chars), cover type, and error details appear in logs.
