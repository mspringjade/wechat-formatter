export const sampleText = `# 给你的公众号穿上不同风格的衣服

好的排版就像是人穿上了得体的衣服，能瞬间提升阅读体验。现在你可以先用 **TypeZen 智能一键排版** 梳理 Markdown 结构，再套用适合公众号阅读场景的视觉模板，让内容更清晰、更好读。

## 第 1 步：为什么需要 TypeZen？

在自媒体高度发达的时代，**优质内容**是王道，而*精美排版*是入场券。TypeZen 致力于让每一篇文字都能以最美的形态呈现。

> 排版是一种无声的语言，传递着作者的情感与态度。

## 第 2 步：TypeZen 工具特点

1. **智能一键优化**：在不改写原文内容的前提下，由 TypeZen 智能算法优化标题层级、空行、列表、引用与重点标记
2. **多分类储备**：提供了跨越 6 大类、整整 72 套视觉模板
3. **支持 Markdown**：抛掉繁琐操作，一次编写处处使用
4. **实时预览**：你在左侧修改，TypeZen 预览窗立刻刷新展现结果
5. **样式微调**：可调整字号、行高、段落间距、页面留白、主题色与图片圆角
6. **一键复制**：点击右上角，去公众号后台直接粘贴
7. **快捷插图**：支持直接粘贴电脑上的截图
8. **多排支持**：支持微信常见的图片并排（多排）布局

## 第 3 步：图片体验

这是一张普通的单图效果展示（你也可以自己随时粘贴截图）：

![风景](https://picsum.photos/seed/pic1/800/400)

这是**多图并排（多排）效果**展示，只需要把多张图片放在同一行（或是中间不掺杂文字 and 空行连续排列），就会自动均分宽度排版：

![工作1](https://picsum.photos/seed/pic2/400/400) ![工作2](https://picsum.photos/seed/pic3/400/400) ![工作3](https://picsum.photos/seed/pic4/400/400)

来一段代码体验：
\`\`\`javascript
function loveTech() {
  console.log('TypeZen 让排版更有趣')
}
\`\`\`

## 第 4 步：开始使用吧
无论是哪种风格，都可以通过 TypeZen 的智能算法整理结构、模板切换和细节微调来突出**重点内容**，让读者一眼抓取核心信息。赶快来试试这 72 套排版模板，让你的文章在朋友圈**脱颖而出**！`;

export const aiStorageKeys = {
  provider: "wechat-formatter-ai-provider",
  baseUrl: "wechat-formatter-ai-base-url",
  apiKey: "wechat-formatter-ai-api-key",
  model: "wechat-formatter-ai-model",
} as const;

export const openRouterConfig = {
  baseUrl: "https://openrouter.ai/api/v1",
  apiKeyUrl: "https://openrouter.ai/settings/keys",
  modelsPageUrl: "https://openrouter.ai/models",
  modelsApiUrl: "https://openrouter.ai/api/v1/models?output_modalities=text",
} as const;
