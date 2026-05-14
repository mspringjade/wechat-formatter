# TypeZen Commercialization Roadmap

> Status: planning document  
> Created: 2026-05-11  
> Audience: owner, Claude Code, implementation agents  
> Product direction: Markdown-first publishing automation for WeChat first, then X/Twitter, Xiaohongshu, Zhihu, and other channels.

## 1. Executive Decision

TypeZen should not commercialize as another generic WeChat formatting editor. The sharper commercial wedge is:

**A Markdown-first publishing automation tool for individual writers and small content teams.**

The current product already has a strong foundation:

- Markdown editor and live preview: `app/editor/page.tsx`
- Inline CSS WeChat renderer: `app/template-engine.ts`
- AI structure formatting: `app/api/ai-format/route.ts`
- WeChat draft sync prototype: `app/api/wechat/sync/route.ts`
- Pro positioning placeholder: `app/_components/landing/pricing-section.tsx`

The first paid promise should be narrow:

**Write in Markdown, preview the result, then send a polished article to the WeChat Official Account draft box without manual copy/paste, image re-upload, or style loss.**

The long-term promise is broader:

**One Markdown source, platform-aware publishing to multiple content channels.**

## 2. Product Positioning

### 2.1 Current Position

Current public positioning:

> TypeZen is a free online Markdown to WeChat formatting tool with AI formatting, live preview, 72 templates, style tweaks, and one-click copy.

This remains the free acquisition surface.

### 2.2 Commercial Position

Future commercial positioning:

> TypeZen Pro is a Markdown publishing cockpit for serious creators and small teams. It turns one Markdown draft into platform-ready drafts for WeChat, and later X/Twitter, Xiaohongshu, Zhihu, and more.

### 2.3 Target Users

Primary users for the first paid version:

1. Technical newsletter authors who write in Markdown and publish to WeChat.
2. AI tool / indie hacker / product update writers publishing frequently.
3. Small content teams maintaining one or more official accounts.
4. Knowledge creators who care more about speed and reliability than decorative materials.

Secondary users:

1. Marketing operators who need frequent publishing but do not need a full 135/Yiban-style suite.
2. Agencies that prepare drafts for clients.

### 2.4 Who This Is Not For

Do not optimize the first commercial version for:

- Users looking for a massive template/material marketplace.
- Users who need heavy WYSIWYG layout composition.
- Users whose main need is AI writing from scratch.
- Enterprise media teams requiring approval workflow on day one.
- Non-Markdown-first creators.

## 3. Product Principles

1. **Markdown remains the source of truth.**
   Do not turn the editor into a generic visual composer too early.

2. **Publishing automation is the paid value.**
   Templates and copy/paste remain generous in Free. Draft sync, image transfer, and actionable publish diagnostics are Pro. Fixed-IP infrastructure is a future option only if paid demand justifies hosted server operations.

3. **Platform support must be adapter-based.**
   WeChat is the first adapter, not a hard-coded destiny.

4. **Privacy is a product feature.**
   Default mode should avoid storing article content. Store logs, statuses, and metadata only unless the user explicitly enables cloud drafts later.

5. **One-person-company maintainability beats feature volume.**
   Every paid feature must reduce user pain without creating weekly maintenance drag.

6. **Do not punish the existing free user base.**
   TypeZen already has free users because the open-source project has been maintained over time. Commercialization should preserve trust: existing free workflows stay free, and Pro charges for new automation, reliability, and hosted infrastructure.

## 3.1 Open Source And Existing Free User Strategy

This project is not a cold-start SaaS. It is commercializing from an existing open-source/free-user base. That changes the rollout strategy.

### Commercialization Rule

Do not take a feature that existing users already rely on for free and suddenly put it behind a paywall.

Free should continue to include:

- Markdown editing
- Template rendering
- Manual one-click copy
- Existing local preview workflow
- BYO AI Key structure formatting

Pro should charge for new value:

- Hosted publishing automation
- WeChat draft sync with current egress IP detection and whitelist diagnostics
- Image transfer and cover handling
- Publish diagnostics
- Future multi-platform adapters
- Future team workflows

### Open-Core Boundary

Recommended boundary:

- Open-source/community version: local formatting and copy workflow.
- Commercial version: hosted publishing infrastructure and platform automation.

This boundary is easy to explain:

> The editor remains free. The paid product runs reliable publishing infrastructure for you.

