import { SITE_BRAND, SITE_HOST, SITE_URL } from "@/lib/site-config";
import { Heart, Star } from "lucide-react";

export function AppFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-(--neo-app-header) border-t-[3px] border-(--neo-ink) py-2 px-4 shrink-0">
      <div className="max-w-[1600px] mx-auto flex flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="font-black text-sm tracking-tighter uppercase text-(--neo-ink)">
            {SITE_BRAND}
          </span>
          <span className="hidden sm:inline text-[10px] font-medium text-(--neo-muted)">
            专注公众号的 Markdown 排版工具
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-1.5 text-[10px] font-black text-(--neo-ink)">
            Made with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> by{" "}
            <a
              href={SITE_URL}
              className="hover:underline underline-offset-4 decoration-2"
            >
              {SITE_BRAND} Team
            </a>
          </div>
          <div className="h-4 w-[1px] bg-(--neo-ink) opacity-20 hidden md:block" />
          <a
            href="https://github.com/mspringjade/wechat-formatter"
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="neo-button neo-button-ghost p-1"
            title="GitHub 仓库 · Star 支持"
          >
            <Star className="w-4 h-4" />
          </a>
          <div className="text-[10px] font-bold text-(--neo-muted) tracking-tight uppercase">
            © {currentYear} {SITE_HOST.toUpperCase()}
          </div>
        </div>
      </div>
    </footer>
  );
}
