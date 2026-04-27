import { ArrowLeftRight, Check, SlidersHorizontal, Sparkles } from "lucide-react";
import type React from "react";
import type { ActiveTab } from "../_types/formatter";
import type { TemplateConfig } from "../template-engine";

type TemplateGroup = {
  id: string;
  name: string;
  templates: TemplateConfig[];
};

type SettingsPaneProps = {
  activeTab: ActiveTab;
  allTemplatesCount: number;
  groupedTemplates: TemplateGroup[];
  currentCategory: string;
  setCurrentCategory: React.Dispatch<React.SetStateAction<string>>;
  currentTemplateId: string;
  setCurrentTemplateId: React.Dispatch<React.SetStateAction<string>>;
  fontSize: number;
  setFontSize: React.Dispatch<React.SetStateAction<number>>;
  lineHeight: number;
  setLineHeight: React.Dispatch<React.SetStateAction<number>>;
  syncScroll: boolean;
  setSyncScroll: React.Dispatch<React.SetStateAction<boolean>>;
};

export function SettingsPane({
  activeTab,
  allTemplatesCount,
  groupedTemplates,
  currentCategory,
  setCurrentCategory,
  currentTemplateId,
  setCurrentTemplateId,
  fontSize,
  setFontSize,
  lineHeight,
  setLineHeight,
  syncScroll,
  setSyncScroll,
}: SettingsPaneProps) {
  return (
    <div
      className={`w-full md:w-64 lg:w-[320px] flex-col gap-4 shrink-0 h-full overflow-y-auto pb-24 md:pb-0 custom-scrollbar ${activeTab === "settings" ? "flex" : "hidden md:flex"}`}
    >
      <div className="neo-panel overflow-hidden flex flex-col max-h-[60vh] md:max-h-full">
        <div className="p-4 bg-[var(--neo-pink)] border-b-[3px] border-[var(--neo-ink)] shrink-0">
          <h2 className="text-[15px] font-black text-[#111111] flex items-center gap-2 uppercase">
            <Sparkles className="w-4 h-4" />
            主题模板 ({allTemplatesCount}款)
          </h2>
        </div>

        <div className="flex gap-2 overflow-x-auto bg-[var(--neo-cyan)] px-2 py-2 shrink-0 scrollbar-hide border-b-[3px] border-[var(--neo-ink)]">
          {groupedTemplates.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCurrentCategory(cat.id)}
              className={`whitespace-nowrap px-3 py-1.5 text-xs font-black ${currentCategory === cat.id ? "neo-tab neo-tab-active" : "neo-tab"}`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="p-3 overflow-y-auto flex-1 grid grid-cols-3 2xl:grid-cols-4 gap-3 content-start bg-[var(--neo-surface)] custom-scrollbar">
          {groupedTemplates
            .find((group) => group.id === currentCategory)
            ?.templates.map((template) => (
              <button
                key={template.id}
                onClick={() => setCurrentTemplateId(template.id)}
                className={`relative p-2 border-[2px] border-[var(--neo-ink)] text-center transition-all duration-200 flex flex-col gap-1 items-center justify-center bg-[var(--neo-surface)] shadow-[3px_3px_0_0_var(--neo-ink)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none ${
                  currentTemplateId === template.id
                    ? "bg-[var(--neo-yellow)]"
                    : "hover:bg-[var(--neo-cyan)]"
                }`}
              >
                <div className="flex items-center justify-center gap-1.5 w-full">
                  <span
                    className="w-2.5 h-2.5 border-[2px] border-[var(--neo-ink)] shrink-0"
                    style={{ backgroundColor: template.themeColor }}
                  />
                  <span className="font-black text-xs text-[var(--neo-ink)] truncate">
                    {template.name}
                  </span>
                </div>

                {currentTemplateId === template.id && (
                  <div className="absolute -top-2 -right-2 bg-[var(--neo-green)] text-[#111111] border-[2px] border-[var(--neo-ink)] p-0.5 shadow-[2px_2px_0_0_var(--neo-ink)]">
                    <Check className="w-2.5 h-2.5" strokeWidth={3} />
                  </div>
                )}
              </button>
            ))}
        </div>
      </div>

      <div className="neo-panel p-4 shrink-0">
        <h2 className="text-[14px] font-black text-[var(--neo-ink)] mb-3 flex items-center gap-2 uppercase">
          <SlidersHorizontal className="w-4 h-4" />
          细节微调
        </h2>
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-black text-[var(--neo-ink)]">
              <span>正文字号</span>
              <span className="bg-[var(--neo-yellow)] border-[2px] border-[var(--neo-ink)] px-1.5 text-[#151515]">
                {fontSize}px
              </span>
            </div>
            <input
              type="range"
              min="14"
              max="20"
              step="1"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full cursor-pointer neo-range"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-black text-[var(--neo-ink)]">
              <span>行高间距</span>
              <span className="bg-[var(--neo-cyan)] border-[2px] border-[var(--neo-ink)] px-1.5 text-[#151515]">
                {lineHeight}
              </span>
            </div>
            <input
              type="range"
              min="1.5"
              max="2.2"
              step="0.1"
              value={lineHeight}
              onChange={(e) => setLineHeight(Number(e.target.value))}
              className="w-full cursor-pointer neo-range"
            />
          </div>
        </div>
      </div>

      <div className="hidden md:block neo-panel p-4 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="w-4 h-4 text-[var(--neo-ink)]" />
            <span className="text-sm font-black text-[var(--neo-ink)]">滚动同步</span>
          </div>
          <button
            onClick={() => setSyncScroll(!syncScroll)}
            className={`relative inline-flex h-7 w-12 items-center border-[3px] border-[var(--neo-ink)] transition-colors duration-200 focus:outline-none ${
              syncScroll ? "bg-[var(--neo-green)]" : "bg-[var(--neo-surface)]"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform bg-[var(--neo-ink)] transition-transform duration-200 ${
                syncScroll ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
        <p className="text-xs neo-text-muted mt-2 font-bold">开启后，编辑区与预览区将同步滚动</p>
      </div>
    </div>
  );
}
