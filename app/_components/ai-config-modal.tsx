import { Anthropic, OpenAI } from "@lobehub/icons";
import type React from "react";
import type { AiProviderType } from "../_types/formatter";

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
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center neo-modal-backdrop"
      onClick={onClose}
    >
      <div
        className="neo-modal p-6 max-w-md w-full mx-4 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-5">
          <h3 className="text-xl font-black text-[var(--neo-ink)] mb-2 uppercase">AI 服务配置</h3>
          <p className="text-sm neo-text-muted font-bold">
            支持 OpenAI 接口和 Anthropic 原生接口
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-black text-[var(--neo-ink)] mb-2">
              API 类型
            </label>
            <div className="grid grid-cols-2 gap-2 bg-[var(--neo-cyan)] border-[3px] border-[var(--neo-ink)] p-2">
              <button
                type="button"
                onClick={() => setAiProviderType("openai")}
                className={`py-2 text-sm flex items-center justify-center gap-2 ${
                  aiProviderType === "openai"
                    ? "neo-tab neo-tab-active"
                    : "neo-tab"
                }`}
              >
                <OpenAI size={16} />
                OpenAI
              </button>
              <button
                type="button"
                onClick={() => setAiProviderType("anthropic")}
                className={`py-2 text-sm flex items-center justify-center gap-2 ${
                  aiProviderType === "anthropic"
                    ? "neo-tab neo-tab-active"
                    : "neo-tab"
                }`}
              >
                <Anthropic size={16} />
                Anthropic
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-black text-[var(--neo-ink)] mb-1">
              API 地址
            </label>
            <input
              type="text"
              value={aiBaseUrl}
              onChange={(e) => setAiBaseUrl(e.target.value)}
              className="neo-input w-full px-3 py-2"
              placeholder={
                aiProviderType === "anthropic"
                  ? "https://api.anthropic.com/v1"
                  : "https://api.openai.com/v1"
              }
              autoComplete="off"
            />
          </div>

          <div>
            <label className="block text-sm font-black text-[var(--neo-ink)] mb-1">
              API Key
            </label>
            <input
              type="password"
              value={aiApiKey}
              onChange={(e) => setAiApiKey(e.target.value)}
              className="neo-input w-full px-3 py-2"
              placeholder="粘贴你的 API Key"
              autoComplete="off"
            />
          </div>

          <div>
            <label className="block text-sm font-black text-[var(--neo-ink)] mb-1">
              模型名称
            </label>
            <input
              type="text"
              value={aiModel}
              onChange={(e) => setAiModel(e.target.value)}
              className="neo-input w-full px-3 py-2"
              placeholder={aiProviderType === "anthropic" ? "claude-sonnet-4-5" : "gpt-4o"}
              autoComplete="off"
            />
          </div>

          <p className="text-xs leading-relaxed neo-text-muted font-bold">
            配置只保存在当前浏览器本地，排版时会临时发送到服务端调用你填写的模型服务。
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
            onClick={onClear}
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