Avoid framing Pro as "the real version" and Free as crippled. Free is the community trust engine; Pro is the automation layer.

### Communication Plan

Before paid launch:

1. Publish a short "Why Pro exists" note.
2. Thank early open-source users explicitly.
3. Promise that current free formatting and copy workflows remain free.
4. Explain that paid revenue funds maintenance, platform API work, and reliable sync infrastructure.
5. Offer an early supporter discount or lifetime early-access window for the first cohort.

Suggested message:

> TypeZen's core editor will remain free. Pro is for users who want hosted publishing automation, starting with WeChat draft sync, image transfer, and publish diagnostics. Paid revenue helps keep the free editor maintained and funds future platform adapters.

### Conversion Strategy

Do not push all free users toward payment. Segment by behavior:

- Casual users: keep them happy; they create SEO, word of mouth, and GitHub trust.
- Power users who copy often: show Pro sync value after repeated copy usage.
- Users with image-heavy articles: show Pro value around image upload and draft stability.
- Users who click WeChat sync: ask for license/waitlist/payment.

Recommended soft gates:

- After several copy actions: "Publishing often? Pro can create WeChat drafts directly."
- On WeChat sync click: show Pro license / early access modal.
- On image-heavy content: explain automatic image transfer as a Pro benefit.

Avoid:

- Blocking editor load.
- Adding noisy upgrade banners everywhere.
- Removing templates from free users.
- Making existing free users feel tricked.

## 4. Business Model

### 4.1 Recommended Packaging

Free:

- Markdown editor
- 72 templates
- Style tweaks
- Live phone preview
- One-click copy
- BYO AI Key formatting
- Local image paste

Pro Early Access:

- Everything in Free
- WeChat Official Account draft sync
- Automatic article image upload to WeChat
- Cover image extraction and upload
- Current server egress IP detection for WeChat whitelist setup
- Sync error diagnosis for IP whitelist and credential problems
- Higher reliability support

Future Pro:

- Saved publish accounts
- Publish history
- Optional cloud drafts
- Multi-platform publishing adapters
- Platform-specific previews
- Content splitting for X/Twitter threads or Xiaohongshu notes

Future Team:

- Shared workspace
- Multiple publish accounts
- Roles
- Draft handoff
- Team publish history
- Invoice / support

### 4.2 Pricing

Recommended first pricing:

- Free: RMB 0
- Pro Early Access: RMB 199/year
- Pro Monthly: RMB 29/month, shown as a secondary option
- Team: "Contact me", do not self-serve until real demand appears

Reasoning:

- RMB 199/year is low enough for individual creators and high enough to validate intent.
- Monthly exists as a price anchor, not the preferred plan.
- Team pricing should be negotiated after observing real workflows.

### 4.3 Payment Strategy

Phase 1 should use founder-led sales:

- Manual WeChat/Alipay payment.
- Manually issue a license key.
- Store license records server-side.
- Avoid payment gateway complexity until at least 10-20 paying users.

Phase 2 can automate payments:

- Add checkout provider only after paid demand is proven.
- Keep license validation isolated so the payment provider can change later.

## 5. Roadmap

### Phase 0: Commercial Readiness Cleanup

Goal: make public claims accurate and remove obvious trust risks.

Scope:

- Fix landing page overclaims.
- Fix privacy wording around localStorage credentials.
- Fix Biome warnings in WeChat sync files.
- Add usage analytics events.
- Add a clear Pro waitlist / early access CTA.
- Add a clear open-source-to-Pro explanation so existing free users understand what stays free and what becomes paid.

Files likely involved:

- `app/_components/landing/features.tsx`
- `app/_components/landing/faq.tsx`
- `app/_components/landing/pricing-section.tsx`
- `app/_components/wechat-sync-modal.tsx`
- `app/api/wechat/ip/route.ts`
- `app/api/wechat/sync/route.ts`
- `app/api/wechat/utils.ts`
- `lib/site-config.ts`

Acceptance criteria:

- `npm run lint` has no warnings.
- `npm run build` passes.
- Landing page only promises features that exist or are clearly marked as Pro / planned.
- Credential copy states "stored locally in this browser" unless actual encryption is implemented.
- Free users can still find and use the editor without feeling forced into a subscription.

### Phase 1: Pro MVP For WeChat Draft Sync

Goal: charge for one reliable paid workflow.

User workflow:

