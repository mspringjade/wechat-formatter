import { Anthropic, OpenAI, OpenRouter } from "@lobehub/icons";
import { Check, ExternalLink, Loader2, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type React from "react";
import { openRouterConfig } from "../_lib/formatter-constants";
import type { AiProviderType, OpenRouterModel } from "../_types/formatter";

let cachedModels: OpenRouterModel[] | null = null;
let pendingModelsRequest: Promise<OpenRouterModel[]> | null = null;

const loadOpenRouterModels = async () => {
  if (cachedModels) return cachedModels;

  pendingModelsRequest ??= fetch("/api/openrouter-models").then(async (res) => {
    const data = (await res.json().catch(() => null)) as {
      models?: OpenRouterModel[];
      error?: string;
    } | null;

    if (!res.ok) {
      throw new Error(data?.error || "模型列表加载失败");
    }

    cachedModels = data?.models || [];
    return cachedModels;
  });

  try {
    return await pendingModelsRequest;
  } finally {
    pendingModelsRequest = null;
  }
};

const formatContextLength = (contextLength: number) => {
  if (!contextLength) return "未知";
  if (contextLength >= 1000000) return `${(contextLength / 1000000).toFixed(1)}M`;
  if (contextLength >= 1000) return `${Math.round(contextLength / 1000)}K`;

  return `${contextLength}`;
};

const formatModelPrice = (model: OpenRouterModel) => {
  if (model.isFree) return "免费";

  const promptPrice = Number(model.promptPrice) * 1000000;
  const completionPrice = Number(model.completionPrice) * 1000000;
  if (
    !Number.isFinite(promptPrice) ||
    !Number.isFinite(completionPrice) ||
    promptPrice <= 0 ||
    completionPrice <= 0
  ) {
    return "价格见 OpenRouter";
  }

  return `$${promptPrice.toFixed(3)} / $${completionPrice.toFixed(3)} 每 1M tokens`;
};

type ProviderDraft = {
  baseUrl: string;
  apiKey: string;
  model: string;
};

const emptyDraft: ProviderDraft = {
  baseUrl: "",
  apiKey: "",
  model: "",
};

const providerBaseUrlPlaceholders: Record<AiProviderType, string> = {
  openrouter: openRouterConfig.baseUrl,
  openai: "https://api.openai.com/v1",
  anthropic: "https://api.anthropic.com/v1",
};

const createEmptyProviderDrafts = (): Record<AiProviderType, ProviderDraft> => ({
  openrouter: {
    ...emptyDraft,
    baseUrl: openRouterConfig.baseUrl,
  },
  openai: { ...emptyDraft },
  anthropic: { ...emptyDraft },
});

type AiConfigModalProps = {
  open: boolean;
  aiProviderType: AiProviderType;
  setAiProviderType: React.Dispatch<React.SetStateAction<AiProviderType>>;
  aiBaseUrl: string;
  setAiBaseUrl: React.Dispatch<React.SetStateAction<string>>;
  aiApiKey: string;
  setAiApiKey: React.Dispatch<React.SetStateAction<string>>;
  aiModel: string;
  setAiModel: React.Dispatch<React.SetStateAction<string>>;
  onClose: () => void;
  onSave: () => void;
  onClear: () => void;
};

export function AiConfigModal({
  open,
  aiProviderType,
  setAiProviderType,
  aiBaseUrl,
  setAiBaseUrl,
  aiApiKey,
  setAiApiKey,
  aiModel,
  setAiModel,
  onClose,
  onSave,
  onClear,
}: AiConfigModalProps) {
  const [models, setModels] = useState<OpenRouterModel[]>(cachedModels || []);
  const [modelQuery, setModelQuery] = useState("");
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [modelsError, setModelsError] = useState("");
  const isOpenRouter = aiProviderType === "openrouter";
  const [providerDrafts, setProviderDrafts] = useState<Record<AiProviderType, ProviderDraft>>(
    () => createEmptyProviderDrafts(),
  );

  useEffect(() => {
    if (!open) return;

    setProviderDrafts((prev) => ({
      ...prev,
      [aiProviderType]: {
        baseUrl: aiBaseUrl,
        apiKey: aiApiKey,
        model: aiModel,
      },
    }));
  }, [open, aiProviderType, aiBaseUrl, aiApiKey, aiModel]);

  useEffect(() => {
    if (!open || !isOpenRouter || cachedModels) return;

    let cancelled = false;
    setIsLoadingModels(true);
    setModelsError("");

    loadOpenRouterModels()
      .then((loadedModels) => {
        if (!cancelled) setModels(loadedModels);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setModelsError(err instanceof Error ? err.message : "模型列表加载失败");
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoadingModels(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, isOpenRouter]);

  const filteredModels = useMemo(() => {
    const query = modelQuery.trim().toLowerCase();
    if (!query) return models.slice(0, 80);

    return models
      .filter((model) => {
        return (
          model.name.toLowerCase().includes(query) ||
          model.id.toLowerCase().includes(query)
        );
      })
      .slice(0, 80);
  }, [models, modelQuery]);

  const handleClear = () => {
    setModelQuery("");
    setProviderDrafts(createEmptyProviderDrafts());
    onClear();
  };

  const syncCurrentDraft = (patch: Partial<ProviderDraft>) => {
    setProviderDrafts((prev) => ({
      ...prev,
      [aiProviderType]: {
        ...prev[aiProviderType],
        ...patch,
      },
    }));
  };

  const handleBaseUrlChange = (value: string) => {
    setAiBaseUrl(value);
    syncCurrentDraft({ baseUrl: value });
  };

  const handleApiKeyChange = (value: string) => {
    setAiApiKey(value);
    syncCurrentDraft({ apiKey: value });
  };

  const handleModelChange = (value: string) => {
    setAiModel(value);
    syncCurrentDraft({ model: value });
  };

  const handleProviderChange = (provider: AiProviderType) => {
    if (provider === aiProviderType) return;

    const nextDrafts = {
      ...providerDrafts,
      [aiProviderType]: {
        baseUrl: aiBaseUrl,
        apiKey: aiApiKey,
        model: aiModel,
      },
    };
    const targetDraft = nextDrafts[provider];
    const targetBaseUrl =
      provider === "openrouter"
        ? targetDraft.baseUrl || openRouterConfig.baseUrl
        : targetDraft.baseUrl;

    setProviderDrafts(nextDrafts);
    setAiProviderType(provider);
    setAiBaseUrl(targetBaseUrl);
    setAiApiKey(targetDraft.apiKey);
    setAiModel(targetDraft.model);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center neo-modal-backdrop"
      onClick={onClose}
    >
      <div
        className="neo-modal p-6 max-w-2xl w-full mx-4 transform transition-all max-h-[90vh] overflow-y-auto custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-5">
          <h3 className="text-xl font-black text-(--neo-ink) mb-2 uppercase">AI 服务配置</h3>
          <p className="text-sm neo-text-muted font-bold">
            支持 OpenRouter，以及 OpenAI / Anthropic 格式 API 接口
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-black text-(--neo-ink) mb-2">
              API 类型
            </label>
            <div className="grid grid-cols-3 gap-2 bg-(--neo-cyan) border-[3px] border-(--neo-ink) p-2">
              <button
                type="button"
                onClick={() => handleProviderChange("openrouter")}
                className={`py-2 text-xs sm:text-sm flex items-center justify-center gap-2 ${
                  isOpenRouter ? "neo-tab neo-tab-active" : "neo-tab"
                }`}
              >
                <OpenRouter size={16} />
                OpenRouter
              </button>
              <button
                type="button"
                onClick={() => handleProviderChange("openai")}
                className={`py-2 text-xs sm:text-sm flex items-center justify-center gap-2 ${
                  aiProviderType === "openai" ? "neo-tab neo-tab-active" : "neo-tab"
                }`}
              >
                <OpenAI size={16} />
                OpenAI
              </button>
              <button
                type="button"
                onClick={() => handleProviderChange("anthropic")}
                className={`py-2 text-xs sm:text-sm flex items-center justify-center gap-2 ${
                  aiProviderType === "anthropic" ? "neo-tab neo-tab-active" : "neo-tab"
                }`}
              >
                <Anthropic size={16} />
                Anthropic
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between gap-3 mb-1">
              <label className="block text-sm font-black text-(--neo-ink)">
                API 地址
              </label>
              {isOpenRouter && (
                <button
                  type="button"
                  onClick={() => handleBaseUrlChange(openRouterConfig.baseUrl)}
                  className="text-xs font-black underline text-(--neo-ink)"
                >
                  恢复默认
                </button>
              )}
            </div>
            <input
              type="text"
              value={aiBaseUrl}
              readOnly={isOpenRouter}
              onChange={(e) => handleBaseUrlChange(e.target.value)}
              className={`neo-input w-full px-3 py-2 ${isOpenRouter ? "bg-(--neo-surface)" : ""}`}
              placeholder={
                providerBaseUrlPlaceholders[aiProviderType]
              }
              autoComplete="off"
            />
          </div>

          <div>
            <div className="flex items-center justify-between gap-3 mb-1">
              <label className="block text-sm font-black text-(--neo-ink)">
                API Key
              </label>
              {isOpenRouter && (
                <a
                  href={openRouterConfig.apiKeyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-black underline text-(--neo-ink) inline-flex items-center gap-1"
                >
                  获取 OpenRouter API Key
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            <input
              type="password"
              value={aiApiKey}
              onChange={(e) => handleApiKeyChange(e.target.value)}
              className="neo-input w-full px-3 py-2"
              placeholder="粘贴你的 API Key"
              autoComplete="off"
            />
          </div>

          <div>
            <label className="block text-sm font-black text-(--neo-ink) mb-1">
              {isOpenRouter ? "已选模型" : "模型名称"}
            </label>
            <input
              type="text"
              value={aiModel}
              onChange={(e) => handleModelChange(e.target.value)}
              className="neo-input w-full px-3 py-2"
              placeholder={
                isOpenRouter
                  ? "选择下方模型，或手动输入 OpenRouter 模型 ID"
                  : aiProviderType === "anthropic"
                    ? "claude-sonnet-4-5"
                    : "gpt-4o 或自定义模型名称"
              }
              autoComplete="off"
            />
          </div>

          {isOpenRouter && (
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <label className="block text-sm font-black text-(--neo-ink)">
                  搜索模型
                </label>
                <a
                  href={openRouterConfig.modelsPageUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-black underline text-(--neo-ink) inline-flex items-center gap-1"
                >
                  浏览模型库
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-(--neo-ink)" />
                <input
                  type="text"
                  value={modelQuery}
                  onChange={(e) => setModelQuery(e.target.value)}
                  className="neo-input w-full pl-9 pr-3 py-2"
                  placeholder="输入模型名称或 ID，例如 qwen、gemini、:free"
                  autoComplete="off"
                />
              </div>

              <div className="border-[3px] border-(--neo-ink) bg-(--neo-surface) max-h-64 overflow-y-auto custom-scrollbar">
                {isLoadingModels && (
                  <div className="p-4 text-sm font-black text-(--neo-ink) flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    正在加载 OpenRouter 模型列表
                  </div>
                )}

                {!isLoadingModels && modelsError && (
                  <div className="p-4 space-y-2">
                    <p className="text-sm font-black text-(--neo-ink)">{modelsError}</p>
                    <p className="text-xs neo-text-muted font-bold">
                      你仍然可以在“已选模型”里手动输入模型 ID。
                    </p>
                  </div>
                )}

                {!isLoadingModels && !modelsError && filteredModels.length === 0 && (
                  <div className="p-4 text-sm font-black text-(--neo-ink)">
                    没有匹配的模型，可以手动输入模型 ID。
                  </div>
                )}

                {!isLoadingModels &&
                  !modelsError &&
                  filteredModels.map((model) => (
                    <button
                      key={model.id}
                      type="button"
                      onClick={() => handleModelChange(model.id)}
                      className={`w-full text-left p-3 border-b-2 border-(--neo-ink) last:border-b-0 hover:bg-(--neo-cyan) ${
                        aiModel === model.id ? "bg-(--neo-yellow)" : ""
                      }`}
                      title={model.description}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-black text-sm text-(--neo-ink) truncate">
                              {model.name}
                            </span>
                            {aiModel === model.id && (
                              <Check className="w-4 h-4 shrink-0 text-(--neo-ink)" />
                            )}
                          </div>
                          <p className="text-xs neo-text-muted font-bold break-all">
                            {model.id}
                          </p>
                        </div>
                        <div className="text-right shrink-0 space-y-1">
                          <span
                            className={`inline-block border-2 border-(--neo-ink) px-1.5 py-0.5 text-[10px] font-black ${
                              model.isFree
                                ? "bg-(--neo-green) text-[#111111]"
                                : "bg-(--neo-surface) text-(--neo-ink)"
                            }`}
                          >
                            {model.isFree ? "免费" : "付费"}
                          </span>
                          <p className="text-[10px] neo-text-muted font-bold">
                            {formatContextLength(model.contextLength)} ctx
                          </p>
                        </div>
                      </div>
                      <p className="text-[10px] neo-text-muted font-bold mt-1">
                        {formatModelPrice(model)}
                      </p>
                    </button>
                  ))}
              </div>
            </div>
          )}

          <p className="text-xs leading-relaxed neo-text-muted font-bold">
            配置只保存在当前浏览器本地，排版时会临时发送到服务端调用你选择的模型服务。
            {isOpenRouter && " 模型列表来自 OpenRouter，免费模型会优先展示。"}
          </p>
        </div>

        <div className="flex gap-3 mt-5">
          <button
            onClick={onSave}
            className="neo-button neo-button-primary flex-1 py-2.5"
          >
            保存配置
          </button>
          <button
            onClick={handleClear}
            className="neo-button neo-button-secondary px-4 py-2.5"
          >
            清空
          </button>
          <button
            onClick={onClose}
            className="neo-button neo-button-ghost px-4 py-2.5"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  );
}
