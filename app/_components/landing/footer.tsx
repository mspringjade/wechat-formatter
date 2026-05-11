import Link from "next/link";
import { SITE_BRAND, SITE_HOST } from "@/lib/site-config";
import { Info, Mail, Code, ExternalLink } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="bg-(--neo-ink) text-white border-t-[3px] border-(--neo-ink) py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-20">
          {/* Brand & About */}
          <div className="md:col-span-6 space-y-8">
            <Link href="/" className="font-black text-4xl tracking-tighter text-white flex items-center gap-3">
              <div className="w-12 h-12 bg-(--neo-pink) rounded-none flex items-center justify-center border-[3px] border-white">
                <span className="text-black font-black text-2xl leading-none">T</span>
              </div>
              {SITE_BRAND}
            </Link>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-(--neo-yellow)">
                <Info className="w-6 h-6" />
                <h3 className="text-xl font-black uppercase">关于我们</h3>
              </div>
              <p className="text-lg font-bold text-slate-400 leading-relaxed max-w-xl">
                {SITE_BRAND}（{SITE_HOST}）是一款专为微信公众号创作者设计的免费在线 Markdown 排版工具。
                我们致力于通过简洁的视觉风格与强大的 AI 智能排版技术，
                让创作过程更加纯粹、排版效果更加专业。
              </p>
            </div>
          </div>

          {/* Links */}
          <div className="md:col-span-3 space-y-8">
            <h3 className="text-xl font-black uppercase text-(--neo-cyan)">快速链接</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/editor" className="font-bold text-slate-400 hover:text-white transition-colors flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" /> 进入编辑器
                </Link>
              </li>
              <li>
                <Link href="#features" className="font-bold text-slate-400 hover:text-white transition-colors">功能特性</Link>
              </li>
              <li>
                <Link href="#pricing" className="font-bold text-slate-400 hover:text-white transition-colors">定价版本</Link>
              </li>
              <li>
                <Link href="#faq" className="font-bold text-slate-400 hover:text-white transition-colors">常见问题</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-3 space-y-8">
            <h3 className="text-xl font-black uppercase text-(--neo-green)">联系与支持</h3>
            <ul className="space-y-4">
              <li>
                <a href="mailto:support@typezen.online" className="font-bold text-slate-400 hover:text-white transition-colors flex items-center gap-2">
                  <Mail className="w-4 h-4" /> 邮件反馈
                </a>
              </li>
              <li>
                <a href="https://github.com/mspringjade/wechat-formatter" target="_blank" rel="noopener noreferrer nofollow" className="font-bold text-slate-400 hover:text-white transition-colors flex items-center gap-2">
                  <Code className="w-4 h-4" /> GitHub 开源
                </a>
              </li>
              <li className="pt-4">
                <div className="bg-slate-800 p-4 border-l-4 border-(--neo-pink)">
                  <p className="text-xs font-bold text-slate-400 leading-relaxed">
                    如果您觉得 TypeZen 对您有帮助，欢迎在 GitHub 上点个 Star 或分享给您的朋友。
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 font-bold text-sm">
            © {new Date().getFullYear()} {SITE_BRAND} (typezen.online). 版权所有。
          </p>
          <div className="flex gap-8 text-xs font-bold text-slate-500">
            <Link href="/" className="hover:text-white transition-colors">隐私政策</Link>
            <Link href="/" className="hover:text-white transition-colors">服务条款</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