1. User writes or pastes Markdown.
2. User chooses a template and tweaks style.
3. User clicks "Sync to WeChat".
4. User enters a Pro license key if not activated.
5. User enters WeChat AppID/AppSecret locally.
6. TypeZen validates license, sends the rendered HTML and credentials to the sync backend, uploads images, creates a WeChat draft, and returns success with a next-step link.

Key implementation decisions:

- Do not add full user accounts in the first paid release.
- Do not store article content by default.
- Do not store AppSecret server-side in Phase 1.
- Do not promise a fixed egress IP while the VPS/worker deployment is paused.
- Do use the current app-hosted sync path with IP whitelist diagnostics, and keep the fixed-IP worker as an optional future path.
- Do log sync metadata and errors without logging article body or secrets.

Acceptance criteria:

- A valid license key is required for WeChat sync.
- Free users can still copy HTML manually.
- WeChat sync surfaces the current server egress IP when WeChat returns an IP whitelist error.
- Product copy does not imply fixed-IP stability unless a fixed-IP worker is actually deployed and configured.
- Failed syncs return clear, actionable errors.
- Server logs redact AppID, AppSecret, API keys, article HTML, and Markdown.
- At least 5 real WeChat accounts can sync drafts successfully before public paid launch.

### Phase 2: Account And Usage Infrastructure

Goal: reduce manual operations after product-market signal.

Scope:

- Add login.
- Add workspace.
- Add plan / subscription state.
- Add usage counters.
- Add publish history without storing full article content by default.
- Add admin view for licenses, failed syncs, and customer support.

Acceptance criteria:

- A user can see plan status and remaining sync quota.
- Owner can disable/refund/reissue access.
- Failed publish jobs are searchable by job id, user id, status, and platform.
- No credential or content leaks in logs.

### Phase 3: Multi-Platform Foundation

Goal: make WeChat the first platform adapter in a generalized publish pipeline.

Platforms to consider in order:

1. WeChat Official Account: already started; highest immediate fit.
2. Zhihu: Markdown-like long-form fit, lower style complexity.
3. X/Twitter: thread splitting and short-form transformation.
4. Xiaohongshu: requires image/card generation and caption/hashtag workflow.

Do not build all adapters at once. Build the abstraction first, then add platforms one by one.

Acceptance criteria:

- WeChat publishing code is moved behind a platform adapter interface.
- Rendering pipeline can produce platform-specific output from one canonical article.
- UI can show platform capabilities without hard-coding WeChat-only assumptions.

### Phase 4: Team Workflows

Goal: serve small content teams after single-user publishing is stable.

Scope:

- Shared workspace
- Connected accounts
- Draft handoff
- Publish checklist
- Role-based access
- Team activity log

Do not start this phase until there are real paid users asking for team workflows.

## 6. Architecture

### 6.1 Current Shape

Current simplified architecture:

```text
Browser Editor
  -> renderArticle()
  -> copy HTML
  -> /api/wechat/sync
  -> WeChat API
```

This is good for the current low-infrastructure Early Access path. It can create WeChat drafts and diagnose IP whitelist failures by surfacing the current server egress IP, but it does not guarantee IP stability on serverless platforms.

### 6.2 Target Shape

Recommended target architecture:

```text
Browser Editor
  -> CanonicalArticle
  -> PlatformPreview
  -> /api/publish/:platform
  -> License / Plan Gate
  -> Publish Job
  -> Sync Backend (current app-hosted adapter; optional fixed-IP worker)
  -> Platform Adapter
  -> External Platform API
```

### 6.3 Publish Pipeline

Use a platform-independent article shape:

```ts
type CanonicalArticle = {
  title: string;
  markdown: string;
  html: string;
  excerpt?: string;
  coverImage?: ArticleImage;
  images: ArticleImage[];
  createdAt: string;
};
```

Use platform adapters:

```ts
type PublishPlatform = "wechat" | "zhihu" | "x" | "xiaohongshu";

type PlatformCapabilities = {
  supportsHtml: boolean;
  supportsMarkdown: boolean;
  supportsImageUpload: boolean;
  supportsCoverImage: boolean;
  supportsDraft: boolean;
  supportsDirectPublish: boolean;
  supportsScheduledPublish: boolean;
};

type PublishAdapter = {
  platform: PublishPlatform;
  capabilities: PlatformCapabilities;
  validateConfig(input: unknown): Promise<void>;
  render(article: CanonicalArticle): Promise<RenderedPlatformArticle>;
  createDraft(input: CreateDraftInput): Promise<CreateDraftResult>;
};
```

