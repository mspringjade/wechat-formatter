"use client";

import { useMemo, useRef, useState } from "react";
import { AiConfigModal } from "./_components/ai-config-modal";
import { AppHeader } from "./_components/app-header";
import { ImageInsertModal } from "./_components/image-insert-modal";
import { MarkdownEditorPane } from "./_components/markdown-editor-pane";
import { PreviewPane } from "./_components/preview-pane";
import { RewardModal } from "./_components/reward-modal";
import { SettingsPane } from "./_components/settings-pane";
import { Toast } from "./_components/toast";
import { sampleText } from "./_lib/formatter-constants";
import type { ActiveTab, FormatTweaks } from "./_types/formatter";
import { useAiFormat } from "./_hooks/use-ai-format";
import { useAiSettings } from "./_hooks/use-ai-settings";
import { useClipboardCopy } from "./_hooks/use-clipboard-copy";
import { useMarkdownTools } from "./_hooks/use-markdown-tools";
import { useScrollSync } from "./_hooks/use-scroll-sync";
import { useTheme } from "./_hooks/use-theme";
import { useToast } from "./_hooks/use-toast";
import { useWordCount } from "./_hooks/use-word-count";
import { allTemplates, groupedTemplates, renderArticle } from "./template-engine";

const DEFAULT_FORMAT_TWEAKS: FormatTweaks = {
  fontSize: 16,
  lineHeight: 1.8,
  paragraphSpacing: 16,
  firstLineIndent: false,
  pagePaddingTop: 16,
  pagePaddingRight: 16,
  pagePaddingBottom: 16,
  pagePaddingLeft: 16,
  letterSpacing: 0,
  imageRadius: 8,
  themeColor: "#ff6f9f",
};

export default function Home() {
  const [inputText, setInputText] = useState(sampleText);
  const [activeTab, setActiveTab] = useState<ActiveTab>("input");
  const [currentTemplateId, setCurrentTemplateId] = useState<string>("neo-brutalism-0");
  const [currentCategory, setCurrentCategory] = useState<string>("neo-brutalism");
  const [formatTweaks, setFormatTweaks] = useState<FormatTweaks>(DEFAULT_FORMAT_TWEAKS);
  const [showReward, setShowReward] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageMap, setImageMap] = useState<Map<string, string>>(new Map());
  const [imageUrl, setImageUrl] = useState("");
  const [imageDesc, setImageDesc] = useState("");

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageCounterRef = useRef(0);

  const { toast, showToast } = useToast();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const aiSettings = useAiSettings(showToast);
  const wordCount = useWordCount(inputText);
  const copyToClipboard = useClipboardCopy(showToast);
  const { syncScroll, setSyncScroll, previewRef, handleInputScroll, handlePreviewScroll } =
    useScrollSync(inputRef);

  const markdownTools = useMarkdownTools({
    inputText,
    setInputText,
    inputRef,
    fileInputRef,
    imageCounterRef,
    setImageMap,
    imageUrl,
    imageDesc,
    setImageUrl,
    setImageDesc,
    setShowImageModal,
  });

  const { isAiFormatting, handleAiFormat } = useAiFormat({
    inputText,
    setInputText,
    aiProviderType: aiSettings.aiProviderType,
    aiBaseUrl: aiSettings.aiBaseUrl,
    aiApiKey: aiSettings.aiApiKey,
    aiModel: aiSettings.aiModel,
    setShowAiConfigModal: aiSettings.setShowAiConfigModal,
    showToast,
  });

  const currentTemplate =
    allTemplates.find((template) => template.id === currentTemplateId) || allTemplates[0];

  const outputHtml = useMemo(() => {
    if (!inputText.trim()) return "";

    const processedText = inputText.replace(/!\[(.*?)\]\(#(img-\d+)\)/g, (match, alt, imageId) => {
      const base64 = imageMap.get(imageId);
      return base64 ? `![${alt}](${base64})` : match;
    });

    return renderArticle(processedText, currentTemplate, formatTweaks);
  }, [inputText, currentTemplate, formatTweaks, imageMap]);

  const handleCopy = () => {
    copyToClipboard(outputHtml);
  };

  return (
    <main className="h-screen overflow-hidden neo-app-bg flex flex-col font-sans relative">
      <Toast toast={toast} />

      <ImageInsertModal
        open={showImageModal}
        imageDesc={imageDesc}
        setImageDesc={setImageDesc}
        imageUrl={imageUrl}
        setImageUrl={setImageUrl}
        onClose={() => setShowImageModal(false)}
        onLocalImage={markdownTools.handleLocalImage}
        onOnlineImage={markdownTools.handleOnlineImage}
      />

      <AiConfigModal
        open={aiSettings.showAiConfigModal}
        aiProviderType={aiSettings.aiProviderType}
        setAiProviderType={aiSettings.setAiProviderType}
        aiBaseUrl={aiSettings.aiBaseUrl}
        setAiBaseUrl={aiSettings.setAiBaseUrl}
        aiApiKey={aiSettings.aiApiKey}
        setAiApiKey={aiSettings.setAiApiKey}
        aiModel={aiSettings.aiModel}
        setAiModel={aiSettings.setAiModel}
        onClose={() => aiSettings.setShowAiConfigModal(false)}
        onSave={aiSettings.saveAiSettings}
        onClear={aiSettings.clearAiSettings}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={markdownTools.handleFileChange}
        className="hidden"
      />

      <RewardModal open={showReward} onClose={() => setShowReward(false)} />

      <AppHeader
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        onShowReward={() => setShowReward(true)}
        onCopy={handleCopy}
        hasContent={Boolean(inputText.trim())}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="flex-1 max-w-[1600px] w-full mx-auto p-3 sm:p-5 overflow-hidden">
        <div className="flex flex-col md:flex-row gap-4 lg:gap-6 h-full">
          <MarkdownEditorPane
            activeTab={activeTab}
            inputText={inputText}
            setInputText={setInputText}
            inputRef={inputRef}
            onInputScroll={handleInputScroll}
            onPaste={markdownTools.handlePaste}
            wordCount={wordCount}
            insertMarkdown={markdownTools.insertMarkdown}
            insertHeading={markdownTools.insertHeading}
            insertList={markdownTools.insertList}
            insertCodeBlock={markdownTools.insertCodeBlock}
            insertLink={markdownTools.insertLink}
            insertImage={markdownTools.insertImage}
            onAiFormat={handleAiFormat}
            isAiFormatting={isAiFormatting}
            onOpenAiConfig={() => aiSettings.setShowAiConfigModal(true)}
            onRestoreSample={() => setInputText(sampleText)}
          />

          <PreviewPane
            activeTab={activeTab}
            previewRef={previewRef}
            onPreviewScroll={handlePreviewScroll}
            outputHtml={outputHtml}
          />

          <SettingsPane
            activeTab={activeTab}
            allTemplatesCount={allTemplates.length}
            groupedTemplates={groupedTemplates}
            currentCategory={currentCategory}
            setCurrentCategory={setCurrentCategory}
            currentTemplateId={currentTemplateId}
            setCurrentTemplateId={setCurrentTemplateId}
            formatTweaks={formatTweaks}
            setFormatTweaks={setFormatTweaks}
            onResetFormatTweaks={() => setFormatTweaks(DEFAULT_FORMAT_TWEAKS)}
            syncScroll={syncScroll}
            setSyncScroll={setSyncScroll}
          />
        </div>
      </div>
    </main>
  );
}
