import { useEffect, useState } from "react";
import { aiStorageKeys, openRouterConfig } from "../_lib/formatter-constants";
import type { AiProviderType } from "../_types/formatter";
import type { ShowToast } from "./use-toast";

export function useAiSettings(showToast: ShowToast) {
  const [showAiConfigModal, setShowAiConfigModal] = useState(false);
  const [aiProviderType, setAiProviderType] = useState<AiProviderType>("openrouter");
  const [aiBaseUrl, setAiBaseUrl] = useState<string>(openRouterConfig.baseUrl);
  const [aiApiKey, setAiApiKey] = useState("");
  const [aiModel, setAiModel] = useState("");

  useEffect(() => {
    const savedProvider = localStorage.getItem(aiStorageKeys.provider);
    if (
      savedProvider === "openrouter" ||
      savedProvider === "openai" ||
      savedProvider === "anthropic"
    ) {
      setAiProviderType(savedProvider);
    }
    setAiBaseUrl(localStorage.getItem(aiStorageKeys.baseUrl) || openRouterConfig.baseUrl);
    setAiApiKey(localStorage.getItem(aiStorageKeys.apiKey) || "");
    setAiModel(localStorage.getItem(aiStorageKeys.model) || "");
  }, []);

  const saveAiSettings = () => {
    const trimmedBaseUrl = aiBaseUrl.trim();
    const trimmedApiKey = aiApiKey.trim();
    const trimmedModel = aiModel.trim();

    if (!trimmedBaseUrl || !trimmedApiKey || !trimmedModel) {
      showToast("请填写 API 地址、API Key 和模型名称", "error");
      return;
    }

    localStorage.setItem(aiStorageKeys.provider, aiProviderType);
    localStorage.setItem(aiStorageKeys.baseUrl, trimmedBaseUrl);
    localStorage.setItem(aiStorageKeys.apiKey, trimmedApiKey);
    localStorage.setItem(aiStorageKeys.model, trimmedModel);
    setAiBaseUrl(trimmedBaseUrl);
    setAiApiKey(trimmedApiKey);
    setAiModel(trimmedModel);
    setShowAiConfigModal(false);
    showToast("AI 配置已保存");
  };

  const clearAiSettings = () => {
    localStorage.removeItem(aiStorageKeys.provider);
    localStorage.removeItem(aiStorageKeys.baseUrl);
    localStorage.removeItem(aiStorageKeys.apiKey);
    localStorage.removeItem(aiStorageKeys.model);
    setAiProviderType("openrouter");
    setAiBaseUrl(openRouterConfig.baseUrl);
    setAiApiKey("");
    setAiModel("");
    showToast("AI 配置已清空");
  };

  return {
    showAiConfigModal,
    setShowAiConfigModal,
    aiProviderType,
    setAiProviderType,
    aiBaseUrl,
    setAiBaseUrl,
    aiApiKey,
    setAiApiKey,
    aiModel,
    setAiModel,
    saveAiSettings,
    clearAiSettings,
  };
}