Implementation note:

- The exact TypeScript names can change during implementation.
- The important rule is that WeChat-specific upload and draft logic must live behind an adapter boundary before adding more platforms.

### 6.4 Current IP Whitelist Strategy And Optional Fixed-IP Worker

Current decision:

- Do not buy or operate a VPS solely for the fixed-IP worker at this stage.
- Keep the default WeChat sync path inside the Next.js app.
- When WeChat returns an IP whitelist error, parse and display the current server egress IP so the user can add it to the WeChat whitelist.
- Make product copy clear that this is IP detection/diagnostics, not a fixed-IP stability guarantee.

Optional future worker path:

- A small VPS with static IPv4.
- Node.js worker service.
- The Next.js app calls the worker with an HMAC-signed request.
- The worker performs WeChat token, image upload, cover upload, and draft creation.

Only revisit this path if paid usage proves the need for a stable hosted sync channel. Until then, do not expose fixed-IP worker as an active Pro promise.

Current optional worker environment variables:

- `SYNC_WORKER_URL`
- `SYNC_WORKER_HMAC_SECRET`
- `WECHAT_DEFAULT_APPID`
- `WECHAT_DEFAULT_APPSECRET`
- `WECHAT_ACCOUNTS` for multiple accounts

Optional future variables:

- `TYPEZEN_LICENSE_SECRET`
- `DATABASE_URL`
- `ENCRYPTION_KEY`
- `PAYMENT_WEBHOOK_SECRET`
- `OPENAI_API_KEY` if hosted AI is added later

## 7. Data Model

Phase 1 should be small but not sloppy.

### 7.0 Database Timing

Because TypeZen already has free users, a database becomes useful earlier than it would in a brand-new side project, but it still should not become a blocker for the first commercial validation.

Recommended decision:

- Do not add a full user-account database just to keep the editor running.
- Do add a small server-side persistence layer when launching paid Pro sync.
- Keep the first database scope limited to licenses, publish jobs, and usage events.
- Do not store article bodies, rendered HTML, AppSecret, or AI API keys in Phase 1.

Practical path:

1. Pre-launch / private test: environment-based hashed license keys are acceptable.
2. First paid cohort: add Postgres for `licenses`, `publish_jobs`, and `usage_events`.
3. After repeat usage appears: add login, users, workspace, and account management.

Recommended provider for an indie SaaS path:

- Supabase Postgres if speed and admin UI matter most.
- Neon Postgres if database portability and serverless Postgres matter most.
- SQLite on a VPS only if the fixed-IP sync worker and app operations are intentionally VPS-centered.

Do not introduce Prisma/Drizzle/Auth/payment all at once. The first database step should support the paid sync workflow only.

Recommended relational tables:

### licenses

Purpose: license key validation and manual early access.

Fields:

- `id`
- `license_key_hash`
- `email`
- `plan`
- `status`: `active | paused | revoked | expired`
- `sync_quota_monthly`
- `sync_used_this_month`
- `expires_at`
- `created_at`
- `updated_at`

Never store raw license keys after creation.

### publish_jobs

Purpose: track sync attempts without storing full content.

Fields:

- `id`
- `license_id`
- `platform`: starts with `wechat`
- `status`: `queued | running | success | failed`
- `title_hash`
- `title_preview`: first 20-40 chars only, optional
- `content_length`
- `image_count`
- `error_code`
- `error_message`
- `external_draft_id`: WeChat `media_id` when successful
- `created_at`
- `updated_at`

Do not store Markdown or full HTML in Phase 1.

### usage_events

Purpose: analytics and quota.

Fields:

- `id`
- `license_id`
- `event_name`
- `platform`
- `metadata_json`
- `created_at`

Metadata must not include secrets or article content.

### future: users

Add only in Phase 2.

### future: workspaces

Add only in Phase 2 or Phase 4.

### future: connected_accounts

Add only after deciding to store platform credentials server-side.

Fields should include encrypted credentials only, never plaintext secrets.

## 8. Security And Privacy

### 8.1 Phase 1 Credential Policy

WeChat AppID/AppSecret:

- Stored in browser localStorage only if user chooses to save them.
- Sent to the backend only during sync.
- Not persisted server-side.
- Redacted from logs.

AI keys:

- Existing BYO AI Key model can remain.
- Keep the current "temporary server call" disclosure.

