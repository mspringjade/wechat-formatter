export const sampleText = `# 给你的公众号穿上不同风格的衣服

好的排版就像是人穿上了得体的衣服，能瞬间提升阅读体验。不同类型的文章，适合不同的排版风格。这也是这款**Markdown一键排版工具**诞生的初衷。

## 第1步：为什么需要排版？

在自媒体高度发达的时代，**优质内容**是王道，而*精美排版*是入场券。

> 排版是一种无声的语言，传递着作者的情感与态度。

## 第2步：工具特点

1. **多分类储备**：提供了跨越5大类、整整50套视觉模板
2. **支持Markdown**：抛掉繁琐操作，一次编写处处使用
3. **实时预览**：你在左侧修改，中间屏幕立刻刷新展现结果
4. **一键复制**：点击右上角，去公众号后台直接粘贴
5. **快捷插图**：支持直接粘贴电脑上的截图
6. **多排支持**：支持微信常见的图片并排（多排）布局

## 第3步：图片体验

这是一张普通的单图效果展示（你也可以自己随时粘贴截图）：

![风景](https://picsum.photos/seed/pic1/800/400)

这是**多图并排（多排）效果**展示，只需要把多张图片放在同一行（或是中间不掺杂文字和空行连续排列），就会自动均分宽度排版：

![工作1](https://picsum.photos/seed/pic2/400/400) ![工作2](https://picsum.photos/seed/pic3/400/400) ![工作3](https://picsum.photos/seed/pic4/400/400)

来一段代码体验：
\`\`\`javascript
function loveTech() {
  console.log('科技改变排版')
}
\`\`\`

## 第4步：开始使用吧
无论是哪种风格，都可以通过设置**重点内容**，让读者一眼抓取核心信息。赶快来试试这50套全新的排版模板，让你的文章在朋友圈**脱颖而出**！`;

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
