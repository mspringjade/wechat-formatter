import { Copy, Layout, Palette, Shield, Sparkles, Zap } from "lucide-react";

const features = [
  {
    icon: <Sparkles className="w-8 h-8" />,
    title: "AI 智能结构优化",
    description:
      "接入 OpenAI, Anthropic 及 OpenRouter 顶级模型，一键自动修复标题层级、添加空行、规范列表，让排版逻辑更清晰。",
    color: "var(--neo-pink)",
  },
  {
    icon: <Palette className="w-8 h-8" />,
    title: "72 套精美排版模板",
    description:
      "涵盖 Neo-Brutalism、极简、商务、文艺等 6 大核心风格。支持字体大小、行高、段间距、主题色等 10+ 项细节实时微调。",
    color: "var(--neo-yellow)",
  },
  {
    icon: <Layout className="w-8 h-8" />,
    title: "丰富排版元素支持",
    description:
      "完整支持标题、列表、引用、表格、代码块、图片、分隔线等 Markdown 元素，全部转为微信兼容的内联样式 HTML，粘贴即可发布。",
    color: "var(--neo-cyan)",
  },
  {
    icon: <Copy className="w-8 h-8" />,
    title: "一键复制与自动同步",
    description:
      "免费版支持一键复制富文本，粘贴到公众号后台即可发布。专业版（Early Access）提供官方 API 同步，自动转存图片并创建草稿。",
    color: "var(--neo-green)",
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "本地数据隐私安全",
    description:
      "编辑与预览默认在本地浏览器完成。启用 AI 排版或微信同步时，仅为完成请求临时发送必要内容，我们不会持久化保存文章和私密密钥。",
    color: "var(--neo-pink)",
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: "极致响应极速体验",
    description:
      "基于 Next.js 16 最新架构构建，页面秒开。完美适配桌面与移动端，支持暗黑模式切换，无需注册登录即可使用。",
    color: "var(--neo-yellow)",
  },
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
            TypeZen 提供从 Markdown 编辑到微信同步的全链路功能，显著提升内容创作效率。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f) => (
            <div
              key={f.title}
              className="neo-panel p-8 group hover:-translate-y-2 transition-transform duration-300"
            >
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