### 8.2 Logging Policy

Allowed in logs:

- job id
- license id
- platform
- status
- error code
- content length
- image count
- timing

Not allowed in logs:

- AppSecret
- API keys
- full Markdown
- full HTML
- image base64 data
- raw license key

### 8.3 Content Storage Policy

Default:

- Do not store article content.

Future opt-in cloud drafts:

- Store content only after explicit user action.
- Add deletion controls.
- Update privacy copy before release.

## 9. UI / UX Plan

### 9.1 Rename The Sync Entry Point

Current header button:

- "同步公众号"

Phase 1:

- Keep it if only WeChat is enabled.

Phase 3:

- Rename to "发布 / 同步"
- Open a platform-aware publish modal.

### 9.2 Publish Modal Structure

Phase 1 modal tabs:

1. Content confirmation
2. WeChat account config
3. Pro license
4. Sync result

Future modal tabs:

1. Platforms
2. Content mapping
3. Account config
4. Preview
5. Publish result

### 9.3 Plan State UI

Add a small plan indicator:

- Free
- Pro active
- Pro expired
- Sync quota remaining

Do not make the editor feel locked down. The paid wall appears only when using Pro automation.

### 9.4 Error UX

WeChat errors must be translated into user actions:

- Invalid AppSecret: "Check AppID/AppSecret."
- IP whitelist error: "Add the detected current server egress IP to WeChat IP whitelist; re-detect if sync fails again."
- Missing cover image: "Upload a cover image or include one valid image."
- Image upload failure: "This image could not be fetched or compressed."
- Draft API failure: "WeChat rejected the draft. Show error code and details."

## 10. Platform Expansion Strategy

### 10.1 WeChat First

Why:

- Current code already supports it.
- Strong pain point: copy/paste and image handling.
- Official draft API creates clear paid value.

### 10.2 Zhihu Second

Why:

- Long-form content fit.
- Markdown-like source can be adapted.
- Less visual style complexity than Xiaohongshu.

Main unknown:

- Official API availability and permission model.
- If no stable official API, do not ship fragile browser automation as a paid core feature.

### 10.3 X/Twitter Third

Why:

- A different but valuable transformation: long Markdown to thread.
- API access and pricing may change, so isolate adapter.

Key feature:

- Thread splitter with preview.
- Preserve links and code snippets intelligently.

### 10.4 Xiaohongshu Later

Why later:

- It is not just text publishing.
- It likely needs image card generation, cover selection, hashtags, and mobile-native behavior.

Potential TypeZen angle:

- Turn Markdown sections into clean image cards.
- Generate note title, caption, and hashtag suggestions.

Do not start Xiaohongshu until the platform card-generation workflow is validated.

## 11. Analytics

Add events before commercial launch.

Recommended events:

- `landing_cta_click`
- `editor_started`
- `ai_format_started`
- `ai_format_succeeded`
- `copy_clicked`
- `publish_modal_opened`
- `wechat_config_saved`
- `license_submitted`
- `license_verified`
- `wechat_sync_started`
- `wechat_sync_succeeded`
- `wechat_sync_failed`

Analytics metadata:

- template id
- content length bucket
- image count bucket
- platform
- error code

Do not send article text, HTML, image data, API keys, or AppSecret.

## 12. Implementation Plan For Claude Code

### Task 0: Read Before Coding

Before implementation:

1. Read `AGENTS.md`.
2. Read this document.
3. Read relevant Next.js 16 docs under `node_modules/next/dist/docs/` before touching route handlers, App Router metadata, or server behavior.
4. Run `npm run lint` and `npm run build` to capture baseline.

### Task 1: Clean Commercial Claims

Files:

- `app/_components/landing/features.tsx`
- `app/_components/landing/faq.tsx`
- `app/_components/landing/pricing-section.tsx`
- `app/_components/wechat-sync-modal.tsx`

Work:

- Remove or soften unsupported claims about LaTeX rendering and 20+ code themes unless implemented.
- Replace "encrypted localStorage" language with accurate local-only wording.
- Make Pro copy say "early access" and describe current egress IP detection/whitelist diagnostics instead of fixed-IP stability unless a worker is deployed.

Verify:

- Landing page remains coherent.
- No false claims remain.

### Task 2: Fix WeChat Sync Type Safety

Files:

- `app/api/wechat/ip/route.ts`
- `app/api/wechat/sync/route.ts`
- `app/api/wechat/utils.ts`

