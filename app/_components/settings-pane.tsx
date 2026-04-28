import {
  ArrowLeftRight,
  Check,
  ChevronDown,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import type React from "react";
import type { ActiveTab, FormatTweaks } from "../_types/formatter";
import type { TemplateConfig } from "../template-engine";

type TemplateGroup = {
  id: string;
  name: string;
  templates: TemplateConfig[];
};

type RangeControlProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  tone: "yellow" | "cyan";
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
};

const badgeClassNames = {
  yellow: "bg-(--neo-sub-header)",
  cyan: "bg-(--neo-cyan)",
} as const;

function RangeControl({
  label,
  value,
  min,
  max,
  step,
  unit = "",
  tone,
  onChange,
  formatValue,
}: RangeControlProps) {
  const displayValue = formatValue ? formatValue(value) : `${value}${unit}`;

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs font-black text-(--neo-ink)">
        <span>{label}</span>
        <span
          className={`${badgeClassNames[tone]} border-2 border-(--neo-ink) px-1.5 text-[#151515]`}
        >
          {displayValue}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full cursor-pointer neo-range"
      />
    </div>
  );
}

type SettingsPaneProps = {
  activeTab: ActiveTab;
  allTemplatesCount: number;
  groupedTemplates: TemplateGroup[];
  currentCategory: string;
  setCurrentCategory: React.Dispatch<React.SetStateAction<string>>;
  currentTemplateId: string;
  setCurrentTemplateId: React.Dispatch<React.SetStateAction<string>>;
  formatTweaks: FormatTweaks;
  setFormatTweaks: React.Dispatch<React.SetStateAction<FormatTweaks>>;
  onResetFormatTweaks: () => void;
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
  formatTweaks,
  setFormatTweaks,
  onResetFormatTweaks,
  syncScroll,
  setSyncScroll,
}: SettingsPaneProps) {
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(true);
  const [isTweaksOpen, setIsTweaksOpen] = useState(false);

  const updateFormatTweaks = <K extends keyof FormatTweaks>(key: K, value: FormatTweaks[K]) => {
    setFormatTweaks((current) => ({ ...current, [key]: value }));
  };

  return (
    <div
      className={`w-full md:w-64 lg:w-[320px] flex-col gap-4 shrink-0 h-full overflow-hidden pb-24 md:pb-0 ${activeTab === "settings" ? "flex" : "hidden md:flex"}`}
    >
      <div
        className={`neo-panel overflow-hidden flex flex-col shrink-0 ${isTemplatesOpen ? "flex-1 min-h-0" : ""}`}
      >
        <button
          type="button"
          onClick={() => setIsTemplatesOpen((current) => !current)}
          className="p-4 bg-(--neo-template-header) border-b-[3px] border-(--neo-ink) shrink-0 flex items-center justify-between text-left"
        >
          <h2 className="text-[15px] font-black text-(--neo-on-header) flex items-center gap-2 uppercase">
            <Sparkles className="w-4 h-4" />
            主题模板 ({allTemplatesCount}款)
          </h2>
          <ChevronDown
            className={`w-4 h-4 text-(--neo-on-header) transition-transform ${
              isTemplatesOpen ? "rotate-180" : ""
            }`}
            strokeWidth={3}
          />
        </button>

        {isTemplatesOpen && (
          <>
            <div className="relative shrink-0 bg-(--neo-sub-header) border-b-[3px] border-(--neo-ink)">
              <div className="flex gap-2 overflow-x-auto px-2 py-2 pr-28 scrollbar-hide">
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
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center bg-linear-to-l from-(--neo-sub-header) via-(--neo-sub-header) to-transparent pl-8 pr-2">
                <span className="flex items-center gap-1 border-2 border-(--neo-ink) bg-(--neo-surface) px-1.5 py-0.5 text-[10px] font-black text-(--neo-ink) shadow-[2px_2px_0_0_var(--neo-ink)]">
                  <ArrowLeftRight className="w-3 h-3" strokeWidth={3} />
                  左右滑动
                </span>
              </div>
            </div>

            <div className="p-3 overflow-y-auto flex-1 grid grid-cols-3 2xl:grid-cols-4 gap-3 content-start bg-(--neo-surface) custom-scrollbar">
              {groupedTemplates
                .find((group) => group.id === currentCategory)
                ?.templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setCurrentTemplateId(template.id)}
                    className={`relative p-2 border-2 border-(--neo-ink) text-center transition-all duration-200 flex flex-col gap-1 items-center justify-center bg-(--neo-surface) shadow-[3px_3px_0_0_var(--neo-ink)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none ${
                      currentTemplateId === template.id
                        ? "neo-selected bg-(--neo-green)"
                        : "hover:bg-(--neo-cyan)"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1.5 w-full">
                      <span
                        className="w-2.5 h-2.5 border-2 border-(--neo-ink) shrink-0"
                        style={{ backgroundColor: template.themeColor }}
                      />
                      <span className="font-black text-xs text-(--neo-ink) truncate">
                        {template.name}
                      </span>
                    </div>

                    {currentTemplateId === template.id && (
                      <div className="absolute -top-2 -right-2 bg-(--neo-green) text-[#111111] border-2 border-(--neo-ink) p-0.5 shadow-[2px_2px_0_0_var(--neo-ink)]">
                        <Check className="w-2.5 h-2.5" strokeWidth={3} />
                      </div>
                    )}
                  </button>
                ))}
            </div>
          </>
        )}
      </div>

      <div
        className={`neo-panel overflow-hidden flex flex-col shrink-0 ${isTweaksOpen ? "flex-1 min-h-0" : ""}`}
      >
        <div className="relative shrink-0 border-b-[3px] border-(--neo-ink) bg-(--neo-surface)">
          <button
            type="button"
            className="flex w-full items-center justify-between gap-2 p-4 text-left"
            onClick={() => setIsTweaksOpen((current) => !current)}
          >
            <span className="flex min-w-0 flex-1 items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 shrink-0 text-(--neo-ink)" />
              <span className="text-[14px] font-black text-(--neo-ink) uppercase">
                细节微调
              </span>
            </span>
            <ChevronDown
              className={`w-4 h-4 text-(--neo-ink) transition-transform ${
                isTweaksOpen ? "rotate-180" : ""
              }`}
              strokeWidth={3}
            />
          </button>
          {isTweaksOpen && (
            <button
              type="button"
              onClick={onResetFormatTweaks}
              className="neo-toolbar-button absolute top-1/2 right-10 -translate-y-1/2 p-1.5"
              title="重置微调"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {isTweaksOpen && (
          <div className="p-4 overflow-y-auto flex-1 custom-scrollbar">
            <div className="space-y-4">
              <RangeControl
                label="正文字号"
                value={formatTweaks.fontSize}
                min={14}
                max={20}
                step={1}
                unit="px"
                tone="yellow"
                onChange={(value) => updateFormatTweaks("fontSize", value)}
              />

              <RangeControl
                label="行高间距"
                value={formatTweaks.lineHeight}
                min={1.5}
                max={2.2}
                step={0.1}
                tone="cyan"
                onChange={(value) => updateFormatTweaks("lineHeight", value)}
              />

              <RangeControl
                label="段落间距"
                value={formatTweaks.paragraphSpacing}
                min={8}
                max={28}
                step={1}
                unit="px"
                tone="yellow"
                onChange={(value) => updateFormatTweaks("paragraphSpacing", value)}
              />

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-black text-(--neo-ink)">首行缩进</div>
                  <p className="text-[11px] neo-text-muted font-bold">开启后正文段落缩进 2em</p>
                </div>
                <button
                  onClick={() =>
                    updateFormatTweaks("firstLineIndent", !formatTweaks.firstLineIndent)
                  }
                  className={`relative inline-flex h-7 w-12 items-center border-[3px] border-(--neo-ink) transition-colors duration-200 focus:outline-none ${
                    formatTweaks.firstLineIndent
                      ? "bg-(--neo-green)"
                      : "bg-(--neo-surface)"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform bg-(--neo-ink) transition-transform duration-200 ${
                      formatTweaks.firstLineIndent ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="border-2 border-(--neo-ink) bg-(--neo-surface) p-3 space-y-3">
                <div className="text-xs font-black text-(--neo-ink)">页面留白</div>
                <RangeControl
                  label="上留白"
                  value={formatTweaks.pagePaddingTop}
                  min={0}
                  max={48}
                  step={1}
                  unit="px"
                  tone="cyan"
                  onChange={(value) => updateFormatTweaks("pagePaddingTop", value)}
                />
                <RangeControl
                  label="右留白"
                  value={formatTweaks.pagePaddingRight}
                  min={0}
                  max={48}
                  step={1}
                  unit="px"
                  tone="yellow"
                  onChange={(value) => updateFormatTweaks("pagePaddingRight", value)}
                />
                <RangeControl
                  label="下留白"
                  value={formatTweaks.pagePaddingBottom}
                  min={0}
                  max={48}
                  step={1}
                  unit="px"
                  tone="cyan"
                  onChange={(value) => updateFormatTweaks("pagePaddingBottom", value)}
                />
                <RangeControl
                  label="左留白"
                  value={formatTweaks.pagePaddingLeft}
                  min={0}
                  max={48}
                  step={1}
                  unit="px"
                  tone="yellow"
                  onChange={(value) => updateFormatTweaks("pagePaddingLeft", value)}
                />
              </div>

              <RangeControl
                label="字间距"
                value={formatTweaks.letterSpacing}
                min={0}
                max={2}
                step={0.1}
                unit="px"
                tone="yellow"
                onChange={(value) => updateFormatTweaks("letterSpacing", value)}
                formatValue={(value) => `${value.toFixed(1)}px`}
              />

              <RangeControl
                label="图片圆角"
                value={formatTweaks.imageRadius}
                min={0}
                max={20}
                step={1}
                unit="px"
                tone="cyan"
                onChange={(value) => updateFormatTweaks("imageRadius", value)}
              />
            </div>
          </div>
        )}
      </div>

      <div className="hidden md:block neo-panel p-4 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="w-4 h-4 text-(--neo-ink)" />
            <span className="text-sm font-black text-(--neo-ink)">滚动同步</span>
          </div>
          <button
            onClick={() => setSyncScroll(!syncScroll)}
            className={`relative inline-flex h-7 w-12 items-center border-[3px] border-(--neo-ink) transition-colors duration-200 focus:outline-none ${
              syncScroll ? "bg-(--neo-green)" : "bg-(--neo-surface)"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform bg-(--neo-ink) transition-transform duration-200 ${
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
