import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function LandingHero() {
  return (
    <section className="pt-24 pb-20 px-6 md:px-12 max-w-7xl mx-auto flex flex-col items-center text-center relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-(--neo-pink) rounded-full opacity-20 blur-3xl -z-10" />
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-(--neo-cyan) rounded-full opacity-20 blur-3xl -z-10" />
      
      <div className="neo-panel bg-(--neo-pink) text-(--neo-ink) px-4 py-1 font-black text-sm uppercase mb-8 inline-flex items-center gap-2">
        <Sparkles className="w-4 h-4" />
        AI 智能排版已上线
      </div>

      <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter text-(--neo-ink) leading-[0.9]">
        让公众号排版<br />
        <span className="text-transparent" style={{ WebkitTextStroke: "2px var(--neo-ink)" }}>优雅且高效</span>
      </h1>
      
      <p className="text-xl md:text-2xl text-(--neo-muted) mb-12 max-w-3xl font-black leading-tight">
        TypeZen 是一款专为公众号设计的 Markdown 智能排版助手。集成了 72+ 精美模板、AI 一键结构优化与微信官方同步 API，助您在 1 分钟内完成从纯文本到专业排版的蜕变。
      </p>

      <div className="flex flex-col sm:flex-row gap-6">
        <Link 
          href="/editor" 
          className="neo-button neo-button-primary px-10 py-5 text-xl flex items-center gap-3"
        >
          免费开始排版 <ArrowRight className="w-6 h-6" />
        </Link>
        <Link 
          href="#features" 
          className="neo-button neo-button-ghost px-10 py-5 text-xl"
        >
          了解更多
        </Link>
      </div>

      {/* Hero Image / Mockup Placeholder */}
      <div className="mt-20 w-full max-w-5xl mx-auto neo-panel p-4 bg-(--neo-surface)">
        <div className="aspect-video bg-white dark:bg-slate-900 border-[3px] border-(--neo-ink) flex items-center justify-center relative overflow-hidden group">
          <img 
            src="/og-image.png" 
            alt="TypeZen 编辑器界面展示 - 实时 Markdown 转微信排版" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
