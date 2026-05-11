import { Sparkles, Palette, Shield, Copy, Layout, Zap } from "lucide-react";

const features = [
  {
    icon: <Sparkles className="w-8 h-8" />,
    title: "AI 智能结构优化",
    description: "接入 OpenAI, Anthropic 及 OpenRouter 顶级模型，一键修复标题层级、添加空行、规范列表，支持自定义 AI 提示词。",
    color: "var(--neo-pink)"
  },
  {
    icon: <Palette className="w-8 h-8" />,
    title: "72 套精美排版模板",
    description: "涵盖 Neo-Brutalism、极简、商务、文艺等 6 大核心风格。支持字体大小、行高、段间距、主题色等 10+ 项细节实时微调。",
    color: "var(--neo-yellow)"
  },
  {
    icon: <Layout className="w-8 h-8" />,
    title: "数学公式与代码增强",
    description: "完美支持 LaTeX 数学公式渲染。内置 20+ 种代码高亮主题，全部采用内联 CSS 渲染，深度适配微信公众号后台限制。",
    color: "var(--neo-cyan)"
  },
  {
    icon: <Copy className="w-8 h-8" />,
    title: "一键同步发布草稿",
    description: "不仅支持一键复制富文本，专业版更提供官方 API 同步功能。自动提取并上传图片，直接在公众号后台创建草稿。",
    color: "var(--neo-green)"
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "本地数据隐私安全",
    description: "文章数据 100% 留在本地浏览器。支持填入您自己的 API Key，我们绝不保存您的任何文章内容和私密密钥。",
    color: "var(--neo-pink)"
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: "极致响应极速体验",
    description: "基于 Next.js 16 最新架构构建，页面秒开。完美适配桌面与移动端，支持暗黑模式切换，无需注册登录即可使用。",
    color: "var(--neo-yellow)"
  }
];


export function LandingFeatures() {
  return (
    <section id="features" className="py-24 bg-(--neo-bg) border-t-[3px] border-(--neo-ink)">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-(--neo-ink) uppercase">
            核心功能特性
          </h2>
          <p className="text-xl font-bold text-(--neo-muted) max-w-2xl mx-auto">
            TypeZen 不仅仅是一个简单的格式转换器，它是您内容创作的超级加速器。
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f) => (
            <div key={f.title} className="neo-panel p-8 group hover:-translate-y-2 transition-transform duration-300">
              <div 
                className="w-16 h-16 flex items-center justify-center border-[3px] border-(--neo-ink) shadow-[4px_4px_0px_var(--neo-shadow-core)] mb-8 transition-transform group-hover:rotate-6"
                style={{ backgroundColor: f.color }}
              >
                {f.icon}
              </div>
              <h3 className="text-2xl font-black mb-4 text-(--neo-ink)">{f.title}</h3>
              <p className="text-lg font-bold text-(--neo-muted) leading-snug">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
