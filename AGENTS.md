# 项目指南：公众号一键排版助手 Pro (WeChat Formatter Pro)

## 项目概述

TypeZen 是一款专为微信公众号设计的「Markdown 转微信排版」辅助工具。用户编写 Markdown 文本后，可以使用 AI 一键优化排版结构，再套用 72 套不同风格的精美模板，可直接复制粘贴到微信公众平台后台。

## 技术栈

- **框架**: Next.js 16.2.0 (App Router)
- **UI 库**: React 19.2.4
- **样式**: Tailwind CSS 4
- **Markdown 解析**: marked 17.0.4
- **AI SDK**: Vercel AI SDK 6，`@ai-sdk/openai`，`@ai-sdk/anthropic`
- **图标**: lucide-react，@lobehub/icons（OpenRouter / OpenAI / Anthropic 品牌图标）
- **语言**: TypeScript 5
- **代码检查**: Biome

> **重要**: Next.js 16 有破坏性变更，API、约定和文件结构可能与训练数据不同。编写代码前请先阅读 `node_modules/next/dist/docs/` 中的相关指南。

## 项目结构

```
wechat-formatter-pro/
├── app/
│   ├── _components/              # 页面拆分组件（编辑区、预览区、设置面板、AI 配置弹窗等）
│   ├── _hooks/                   # 业务 hooks（AI 排版、AI 配置、复制、滚动同步、主题等）
│   ├── _lib/                     # 页面常量（示例文案、AI localStorage keys、OpenRouter 配置）
│   ├── _types/                   # 页面共享类型
│   ├── api/
│   │   ├── ai-format/route.ts    # AI 一键排版接口（流式返回 Markdown）
│   │   └── openrouter-models/    # OpenRouter 文本模型列表代理接口
│   ├── page.tsx                  # 主页面组合组件（三栏布局）
│   ├── template-engine.ts        # 模板引擎和 Markdown 渲染逻辑
│   ├── layout.tsx                # 根布局、metadata、统计脚本、主题初始化
│   ├── json-ld.tsx               # 结构化数据
│   ├── manifest.ts               # PWA manifest
│   ├── robots.ts                 # robots 配置
│   ├── sitemap.ts                # sitemap 配置
│   ├── globals.css               # 全局样式与 Neo 风格变量
│   └── favicon.ico               # 网站图标
├── lib/
│   └── site-config.ts            # 站点品牌、标题、描述、URL 等 SEO 常量
├── public/                       # 静态资源
│   ├── logo.png                  # 网站 Logo
│   └── reward.png                # 赞赏码图片
├── .agents/skills/               # Agent 技能配置
├── package.json                  # 项目依赖
├── tsconfig.json                 # TypeScript 配置
├── next.config.ts                # Next.js 配置
├── postcss.config.mjs            # PostCSS 配置
└── biome.json                    # Biome 配置
```

## 核心功能模块

### 1. 模板系统 (`template-engine.ts`)

- **72 套模板**分为 6 大类：
  - `neo-brutalism` - 新粗野风（12套）：高饱和色彩、粗黑边框、硬投影
  - `minimalist` - 极简风（12套）：圆点、清爽边框
  - `business` - 商务风（12套）：方块标识符、专业严谨
  - `literary` - 文艺风（12套）：花朵图标、留白设计
  - `tech` - 科技风（12套）：尖角、极客终端风格
  - `festive` - 节庆风（12套）：星星标识、浓烈色彩

- **模板配置接口** `TemplateConfig`：
  - 基础样式：颜色、字体、背景色（`backgroundColor`，确保暗黑模式兼容）
  - 各元素样式：标题(h1-h3)、段落、引用、列表、代码块、图片、分隔线、链接、表格等

### 2. Markdown 渲染

- 使用 `marked` 库解析 Markdown
- 自定义渲染器将样式内联到 HTML 元素
- **关键约束**：微信公众号只支持内联样式(inline-css)，所有样式必须写入 `style=""` 属性

### 3. 页面布局 (`page.tsx`)

- **三栏响应式布局**：
  - 左侧：Markdown 输入区、工具栏、AI 一键排版按钮
  - 中间：手机框预览区（模拟 iPhone 外观）
  - 右侧：模板选择、主题色与排版参数调整
