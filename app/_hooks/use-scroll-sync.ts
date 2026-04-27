import { useCallback, useRef, useState } from "react";
import type React from "react";

export function useScrollSync(inputRef: React.RefObject<HTMLTextAreaElement | null>) {
  const [syncScroll, setSyncScroll] = useState(true);
  const previewRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef<"input" | "preview" | null>(null);

  const handleInputScroll = useCallback(
    (e: React.UIEvent<HTMLTextAreaElement>) => {
      if (!syncScroll || isScrollingRef.current === "preview") return;
      isScrollingRef.current = "input";

      const inputEl = e.currentTarget;
      const previewEl = previewRef.current;
      if (!previewEl) return;

      const scrollRatio = inputEl.scrollTop / (inputEl.scrollHeight - inputEl.clientHeight);
      const previewScrollTop = scrollRatio * (previewEl.scrollHeight - previewEl.clientHeight);
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

      const scrollRatio = previewEl.scrollTop / (previewEl.scrollHeight - previewEl.clientHeight);
      const inputScrollTop = scrollRatio * (inputEl.scrollHeight - inputEl.clientHeight);
      inputEl.scrollTop = inputScrollTop;

      requestAnimationFrame(() => {
        isScrollingRef.current = null;
      });
    },
    [inputRef, syncScroll],
  );

  return {
    syncScroll,
    setSyncScroll,
    previewRef,
    handleInputScroll,
    handlePreviewScroll,
  };
}
