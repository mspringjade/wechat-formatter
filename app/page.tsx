"use client";

import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import {
  allTemplates,
  groupedTemplates,
  renderArticle,
} from "./template-engine";

const sampleText = `# 给你的公众号穿上不同风格的衣服

好的排版就像是人穿上了得体的衣服，能瞬间提升阅读体验。不同类型的文章，适合不同的排版风格。这也是这款**Markdown一键排版工具**诞生的初衷。

## 第1步：为什么需要排版？

在自媒体高度发达的时代，**优质内容**是王道，而*精美排版*是入场券。

> 排版是一种无声的语言，传递着作者的情感与态度。

## 第2步：工具特点

1. **多分类储备**：提供了跨越5大类、整整50套视觉模板
2. **支持Markdown**：抛掉繁琐操作，一次编写处处使用
3. **实时预览**：你在左侧修改，中间屏幕立刻刷新展现结果
4. **一键复制**：点击右上角，去公众号后台直接 \`Ctrl+V\`
5. **快捷插图**：支持直接使用 \`Ctrl+V\` 粘贴电脑上的截图
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

export default function Home() {
  const [inputText, setInputText] = useState(sampleText);
  const [activeTab, setActiveTab] = useState<"input" | "preview" | "settings">(
    "input",
  );
  const [currentTemplateId, setCurrentTemplateId] =
    useState<string>("minimalist-0");
  const [currentCategory, setCurrentCategory] = useState<string>("minimalist");
  const [fontSize, setFontSize] = useState(16);
  const [lineHeight, setLineHeight] = useState(1.8);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [syncScroll, setSyncScroll] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [imageMap, setImageMap] = useState<Map<string, string>>(new Map());
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageDesc, setImageDesc] = useState("");

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef<"input" | "preview" | null>(null);
  const imageCounterRef = useRef(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return newMode;
    });
  };

  const wordCount = useMemo(() => {
    const text = inputText.trim();
    if (!text) return { chars: 0, words: 0, lines: 0, readTime: 0 };
    const chars = text.length;
    const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
    const englishWords = (text.match(/[a-zA-Z]+/g) || []).length;
    const words = chineseChars + englishWords;
    const lines = text.split("\n").filter((line) => line.trim()).length;
    const readTime = Math.max(1, Math.ceil(words / 300));
    return { chars, words, lines, readTime };
  }, [inputText]);

  const insertMarkdown = useCallback(
    (prefix: string, suffix: string = prefix, placeholder: string = "") => {
      const textarea = inputRef.current;
      if (!textarea) return;

      const scrollTop = textarea.scrollTop;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = inputText.substring(start, end);
      const textToInsert = selectedText || placeholder;
      const newText =
        inputText.substring(0, start) +
        prefix +
        textToInsert +
        suffix +
        inputText.substring(end);

      setInputText(newText);

      setTimeout(() => {
        textarea.focus();
        textarea.scrollTop = scrollTop;
        const newCursorPos = start + prefix.length + textToInsert.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    },
    [inputText],
  );

  const insertHeading = useCallback(
    (level: number) => {
      const textarea = inputRef.current;
      if (!textarea) return;

      const scrollTop = textarea.scrollTop;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = inputText.substring(start, end);
      const prefix = "#".repeat(level) + " ";
      const textToInsert = selectedText || "标题";
      const newText =
        inputText.substring(0, start) +
        prefix +
        textToInsert +
        inputText.substring(end);

      setInputText(newText);

      setTimeout(() => {
        textarea.focus();
        textarea.scrollTop = scrollTop;
        textarea.setSelectionRange(
          start + prefix.length,
          start + prefix.length + textToInsert.length,
        );
      }, 0);
    },
    [inputText],
  );

  const insertList = useCallback(
    (type: "ul" | "ol") => {
      const textarea = inputRef.current;
      if (!textarea) return;

      const scrollTop = textarea.scrollTop;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = inputText.substring(start, end);
      const prefix = type === "ul" ? "- " : "1. ";
      const textToInsert = selectedText || "列表项";
      const newText =
        inputText.substring(0, start) +
        prefix +
        textToInsert +
        inputText.substring(end);

      setInputText(newText);

      setTimeout(() => {
        textarea.focus();
        textarea.scrollTop = scrollTop;
        textarea.setSelectionRange(
          start + prefix.length,
          start + prefix.length + textToInsert.length,
        );
      }, 0);
    },
    [inputText],
  );

  const insertCodeBlock = useCallback(() => {
    const textarea = inputRef.current;
    if (!textarea) return;

    const scrollTop = textarea.scrollTop;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = inputText.substring(start, end);
    const codeBlock = "```javascript\n" + (selectedText || "代码") + "\n```";
    const newText =
      inputText.substring(0, start) + codeBlock + inputText.substring(end);

    setInputText(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.scrollTop = scrollTop;
      const newCursorPos = start + 14 + (selectedText || "代码").length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  }, [inputText]);

  const insertLink = useCallback(() => {
    const textarea = inputRef.current;
    if (!textarea) return;

    const scrollTop = textarea.scrollTop;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = inputText.substring(start, end);
    const linkText = selectedText || "链接文字";
    const linkMarkdown = `[${linkText}](url)`;
    const newText =
      inputText.substring(0, start) + linkMarkdown + inputText.substring(end);

    setInputText(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.scrollTop = scrollTop;
      const urlStart = start + linkText.length + 3;
      textarea.setSelectionRange(urlStart, urlStart + 3);
    }, 0);
  }, [inputText]);

  const insertImage = useCallback(() => {
    setImageUrl("");
    setImageDesc("");
    setShowImageModal(true);
  }, []);

  const handleLocalImage = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const textarea = inputRef.current;
      const scrollTop = textarea?.scrollTop ?? 0;
      const start = textarea?.selectionStart ?? 0;

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        const imageId = `img-${++imageCounterRef.current}`;
        const desc = imageDesc || "图片";

        setImageMap((prev) => {
          const newMap = new Map(prev);
          newMap.set(imageId, base64);
          return newMap;
        });

        const currentTextarea = inputRef.current;
        if (currentTextarea) {
          const currentEnd = currentTextarea.selectionEnd ?? start;
          const imageMarkdown = `![${desc}](#${imageId})`;
          const newText =
            inputText.substring(0, start) + imageMarkdown + inputText.substring(currentEnd);

          setInputText(newText);

          setTimeout(() => {
            currentTextarea.focus();
            currentTextarea.scrollTop = scrollTop;
            currentTextarea.setSelectionRange(
              start + imageMarkdown.length,
              start + imageMarkdown.length,
            );
          }, 0);
        }

        setShowImageModal(false);
      };
      reader.readAsDataURL(file);
    },
    [imageDesc, inputText],
  );

  const handleOnlineImage = useCallback(() => {
    if (!imageUrl.trim()) return;

    const textarea = inputRef.current;
    if (!textarea) return;

    const scrollTop = textarea.scrollTop;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const desc = imageDesc || "图片";
    const imageMarkdown = `![${desc}](${imageUrl.trim()})`;
    const newText =
      inputText.substring(0, start) + imageMarkdown + inputText.substring(end);

    setInputText(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.scrollTop = scrollTop;
      textarea.setSelectionRange(
        start + imageMarkdown.length,
        start + imageMarkdown.length,
      );
    }, 0);

    setShowImageModal(false);
  }, [imageUrl, imageDesc, inputText]);

  const showToast = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const copyToClipboard = async (html: string) => {
    if (!html) {
      showToast("请先生成排版内容", "error");
      return false;
    }

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    const plainText = tempDiv.innerText || tempDiv.textContent || "";

    try {
      if (navigator.clipboard && window.ClipboardItem) {
        const clipboardItem = new ClipboardItem({
          "text/html": new Blob([html], { type: "text/html" }),
          "text/plain": new Blob([plainText], { type: "text/plain" }),
        });
        await navigator.clipboard.write([clipboardItem]);
        showToast("已复制！可直接粘贴到微信后台");
        return true;
      }
    } catch (err) {
      console.error(
        "Clipboard API copy failed, falling back to execCommand:",
        err,
      );
    }

    tempDiv.style.position = "absolute";
    tempDiv.style.left = "-9999px";
    document.body.appendChild(tempDiv);

    const range = document.createRange();
    range.selectNodeContents(tempDiv);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);

    try {
      document.execCommand("copy");
      showToast("已复制！可直接粘贴到微信后台");
    } catch (err) {
      console.error("Copy failed:", err);
      showToast("复制失败，请重试", "error");
      return false;
    } finally {
      selection?.removeAllRanges();
      document.body.removeChild(tempDiv);
    }

    return true;
  };

  const currentTemplate =
    allTemplates.find((t) => t.id === currentTemplateId) || allTemplates[0];

  const outputHtml = useMemo(() => {
    if (!inputText.trim()) return "";

    const processedText = inputText.replace(
      /!\[(.*?)\]\(#(img-\d+)\)/g,
      (match, alt, imageId) => {
        const base64 = imageMap.get(imageId);
        return base64 ? `![${alt}](${base64})` : match;
      },
    );

    return renderArticle(processedText, currentTemplate, fontSize, lineHeight);
  }, [inputText, currentTemplate, fontSize, lineHeight, imageMap]);

  const handleCopy = () => {
    return copyToClipboard(outputHtml);
  };

  const handlePaste = useCallback(
    async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf("image") !== -1) {
          e.preventDefault();
          const file = item.getAsFile();
          if (!file) continue;

          const reader = new FileReader();
          reader.onload = (event) => {
            const base64 = event.target?.result as string;
            const imageId = `img-${++imageCounterRef.current}`;

            setImageMap((prev) => {
              const newMap = new Map(prev);
              newMap.set(imageId, base64);
              return newMap;
            });

            const textarea = inputRef.current;
            if (textarea) {
              const scrollTop = textarea.scrollTop;
              const start = textarea.selectionStart;
              const end = textarea.selectionEnd;
              const imageMarkdown = `\n![图片](#${imageId})\n`;

              setInputText((prev) => {
                return (
                  prev.substring(0, start) + imageMarkdown + prev.substring(end)
                );
              });

              setTimeout(() => {
                textarea.focus();
                textarea.scrollTop = scrollTop;
                textarea.setSelectionRange(
                  start + imageMarkdown.length,
                  start + imageMarkdown.length,
                );
              }, 0);
            }
          };
          reader.readAsDataURL(file);
          break;
        }
      }
    },
    [],
  );

  const handleInputScroll = useCallback(
    (e: React.UIEvent<HTMLTextAreaElement>) => {
      if (!syncScroll || isScrollingRef.current === "preview") return;
      isScrollingRef.current = "input";

      const inputEl = e.currentTarget;
      const previewEl = previewRef.current;
      if (!previewEl) return;

      const scrollRatio =
        inputEl.scrollTop / (inputEl.scrollHeight - inputEl.clientHeight);
      const previewScrollTop =
        scrollRatio * (previewEl.scrollHeight - previewEl.clientHeight);
      previewEl.scrollTop = previewScrollTop;

      requestAnimationFrame(() => {
        isScrollingRef.current = null;
      });
    },
    [syncScroll],
  );

  const handlePreviewScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      if (!syncScroll || isScrollingRef.current === "input") return;
      isScrollingRef.current = "preview";

      const previewEl = e.currentTarget;
      const inputEl = inputRef.current;
      if (!inputEl) return;

      const scrollRatio =
        previewEl.scrollTop / (previewEl.scrollHeight - previewEl.clientHeight);
      const inputScrollTop =
        scrollRatio * (inputEl.scrollHeight - inputEl.clientHeight);
      inputEl.scrollTop = inputScrollTop;

      requestAnimationFrame(() => {
        isScrollingRef.current = null;
      });
    },
    [syncScroll],
  );

  return (
    <main className="h-screen overflow-hidden bg-[#f1f3f5] dark:bg-gray-900 text-gray-800 dark:text-gray-200 flex flex-col font-sans relative">
      {/* 全局 Toast 通知 */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300 transition-all">
          <div
            className={`px-5 py-2.5 rounded-full shadow-lg text-sm font-medium flex items-center gap-2 ${toast.type === "success" ? "bg-[#07c160] text-white shadow-green-500/20" : "bg-red-500 text-white shadow-red-500/20"}`}
          >
            {toast.type === "success" ? (
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
            {toast.message}
          </div>
        </div>
      )}

      {/* 插入图片弹窗 */}
      {showImageModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setShowImageModal(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                插入图片
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                选择本地图片或输入在线图片地址
              </p>
            </div>

            <div className="space-y-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  图片描述
                </label>
                <input
                  type="text"
                  value={imageDesc}
                  onChange={(e) => setImageDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="输入图片描述（可选）"
                />
              </div>

              <div className="flex items-center justify-center">
                <div className="flex items-center gap-3 w-full">
                  <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600" />
                  <span className="text-xs text-gray-400">或</span>
                  <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  在线图片地址
                </label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/image.png"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleLocalImage}
                className="flex-1 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                选择本地图片
              </button>
              <button
                onClick={handleOnlineImage}
                disabled={!imageUrl.trim()}
                className="flex-1 py-2.5 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                插入在线图片
              </button>
            </div>

            <button
              onClick={() => setShowImageModal(false)}
              className="w-full mt-3 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-xl font-medium transition-colors"
            >
              取消
            </button>
          </div>
        </div>
      )}

      {/* 隐藏的文件输入 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* 赞赏弹窗 */}
      {showReward && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setShowReward(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4 transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                ☕ 请作者喝杯咖啡
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                如果这个工具对你有帮助，欢迎支持一下~
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-4">
              <img
                src="/reward.png"
                alt="赞赏码"
                className="w-48 h-48 mx-auto object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  target.parentElement!.innerHTML =
                    '<div class="w-48 h-48 mx-auto flex items-center justify-center text-gray-400 text-sm">请将赞赏码保存为<br/>public/reward.png</div>';
                }}
              />
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 text-center mb-4">
              微信扫码赞赏，支持开发者继续维护
            </p>
            <button
              onClick={() => setShowReward(false)}
              className="w-full py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-xl font-medium transition-colors"
            >
              关闭
            </button>
          </div>
        </div>
      )}

      {/* 顶栏 */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-20">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Logo"
              className="w-9 h-9 object-cover rounded-xl shadow-sm border border-gray-100 dark:border-gray-600"
            />
            <h1 className="text-lg sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300">
              公众号排版助手
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleDarkMode}
              className="text-gray-500 dark:text-gray-400 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-gray-700 p-2 rounded-full transition-all"
              title={isDarkMode ? "切换到亮色模式" : "切换到暗黑模式"}
            >
              {isDarkMode ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            <button
              onClick={() => setShowReward(true)}
              className="text-gray-500 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-gray-700 p-2 rounded-full transition-all"
              title="赞赏支持"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-4h2v2h-2v-2zm0-2h2V7h-2v7z" />
                <path d="M12 5.5c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" />
              </svg>
            </button>
            <button
              onClick={handleCopy}
              className="bg-[#07c160] hover:bg-[#06ad56] text-white px-4 py-2 sm:px-6 sm:py-2.5 rounded-full font-bold shadow-md shadow-green-500/20 transition-all flex items-center gap-2 text-sm sm:text-base active:scale-95 disabled:opacity-50"
              disabled={!inputText.trim()}
            >
              <svg
                className="w-5 h-5 hidden sm:block"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                />
              </svg>
              一键复制发布
            </button>
          </div>
        </div>

        {/* 移动端 Tab */}
        <div className="flex bg-gray-50 dark:bg-gray-700 border-t border-gray-100 dark:border-gray-700 p-2 md:hidden">
          <button
            onClick={() => setActiveTab("input")}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${activeTab === "input" ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400" : "text-gray-500 dark:text-gray-400"}`}
          >
            编辑
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${activeTab === "preview" ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400" : "text-gray-500 dark:text-gray-400"}`}
          >
            预览
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${activeTab === "settings" ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400" : "text-gray-500 dark:text-gray-400"}`}
          >
            样式 & 模板
          </button>
        </div>
      </header>

      <div className="flex-1 max-w-[1600px] w-full mx-auto p-3 sm:p-5 overflow-hidden">
        <div className="flex flex-col md:flex-row gap-4 lg:gap-6 h-full">
          {/* 1. 左侧：输入区 (Markdown) */}
          <div
            className={`flex-[1.2] flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden ${activeTab === "input" ? "flex" : "hidden md:flex"}`}
          >
            <div className="bg-[#f8f9fa] dark:bg-gray-700 px-4 py-3 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center shrink-0">
              <span className="text-sm font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.5 3h-17A1.5 1.5 0 002 4.5v15A1.5 1.5 0 003.5 21h17a1.5 1.5 0 001.5-1.5v-15A1.5 1.5 0 0020.5 3zM11 15H9v-3.5L7 14 5 11.5V15H3V9h2l2 2.5L9 9h2v6zm7.5 0l-3.5-4h2.5V9h2v2h2.5l-3.5 4z" />
                </svg>
                Markdown 输入
              </span>
              <button
                onClick={() => setInputText(sampleText)}
                className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded"
              >
                恢复示例内容
              </button>
            </div>
            
            {/* Markdown 快捷工具栏 */}
            <div className="bg-gray-50 dark:bg-gray-700 px-3 py-2 border-b border-gray-200 dark:border-gray-600 flex flex-wrap items-center gap-1 shrink-0">
              <div className="flex items-center gap-1 mr-2">
                <button
                  onClick={() => insertHeading(1)}
                  className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors text-sm font-bold"
                  title="一级标题"
                >
                  H1
                </button>
                <button
                  onClick={() => insertHeading(2)}
                  className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors text-sm font-bold"
                  title="二级标题"
                >
                  H2
                </button>
                <button
                  onClick={() => insertHeading(3)}
                  className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors text-sm font-bold"
                  title="三级标题"
                >
                  H3
                </button>
              </div>
              <div className="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-1" />
              <button
                onClick={() => insertMarkdown("**", "**", "加粗")}
                className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors font-bold"
                title="加粗 (Ctrl+B)"
              >
                B
              </button>
              <button
                onClick={() => insertMarkdown("*", "*", "斜体")}
                className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors italic"
                title="斜体 (Ctrl+I)"
              >
                I
              </button>
              <button
                onClick={() => insertMarkdown("~~", "~~", "删除线")}
                className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors line-through"
                title="删除线"
              >
                S
              </button>
              <div className="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-1" />
              <button
                onClick={() => insertList("ul")}
                className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors"
                title="无序列表"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <button
                onClick={() => insertList("ol")}
                className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors"
                title="有序列表"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                </svg>
              </button>
              <button
                onClick={() => insertMarkdown("> ", "", "引用内容")}
                className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors"
                title="引用"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
                </svg>
              </button>
              <div className="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-1" />
              <button
                onClick={() => insertMarkdown("`", "`", "代码")}
                className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors font-mono text-sm"
                title="行内代码"
              >
                {"</>"}
              </button>
              <button
                onClick={insertCodeBlock}
                className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors"
                title="代码块"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </button>
              <div className="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-1" />
              <button
                onClick={insertLink}
                className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors"
                title="链接"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </button>
              <button
                onClick={insertImage}
                className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors"
                title="图片"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
              <button
                onClick={() => insertMarkdown("---\n", "", "")}
                className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors"
                title="分隔线"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
            </div>
            
            <textarea
              ref={inputRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onScroll={handleInputScroll}
              onPaste={handlePaste}
              className="flex-1 w-full p-4 lg:p-6 resize-none focus:outline-none text-gray-700 dark:text-gray-200 leading-relaxed font-mono text-[14px] bg-[#fafafa] dark:bg-gray-900 overflow-y-auto custom-scrollbar"
              placeholder="支持标准 Markdown 语法：&#10;# 标题支持1-6级&#10;> 引用内容&#10;- 列表项1&#10;- 列表项2&#10;**加粗文字**"
            />
            
            {/* 字数统计 */}
            <div className="bg-gray-50 dark:bg-gray-700 px-4 py-2 border-t border-gray-200 dark:border-gray-600 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 shrink-0">
              <div className="flex items-center gap-4">
                <span>字符: <strong className="text-gray-700 dark:text-gray-200">{wordCount.chars}</strong></span>
                <span>字数: <strong className="text-gray-700 dark:text-gray-200">{wordCount.words}</strong></span>
                <span>预计阅读: <strong className="text-gray-700 dark:text-gray-200">{wordCount.readTime}分钟</strong></span>
              </div>
              <span className="text-gray-400 dark:text-gray-500">支持 Ctrl+V 粘贴图片</span>
            </div>
          </div>

          {/* 2. 中间：预览区 */}
          <div
            ref={previewRef}
            onScroll={handlePreviewScroll}
            className={`flex-[1.2] flex-col overflow-y-auto ${activeTab === "preview" ? "flex" : "hidden md:flex"} custom-scrollbar`}
          >
            <div className="flex-1 bg-gradient-to-br from-gray-100 to-gray-200/50 dark:from-gray-800 dark:to-gray-900/50 rounded-2xl shadow-inner border border-gray-200 dark:border-gray-700 flex justify-center py-6 px-4 md:py-8">
              <div className="bg-white dark:bg-gray-800 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-[2.5rem] p-1.5 border-4 border-gray-800 h-fit min-h-[667px] w-full max-w-[375px] shrink-0 relative transition-all duration-300 transform origin-top hover:scale-[1.02]">
                {/* 刘海与状态栏 */}
                <div className="absolute top-0 inset-x-0 h-7 flex justify-between items-center px-6 z-10 pointer-events-none">
                  <div className="text-[10px] text-gray-800 dark:text-gray-200 font-medium">
                    9:41
                  </div>
                  <div className="w-24 h-5 bg-gray-800 rounded-b-xl absolute left-1/2 -translate-x-1/2"></div>
                  <div className="flex gap-1">
                    <div className="w-3 h-2 bg-gray-800 rounded-sm"></div>
                    <div className="w-3 h-2 bg-gray-800 rounded-sm"></div>
                  </div>
                </div>
                {/* Header Mock */}
                <div className="bg-gray-100/80 dark:bg-gray-700 pt-10 pb-2 px-4 text-center border-b border-gray-200 dark:border-gray-600 rounded-t-[2rem]">
                  <div className="text-sm font-bold text-gray-800 dark:text-gray-200 truncate">
                    文章预览
                  </div>
                </div>
                {/* 预览内容区 */}
                <div className="bg-white dark:bg-gray-800 w-full rounded-b-[2rem] overflow-hidden flex flex-col pt-2 pb-6">
                  <div className="flex-1 overflow-visible">
                    <div
                      className="w-full prose-img:max-w-full"
                      dangerouslySetInnerHTML={{
                        __html:
                          outputHtml ||
                          '<div style="padding:40px;text-align:center;color:#999;font-size:14px;background-color:#f3f4f6;border-radius:8px;margin:20px;">这里空空如也，请在左侧输入内容</div>',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. 右侧：精简的设置选项 (限制宽度) */}
          <div
            className={`w-full md:w-64 lg:w-[320px] flex-col gap-4 shrink-0 h-full overflow-y-auto pb-24 md:pb-0 custom-scrollbar ${activeTab === "settings" ? "flex" : "hidden md:flex"}`}
          >
            {/* 50种模板分类选择器 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col max-h-[60vh] md:max-h-full">
              <div className="p-4 border-b border-gray-100 dark:border-gray-700 shrink-0">
                <h2 className="text-[15px] font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  ✨ 主题模板 ({allTemplates.length}款)
                </h2>
              </div>

              {/* 分类 Tabs */}
              <div className="flex overflow-x-auto bg-gray-50 dark:bg-gray-700 px-2 py-1.5 shrink-0 scrollbar-hide">
                {groupedTemplates.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCurrentCategory(cat.id)}
                    className={`whitespace-nowrap px-3 py-1.5 text-xs font-medium rounded-full transition-all ${currentCategory === cat.id ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* 模板列表 */}
              <div className="p-3 overflow-y-auto flex-1 grid grid-cols-3 2xl:grid-cols-4 gap-2 content-start bg-gray-50/50 dark:bg-gray-900/50 custom-scrollbar">
                {groupedTemplates
                  .find((g) => g.id === currentCategory)
                  ?.templates.map((tpl) => (
                    <button
                      key={tpl.id}
                      onClick={() => setCurrentTemplateId(tpl.id)}
                      className={`relative p-2 rounded-xl border text-center transition-all duration-200 flex flex-col gap-1 items-center justify-center bg-white dark:bg-gray-700 ${
                        currentTemplateId === tpl.id
                          ? "border-blue-500 shadow-[0_0_0_1px_rgba(59,130,246,0.3)]"
                          : "border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 shadow-sm"
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1.5 w-full">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                          style={{ backgroundColor: tpl.themeColor }}
                        />
                        <span className="font-bold text-xs text-gray-800 dark:text-gray-200 truncate">
                          {tpl.name}
                        </span>
                      </div>

                      {currentTemplateId === tpl.id && (
                        <div className="absolute -top-1.5 -right-1.5 bg-blue-500 text-white rounded-full p-0.5 shadow-md">
                          <svg
                            className="w-2.5 h-2.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
              </div>
            </div>

            {/* 排版参数与细节 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 shrink-0">
              <h2 className="text-[14px] font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                ⚙️ 细节微调
              </h2>
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-medium text-gray-500 dark:text-gray-400">
                    <span>正文字号</span>
                    <span className="text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-1.5 rounded">
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
                    className="w-full h-1 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-medium text-gray-500 dark:text-gray-400">
                    <span>行高间距</span>
                    <span className="text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-1.5 rounded">
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
                    className="w-full h-1 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              </div>
            </div>

            {/* 滚动同步 - 仅桌面端显示 */}
            <div className="hidden md:block bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                    />
                  </svg>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    滚动同步
                  </span>
                </div>
                <button
                  onClick={() => setSyncScroll(!syncScroll)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    syncScroll ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-600"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                      syncScroll ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                开启后，编辑区与预览区将同步滚动
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
