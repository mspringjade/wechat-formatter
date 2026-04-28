import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import type { AiProviderType } from "../../_types/formatter";
import { openRouterConfig } from "../../_lib/formatter-constants";

const MAX_INPUT_LENGTH = 15000;

const SYSTEM_PROMPT = `你是一个微信公众号 Markdown 排版专家。你的任务是优化用户提供的 Markdown 文本的**排版结构**，使其更适合微信公众号阅读体验。

## 你必须遵守的规则

1. **绝不改写原文内容**：不修改任何句子的语义、不增减事实、不润色措辞。
2. **绝不删除任何内容**：所有原文段落、图片、链接、代码块、表格都必须完整保留。
3. **只调整排版结构**，具体包括：
   - 修正标题层级（确保 h1 → h2 → h3 逐级递进，不跳级）
   - 在段落之间补充合理的空行
   - 将松散的列举内容整理为有序/无序列表
   - 为关键词或核心观点添加 **加粗** 标记
   - 适当使用 > 引用来突出金句或重要提示
   - 在内容分界处添加 --- 分隔线
4. **保持原有的 Markdown 语法**：图片 ![alt](url)、链接 [text](url)、代码块 \`\`\`lang ... \`\`\`、表格等原样保留。
5. **只输出最终的 Markdown 文本**，不要输出解释、注释或任何多余内容。不要用代码块包裹整个输出。`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { markdown, providerType, baseUrl, apiKey, model } = body as {
      markdown?: string;
      providerType?: AiProviderType;
      baseUrl?: string;
      apiKey?: string;
      model?: string;
    };

    if (!markdown || typeof markdown !== "string" || !markdown.trim()) {
      return Response.json(
        { error: "请提供需要排版的 Markdown 内容" },
        { status: 400 },
      );
    }

    if (markdown.length > MAX_INPUT_LENGTH) {
      return Response.json(
        {
          error: `内容过长（${markdown.length} 字符），请控制在 ${MAX_INPUT_LENGTH} 字符以内`,
        },
        { status: 400 },
      );
    }

    const trimmedApiKey = apiKey?.trim();
    if (!trimmedApiKey) {
      return Response.json(
        { error: "请先填写 API Key" },
        { status: 400 },
      );
    }

    const selectedProvider: AiProviderType =
      providerType === "anthropic" || providerType === "openai"
        ? providerType
        : "openrouter";

    const trimmedBaseUrl = baseUrl?.trim() || openRouterConfig.baseUrl;
    if (selectedProvider !== "openrouter" && !baseUrl?.trim()) {
      return Response.json(
        { error: "请先填写 API 地址" },
        { status: 400 },
      );
    }

    const trimmedModel = model?.trim();
    if (!trimmedModel) {
      return Response.json(
        { error: "请先填写 AI 模型名称" },
        { status: 400 },
      );
    }

    const languageModel =
      selectedProvider === "anthropic"
        ? createAnthropic({
            apiKey: trimmedApiKey,
            baseURL: trimmedBaseUrl,
          })(trimmedModel)
        : createOpenAI({
            apiKey: trimmedApiKey,
            baseURL: trimmedBaseUrl,
          }).chat(trimmedModel);

    const result = streamText({
      model: languageModel,
      system: SYSTEM_PROMPT,
      prompt: markdown,
      temperature: 0.3,
    });

    return result.toTextStreamResponse();
  } catch (err: unknown) {
    console.error("AI format error:", err);

    const message = err instanceof Error ? err.message : "";
    if (/auth|api key|unauthorized|401/i.test(message)) {
      return Response.json(
        { error: "API Key 无效或无权限，请检查后重试" },
        { status: 401 },
      );
    }

    if (/model|not found|404/i.test(message)) {
      return Response.json(
        { error: "模型不可用，请检查模型名称是否正确" },
        { status: 400 },
      );
    }

    if (/quota|credit|billing|insufficient|payment|429/i.test(message)) {
      return Response.json(
        { error: "模型服务额度不足或请求过于频繁，请检查服务商账户状态" },
        { status: 429 },
      );
    }

    return Response.json(
      { error: message || "AI 排版服务异常，请稍后重试" },
      { status: 500 },
    );
  }
}
