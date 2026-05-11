"use client";

import Link from "next/link";
import { useTheme } from "../../_hooks/use-theme";
import { Moon, Sun } from "lucide-react";

export function LandingHeader() {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <header className="border-b-[3px] border-(--neo-ink) bg-(--neo-yellow) sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
        <Link href="/" className="font-black text-2xl tracking-tighter text-(--neo-ink) flex items-center gap-2">
          <div className="w-10 h-10 bg-(--neo-pink) rounded-none flex items-center justify-center border-[3px] border-(--neo-ink) shadow-[3px_3px_0px_var(--neo-shadow-core)]">
            <span className="text-(--neo-ink) font-black text-xl leading-none">T</span>
          </div>
          TypeZen
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          <Link href="#features" className="font-black text-sm uppercase hover:text-(--neo-pink) transition-colors">功能特性</Link>
          <Link href="#how-it-works" className="font-black text-sm uppercase hover:text-(--neo-pink) transition-colors">使用指南</Link>
          <Link href="#pricing" className="font-black text-sm uppercase hover:text-(--neo-pink) transition-colors">定价版本</Link>
          <Link href="#faq" className="font-black text-sm uppercase hover:text-(--neo-pink) transition-colors">常见问题</Link>
        </nav>


        <div className="flex items-center gap-4">
          <button
            onClick={toggleDarkMode}
            className="p-2 neo-button neo-button-ghost"
            title={isDarkMode ? "切换到亮色模式" : "切换到暗色模式"}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <Link href="/editor" className="neo-button neo-button-primary px-6 py-2 text-sm">
            进入编辑器
          </Link>
        </div>
      </div>
    </header>
  );
}
