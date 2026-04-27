import { useCallback, useState } from "react";
import type { AiProviderType } from "../_types/formatter";
import type { ShowToast } from "./use-toast";

type UseAiFormatParams = {
  inputText: string;
  setInputText: (value: string) => void;
  aiProviderType: AiProviderType;
  aiBaseUrl: string;
  aiApiKey: string;
  aiModel: string;
  setShowAiConfigModal: (value: boolean) => void;
  showToast: ShowToast;
};

export function useAiFormat({
  inputText,
  setInputText,
  aiProviderType,
  aiBaseUrl,
  aiApiKey,
  aiModel,
  setShowAiConfigModal,
  showToast,
}: UseAiFormatParams) {
  const [isAiFormatting, setIsAiFormatting] = useState(false);

  const handleAiFormat = useCallback(async () => {
    if (!inputText.trim() || isAiFormatting) return;

    const trimmedBaseUrl = aiBaseUrl.trim();
    const trimmedApiKey = aiApiKey.trim();
    const trimmedModel = aiModel.trim();
    if (!trimmedBaseUrl || !trimmedApiKey || !trimmedModel) {
      setShowAiConfigModal(true);
      showToast("请先配置 AI 服务地址、API Key 和模型", "error");
      return;
    }

    setIsAiFormatting(true);
    const originalText = inputText;
    try {
      const res = await fetch("/api/ai-format", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          markdown: inputText,
          providerType: aiProviderType,
          baseUrl: trimmedBaseUrl,
          apiKey: trimmedApiKey,
          model: trimmedModel,
        }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        showToast(data?.error || "AI 排版失败，请重试", "error");
        return;
      }

      if (!res.body) {
        showToast("AI 排版服务未返回流式内容，请重试", "error");
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let streamedText = "";
      setInputText("");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        streamedText += decoder.decode(value, { stream: true });
        setInputText(streamedText);
      }

      streamedText += decoder.decode();
      const finalText = streamedText.trim();

      if (!finalText) {
        setInputText(originalText);
        showToast("AI 返回内容为空，请重试", "error");
        return;
      }

      setInputText(finalText);
      showToast("AI 排版完成");
    } catch {
      setInputText(originalText);
      showToast("网络错误，请稍后重试", "error");
    } finally {
      setIsAiFormatting(false);
    }
  }, [
    inputText,
    isAiFormatting,
    aiProviderType,
    aiBaseUrl,
    aiApiKey,
    aiModel,
    setInputText,
    setShowAiConfigModal,
    showToast,
  ]);

  return { isAiFormatting, handleAiFormat };
}
