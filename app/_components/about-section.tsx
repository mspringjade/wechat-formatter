import { 
  SITE_BRAND, 
  SITE_DESCRIPTION, 
  SITE_HOST, 
  SITE_PRODUCT_NAME 
} from "@/lib/site-config";
import { CheckCircle2, HelpCircle, Info, Zap } from "lucide-react";

export function AboutSection() {
  return (
    <section className="bg-(--neo-bg) border-t-[3px] border-(--neo-ink) py-12 px-4 sm:py-20">
      <div className="max-w-[1000px] mx-auto space-y-16">
        {/* Introduction */}
        <div className="neo-panel p-8 sm:p-12 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <Info className="w-8 h-8 text-(--neo-pink)" />
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight">
              关于 {SITE_BRAND}
            </h2>
          </div>
          <p className="text-lg sm:text-xl font-bold leading-relaxed text-(--neo-ink)">
            {SITE_BRAND}（{SITE_HOST}）是一款专为微信公众号创作者设计的免费在线 Markdown 排版工具。
            它通过简洁的 Neo-Brutalism 视觉风格与强大的 AI 智能排版技术，
            将晦涩的 Markdown 代码一键转化为精美的公众号文章，
            让您的创作过程更加纯粹、排版效果更加专业。
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-(--neo-green) shrink-0 mt-1" />
              <span className="font-bold">72 套手工精选模板，涵盖多种风格</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-(--neo-green) shrink-0 mt-1" />
              <span className="font-bold">AI 智能识别文章结构，自动优化留白与强调</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-(--neo-green) shrink-0 mt-1" />
              <span className="font-bold">实时预览与样式微调，所见即所得</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-(--neo-green) shrink-0 mt-1" />
              <span className="font-bold">支持图片粘贴、数学公式与代码高亮</span>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="space-y-8">
          <div className="flex items-center gap-3 justify-center mb-4">
            <HelpCircle className="w-8 h-8 text-(--neo-cyan)" />
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-center">
              常见问题解答 (FAQ)
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="neo-panel p-6 bg-(--neo-surface)">
              <h3 className="text-xl font-black mb-3 border-b-2 border-(--neo-ink) pb-2">
                TypeZen 是什么？
              </h3>
              <p className="font-bold text-(--neo-muted)">
                TypeZen 是一个免费在线的 Markdown 转微信公众号排版工具。它支持 AI 一键优化文章结构，提供 72 套精美排版模板，帮助用户快速生成适合公众号阅读的精美文章。
              </p>
            </div>
            
            <div className="neo-panel p-6 bg-(--neo-surface)">
              <h3 className="text-xl font-black mb-3 border-b-2 border-(--neo-ink) pb-2">
                TypeZen 的 AI 排版功能有什么作用？
              </h3>
              <p className="font-bold text-(--neo-muted)">
                TypeZen 的 AI 一键排版功能可以在不修改原文内容的前提下，自动优化标题层级、空行处理、列表格式、引用块以及重点加粗，让文章结构更加清晰易读。
              </p>
            </div>
            
            <div className="neo-panel p-6 bg-(--neo-surface)">
              <h3 className="text-xl font-black mb-3 border-b-2 border-(--neo-ink) pb-2">
                TypeZen 支持本地图片吗？
              </h3>
              <p className="font-bold text-(--neo-muted)">
                支持。您可以直接将本地图片拖拽或粘贴到编辑器中，TypeZen 会自动处理图片显示。在复制到公众号时，图片也会随之带入。
              </p>
            </div>
            
            <div className="neo-panel p-6 bg-(--neo-surface)">
              <h3 className="text-xl font-black mb-3 border-b-2 border-(--neo-ink) pb-2">
                如何将排版好的内容发布到公众号？
              </h3>
              <p className="font-bold text-(--neo-muted)">
                在 TypeZen 中完成排版后，只需点击右上角的“一键复制发布”按钮，然后直接在微信公众号后台编辑器中粘贴即可，格式将完美保留。
              </p>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="neo-panel-strong p-8 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
            现在就开始使用 {SITE_BRAND}
          </h2>
          <p className="font-bold max-w-[600px] mx-auto opacity-90">
            无需注册，无需下载。直接在浏览器中打开，粘贴您的文章，
            选择心仪的样式，即可开启优雅的公众号创作之旅。
          </p>
          <div className="flex justify-center pt-2">
             <button 
               onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
               className="neo-button neo-button-primary px-8 py-3 text-lg"
             >
               立即开始排版
             </button>
          </div>
        </div>
      </div>
    </section>
  );
}