- **移动端适配**：Tab 切换模式
- **一键复制**：使用 `document.execCommand('copy')` 复制渲染后的 HTML
- **滚动同步**：桌面端可开启编辑区与预览区同步滚动功能（移动端隐藏）
- **赞赏功能**：顶栏赞赏按钮，点击弹出赞赏码弹窗
- **Neo 风格界面**：使用 CSS 变量统一管理亮色/暗色主题下的高对比边框、硬投影和主题色

### 4. AI 一键排版

- **前端 hooks**：
  - `use-ai-settings.ts`：管理 AI 配置弹窗状态、provider、baseUrl、apiKey、model，并使用 `localStorage` 本地保存
  - `use-ai-format.ts`：校验配置并请求 `/api/ai-format`，读取流式响应后实时写回编辑区
- **配置弹窗**：`ai-config-modal.tsx`
  - 支持 `openrouter`、`openai`、`anthropic`
  - OpenRouter 使用固定默认地址 `https://openrouter.ai/api/v1`
  - OpenAI / Anthropic 支持用户自定义兼容 API 地址
  - OpenRouter 模型列表来自 `/api/openrouter-models`，免费模型优先展示
  - OpenRouter / OpenAI / Anthropic 使用 @lobehub/icons 品牌图标
- **服务端接口**：
  - `/api/ai-format`：使用 Vercel AI SDK 调用模型并流式返回 Markdown
  - `/api/openrouter-models`：代理 OpenRouter 模型列表，标准化模型名称、价格、上下文长度与免费状态
- **安全边界**：
  - API Key 仅保存在当前浏览器本地
  - 排版时会临时发送到服务端调用模型服务
  - 项目不持久化保存用户 API Key
- **内容约束**：
  - 系统提示词要求 AI 不改写原文、不删除内容、不增补事实
  - 只允许调整标题层级、空行、列表、加粗、引用、分隔线等 Markdown 排版结构

### 5. SEO 与站点元数据

- `lib/site-config.ts` 统一维护站点品牌、域名、默认标题、描述和 Open Graph 站点名
- `layout.tsx` 使用站点常量生成 metadata、Open Graph、Twitter Card、robots 配置和统计脚本
- `json-ld.tsx` 输出 WebApplication / SoftwareApplication / WebSite / Organization 结构化数据
- `manifest.ts` 使用站点常量生成 PWA 展示名称与简介
- `robots.ts`、`sitemap.ts` 使用统一站点 URL，避免 SEO 信息分散

## 开发环境

- Node.js 20.9.0 或更高版本（Next.js 16.2.0 的运行时要求）
- npm 或 pnpm

## 开发命令

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm run start

# 运行 Biome 检查
npm run lint
```

## 代码规范

### 样式约定

- 使用 Tailwind CSS 进行页面布局和样式
- 模板样式使用纯内联 CSS 字符串（兼容微信）
- 颜色使用标准 hex 格式（如 `#3b82f6`）

### 组件约定

- 使用 `'use client'` 标记客户端组件
- 使用 React Hooks 管理状态
- 事件处理函数定义在组件内部

### TypeScript 约定

- 接口定义放在文件顶部
- 避免使用 `any` 类型（渲染器除外，因 marked 类型复杂）
- 导出公共函数和类型

### AI 功能约定

- Provider 类型统一使用 `AiProviderType = "openrouter" | "openai" | "anthropic"`
- AI 配置 localStorage key 统一维护在 `aiStorageKeys`
- OpenRouter 默认地址、API Key 页面、模型页面与模型 API 地址统一维护在 `openRouterConfig`
- 不要在代码中硬编码任何用户 API Key 或服务端私钥
- `/api/ai-format` 必须继续返回流式文本响应，前端依赖 `ReadableStream` 逐步更新编辑区
- 修改 AI prompt 时必须保持“不改写原文、不删除内容、只调整 Markdown 排版结构”的核心约束
- 新增 provider 时需要同时更新类型定义、配置弹窗、设置持久化、服务端模型创建逻辑和文档说明

### SEO / 文案约定

- 项目介绍、模板数量、AI 能力描述需要同步更新：
  - `README.md`
  - `AGENTS.md`
  - `lib/site-config.ts`
  - `app/json-ld.tsx`
  - `app/manifest.ts`
  - `app/_lib/formatter-constants.ts`
- 当前模板数量是 72 套，分类数量是 6 类
- 当前核心定位是：TypeZen 免费在线 Markdown 转微信公众号排版工具，支持 AI 一键优化排版结构、实时预览、样式微调和一键复制发布

## 微信公众号兼容性注意事项

