import { openRouterConfig } from "../../_lib/formatter-constants";
import type { OpenRouterModel } from "../../_types/formatter";

type OpenRouterApiModel = {
  id?: unknown;
  name?: unknown;
  description?: unknown;
  context_length?: unknown;
  pricing?: {
    prompt?: unknown;
    completion?: unknown;
    request?: unknown;
  };
};

type OpenRouterModelsResponse = {
  data?: unknown;
};

const parsePrice = (price: unknown) => {
  if (typeof price !== "string" && typeof price !== "number") return 0;

  const parsed = Number(price);
  return Number.isFinite(parsed) ? parsed : 0;
};

const formatPrice = (price: unknown) => {
  const parsed = parsePrice(price);
  if (parsed === 0) return "0";

  return parsed.toString();
};

const isFreeModel = (model: OpenRouterApiModel) => {
  const id = typeof model.id === "string" ? model.id : "";
  if (id === "openrouter/free" || id.endsWith(":free")) return true;

  return (
    parsePrice(model.pricing?.prompt) === 0 &&
    parsePrice(model.pricing?.completion) === 0 &&
    parsePrice(model.pricing?.request) === 0
  );
};

const normalizeModel = (model: OpenRouterApiModel): OpenRouterModel | null => {
  if (typeof model.id !== "string" || typeof model.name !== "string") {
    return null;
  }

  return {
    id: model.id,
    name: model.name,
    description: typeof model.description === "string" ? model.description : "",
    contextLength: typeof model.context_length === "number" ? model.context_length : 0,
    promptPrice: formatPrice(model.pricing?.prompt),
    completionPrice: formatPrice(model.pricing?.completion),
    isFree: isFreeModel(model),
  };
};

const sortModels = (a: OpenRouterModel, b: OpenRouterModel) => {
  if (a.isFree !== b.isFree) return a.isFree ? -1 : 1;

  return a.name.localeCompare(b.name, "zh-Hans-CN");
};

export async function GET() {
  try {
    const response = await fetch(openRouterConfig.modelsApiUrl, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60 * 30 },
    });

    if (!response.ok) {
      return Response.json(
        { error: "OpenRouter 模型列表暂时不可用，请稍后重试" },
        { status: response.status },
      );
    }

    const payload = (await response.json()) as OpenRouterModelsResponse;
    const rawModels = Array.isArray(payload.data) ? payload.data : [];
    const models = rawModels
      .map((model) => normalizeModel(model as OpenRouterApiModel))
      .filter((model): model is OpenRouterModel => Boolean(model))
      .sort(sortModels);

    return Response.json({ models });
  } catch {
    return Response.json(
      { error: "OpenRouter 模型列表加载失败，请检查网络后重试" },
      { status: 500 },
    );
  }
}