Work:

- Remove `any` casts.
- Add a typed WeChat error class or typed error metadata helper.
- Keep current behavior.

Verify:

- `npm run lint`
- `npm run build`

### Task 3: Add License Gate

Suggested files:

- `app/_types/billing.ts`
- `app/_lib/license.ts`
- `app/api/license/verify/route.ts`
- `app/_hooks/use-license.ts`
- `app/_components/license-modal.tsx`

Work:

- Add local license key entry UI.
- Store raw license key in localStorage only if user chooses to remember it.
- Send license key to `/api/license/verify`.
- Server compares only hashed values.
- WeChat sync requires verified active license.

Phase 1 storage:

- Prefer Postgres if `DATABASE_URL` is available.
- If database is not ready, implement a temporary environment-driven license provider with hashed keys and clearly mark it as temporary in this document or a follow-up migration note.

Verify:

- Free copy flow still works.
- WeChat sync is blocked without a license.
- Valid license unlocks sync.
- Invalid/expired license shows a clear error.

### Task 4: Extract WeChat Adapter

Suggested files:

- `app/_lib/publishing/types.ts`
- `app/_lib/publishing/adapters/wechat.ts`
- `app/_lib/publishing/render.ts`
- `app/api/publish/wechat/route.ts`

Work:

- Move WeChat-specific sync logic behind an adapter boundary.
- Keep the current UI working.
- Do not add other platforms yet.

Verify:

- Existing WeChat sync behavior remains intact.
- Adapter interface can express future platform capabilities.

### Task 5: Optional Fixed-IP Worker Integration (Paused)

Status: paused. The current product direction does not buy or operate a VPS worker. Keep the code path available for future deployment, but do not treat it as the default Pro implementation.

New package/location options:

- `worker/` for a separate Node service, or
- separate repository if deployment requires it.

Work:

- Next.js route validates license and sends a signed request to worker.
- Worker validates HMAC signature.
- Worker calls WeChat APIs.
- Worker returns normalized publish result.

Verify:

- Request without signature fails.
- Request with invalid signature fails.
- Successful request creates WeChat draft.
- Worker logs redact secrets and content.

### Task 6: Add Publish Job Logging

Suggested files:

- `app/_lib/publishing/jobs.ts`
- `app/_lib/db/*`

Work:

- Add `publish_jobs` persistence.
- Log status transitions.
- Store only metadata, not article body.

Verify:

- Success and failure jobs are recorded.
- Logs do not contain secrets or full content.

### Task 7: Add Early Access CTA

Files:

- `app/_components/landing/pricing-section.tsx`
- Optional new component: `app/_components/landing/early-access.tsx`

Work:

- Replace generic Pro button with an early access action.
- If no email service is ready, use a mailto link or manual contact link.
- Later replace with a waitlist form.

Verify:

- User understands Free vs Pro.
- Pro CTA does not imply automated payment unless payment exists.

## 13. Launch Checklist

Before accepting paid users:

- `npm run lint` clean.
- `npm run build` passes.
- WeChat sync tested with at least 5 accounts.
- Current egress IP detection and whitelist limitations documented for users.
- Privacy copy updated.
- Terms/refund policy drafted, even if simple.
- Manual license issue process documented.
- Customer support contact visible.
- Analytics events live.

## 14. Open Questions

These should be answered before Phase 2, not before Phase 1:

1. Which database provider will be used long-term?
2. Which payment provider will be used after founder-led sales?
3. Will TypeZen store article drafts in the cloud?
4. Will users authorize and save platform credentials server-side?
5. Which second platform has the strongest real demand: Zhihu, X/Twitter, or Xiaohongshu?

## 15. Strong Recommendation

Build in this order:

1. Preserve the existing free editor promise and explain the open-core boundary.
2. Make current claims honest.
3. Make WeChat sync reliable within the current app-hosted path and keep IP diagnostics honest.
4. Gate it with a simple Pro license.
5. Sell to 10 real users from the existing power-user base.
6. Add a small database for licenses and publish jobs once paid sync starts.
7. Only then add accounts, automated payment, and more platforms.

The commercial risk is not that TypeZen lacks features. The commercial risk is building a broad content suite before proving that users will pay for the narrow automation pain.

The trust risk is turning years of free/open-source goodwill into resentment. Commercialization should feel like: "the free tool survives because Pro funds the hard hosted automation."
