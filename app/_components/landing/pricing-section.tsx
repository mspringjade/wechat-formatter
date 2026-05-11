import { Check, X, Code, Rocket } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "开源/免费版",
    price: "¥0",
    description: "功能完整，适合所有个人创作者",
    features: [
      "72 套手工精选排版模板",
      "AI 一键智能优化 (BYO Key)",
      "支持自定义 AI 提示词",
      "支持自选所有主流大模型",
      "实时 Markdown 预览",
      "本地图片粘贴与拖拽",
      "一键复制到公众号后台",
      "数据 100% 本地化处理"
    ],
    notIncluded: [
      "微信公众号一键同步 (API)",
      "多账号快速切换同步",
      "优先响应技术支持"
    ],
    buttonText: "立即开始使用",
    icon: <Code className="w-6 h-6" />,
    color: "var(--neo-cyan)"
  },
  {
    name: "专业/商业版",
    price: "Premium",
    description: "追求极致效率，打通发布全流程",
    features: [
      "包含开源版所有功能",
      "微信公众号一键同步 (API)",
      "无需手动粘贴，效率翻倍",
      "支持多公众号配置管理",
      "数学公式渲染增强",
      "代码高亮主题自由切换",
      "优先响应技术支持"
    ],
    highlight: true,
    buttonText: "立即体验专业版",
    icon: <Rocket className="w-6 h-6" />,
    color: "var(--neo-pink)"
  }
];

export function LandingPricing() {
  return (
    <section id="pricing" className="py-24 bg-(--neo-surface) border-t-[3px] border-(--neo-ink)">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-(--neo-ink) uppercase">
            定价与版本说明
          </h2>
          <p className="text-xl font-bold text-(--neo-muted) max-w-2xl mx-auto">
            我们致力于开源，AI 核心功能已全部免费开放。<br className="hidden sm:block" />
            专业版仅为需要深度集成同步功能的专业博主提供。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div 
              key={plan.name} 
              className={`neo-panel p-10 flex flex-col h-full bg-white relative transition-all duration-300 hover:shadow-[12px_12px_0px_var(--neo-shadow-core)] ${plan.highlight ? 'scale-105 z-10 border-t-[8px] border-t-(--neo-pink)' : ''}`}
            >
              {plan.highlight && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-(--neo-yellow) border-[3px] border-(--neo-ink) px-6 py-2 font-black text-sm uppercase shadow-[4px_4px_0px_#000] rotate-2">
                  最受欢迎的选择
                </div>
              )}
              
              <div className="mb-8 border-b-[3px] border-(--neo-ink) pb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 border-2 border-(--neo-ink) bg-slate-50 shadow-[2px_2px_0px_#000]">
                    {plan.icon}
                  </div>
                  <h3 className="text-2xl font-black text-(--neo-ink)">{plan.name}</h3>
                </div>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-5xl font-black text-(--neo-ink)">{plan.price}</span>
                  {plan.price !== "¥0" && <span className="text-sm font-bold text-(--neo-muted)">/ 一次性或订阅</span>}
                </div>
                <p className="font-bold text-(--neo-muted)">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-10 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 font-bold text-(--neo-ink)">
                    <div className="w-6 h-6 bg-(--neo-green) border-2 border-(--neo-ink) rounded-none flex items-center justify-center shrink-0">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    {f}
                  </li>
                ))}
                {plan.notIncluded?.map((f) => (
                  <li key={f} className="flex items-start gap-3 font-bold text-(--neo-muted) opacity-50">
                    <div className="w-6 h-6 bg-slate-100 border-2 border-(--neo-ink) rounded-none flex items-center justify-center shrink-0">
                      <X className="w-4 h-4 text-slate-400" />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>

              <Link 
                href="/editor"
                className="neo-button w-full py-5 text-xl text-center flex items-center justify-center gap-2 group"
                style={{ backgroundColor: plan.color }}
              >
                {plan.buttonText}
                <Rocket className="w-5 h-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <p className="font-bold text-(--neo-muted) text-sm italic">
            * AI 核心算法已在 GitHub 开源，您可以自行部署或使用本站提供的在线服务。
          </p>
        </div>
      </div>
    </section>
  );
}