1. **样式内联**：所有 CSS 必须内联到 `style` 属性
2. **标签限制**：避免使用 `<script>`、部分 HTML5 语义标签
3. **布局方案**：
   - 外层容器使用 `<section>` 包裹，确保微信公众号智能广告系统能正常识别文章结构
   - 内部元素使用 `<section>` + `display: flex` 布局
4. **字体限制**：只能使用系统默认字体
5. **图片处理**：图片需要上传到微信服务器或使用微信支持的图床
6. **背景色**：使用 `background-color` 而非 `background` 简写，微信对简写支持差
7. **防止溢出**：
   - 表格添加 `table-layout: fixed; max-width: 100%;`
   - 单元格添加 `word-wrap: break-word; word-break: break-all;`
   - 避免使用 `width: max-content`，会导致内容溢出
8. **暗黑模式兼容**：
   - 必须为所有模板设置明确的 `backgroundColor` 属性
   - 外层 `<table>` 和内部 `<td>` 都需要设置 `background-color`
   - 防止用户电脑暗黑模式影响粘贴到公众号后的显示效果

## 常见开发任务

### 添加新模板

在 `template-engine.ts` 的 `colorPalettes`、`categoriesList` 和 `generateTemplates()` 中保持分类、配色和生成逻辑一致。新增分类后同步更新 README、AGENTS、站点 metadata 和示例文案。

### 修改 Markdown 渲染

在 `template-engine.ts` 的 `customRenderer` 对象中修改对应的渲染方法。

### 调整页面布局

修改 `page.tsx` 中的 Tailwind CSS 类名或组件结构。

### 添加新的排版参数

1. 在 `app/_types/formatter.ts` 的 `FormatTweaks` 中添加字段
2. 在 `page.tsx` 的默认微调配置中添加默认值
3. 在 `settings-pane.tsx` 中添加 UI 控件
4. 将参数传递给 `renderArticle()` 函数
5. 在 `template-engine.ts` 中将参数转换为微信公众号兼容的内联样式

### 添加交互功能

1. 使用 `useRef` 获取 DOM 元素引用
2. 使用 `useCallback` 包装事件处理函数（避免不必要的重渲染）
3. 对于需要阻止循环触发的场景，使用 `useRef` 作为标记（如 `isScrollingRef`）

### 修改 AI 一键排版

1. 前端配置状态优先修改 `use-ai-settings.ts`
2. 前端请求与流式读取逻辑优先修改 `use-ai-format.ts`
3. AI 配置弹窗 UI 修改 `ai-config-modal.tsx`
4. 模型调用逻辑修改 `app/api/ai-format/route.ts`
5. OpenRouter 模型列表逻辑修改 `app/api/openrouter-models/route.ts`
6. 修改 provider、存储 key、模型结构时同步更新 `app/_types/formatter.ts` 和 `app/_lib/formatter-constants.ts`

### 当前项目状态记录

- 已完成 AI 一键排版能力，支持 OpenRouter、OpenAI、Anthropic 三类接口
- 已完成 OpenRouter 模型列表拉取、搜索、免费模型优先展示和官方 OpenRouter 图标展示
- 已完成 Vercel AI SDK 流式 Markdown 返回，前端边接收边更新编辑区
- 已完成页面组件拆分：编辑区、预览区、设置面板、弹窗、toast、hooks 均已模块化
- 已完成 Neo 风格界面升级，使用 CSS 变量兼容亮色和暗色主题
- 已完成模板扩展到 72 套，当前分类为新粗野、极简、商务、文艺、科技、节庆 6 类
- 已完成样式微调能力：字号、行高、段落间距、首行缩进、页面留白、字间距、图片圆角和主题色
- 已完成站点配置常量化，metadata、JSON-LD、manifest、robots、sitemap 共用 `lib/site-config.ts` 的品牌与 URL 信息
- 已迁移到 Biome 进行代码检查与格式化

### 商业化规划记录

- 详细商业化与实施路线见 `docs/product/2026-05-11-commercialization-roadmap.md`
- 核心方向：TypeZen 从单纯「Markdown 转微信公众号排版工具」升级为「Markdown 写作者和小内容团队的多平台发布自动化工具」
- 第一阶段付费价值聚焦微信公众号草稿箱自动同步、图片转存、封面处理、当前出口 IP 探测/白名单诊断和同步错误定位；固定 IP Worker 因暂不购买服务器而暂停为未来可选方案
- 后续平台扩展必须通过 platform adapter 架构推进，避免把 X/Twitter、小红书、知乎等能力硬编码进微信同步链路
