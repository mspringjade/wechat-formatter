import { Check, Code, Mail, Rocket, X } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "开源 / 免费版",
    price: "¥0",
    description: "功能完整，适合所有个人创作者",
    features: [
      "72 套手工精选排版模板",
      "AI 一键智能优化 (BYO Key)",
      "支持自选所有主流大模型",
      "实时 Markdown 预览",
      "本地图片粘贴与拖拽",
      "一键复制到公众号后台",
      "文章数据本地化处理",
    ],
    notIncluded: ["微信公众号自动同步 (API)", "图片自动转存至微信服务器"],
    cta: "立即开始使用",
    ctaHref: "/editor",
    icon: <Code className="w-6 h-6" />,
    color: "var(--neo-cyan)",
  },
  {
    name: "专业版 Early Access",
    price: "¥199",
    priceSuffix: "/年",
    description: "打通发布全流程，显著提升同步效率",
    features: [
      "包含免费版所有功能",
      "微信公众号一键同步 (API)",
      "自动上传文章配图至微信",
      "自动提取文章封面图",
      "自动创建公众号草稿",
      "出口 IP 探测与白名单诊断",
      "同步错误定位与处理建议",
    ],
    highlight: true,
    cta: "申请 Early Access",
    ctaHref: "#early-access",
    icon: <Rocket className="w-6 h-6" />,
    color: "var(--neo-pink)",
  },
];

export function LandingPricing() {
  return (
    <section id="pricing" className="py-24 bg-(--neo-surface) border-t-[3px] border-(--neo-ink)">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-(--neo-ink) uppercase">
            版本功能对比
          </h2>
          <p className="text-xl font-bold text-(--neo-muted) max-w-2xl mx-auto">
            核心编辑器永久免费，专业版为需要自动同步发布的用户而生。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`neo-panel p-10 flex flex-col h-full bg-white relative transition-all duration-300 hover:shadow-[12px_12px_0px_var(--neo-shadow-core)] ${plan.highlight ? "scale-105 z-10 border-t-[8px] border-t-(--neo-pink)" : ""}`}
            >
              {plan.highlight && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-(--neo-yellow) border-[3px] border-(--neo-ink) px-6 py-2 font-black text-sm uppercase shadow-[4px_4px_0px_#000] rotate-2">
                  Early Access 限量开放
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
                  {plan.priceSuffix && (
                    <span className="text-xl font-bold text-(--neo-muted)">{plan.priceSuffix}</span>
                  )}
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
                  <li
                    key={f}
                    className="flex items-start gap-3 font-bold text-(--neo-muted) opacity-50"
                  >
                    <div className="w-6 h-6 bg-slate-100 border-2 border-(--neo-ink) rounded-none flex items-center justify-center shrink-0">
                      <X className="w-4 h-4 text-slate-400" />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>

              {plan.ctaHref.startsWith("/") ? (
                <Link
                  href={plan.ctaHref}
                  className="neo-button w-full py-5 text-xl text-center flex items-center justify-center gap-2 group"
                  style={{ backgroundColor: plan.color }}
                >
                  {plan.cta}
                  <Rocket className="w-5 h-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                </Link>
              ) : (
                <a
                  href={plan.ctaHref}
                  className="neo-button w-full py-5 text-xl text-center flex items-center justify-center gap-2 group"
                  style={{ backgroundColor: plan.color }}
                >
                  {plan.cta}
                  <Mail className="w-5 h-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Early Access 说明 */}
        <div id="early-access" className="mt-20 max-w-3xl mx-auto">
          <div className="neo-panel p-8 bg-white text-center space-y-6">
            <h3 className="text-2xl font-black text-(--neo-ink)">什么是 Early Access？</h3>
            <p className="font-bold text-(--neo-muted) leading-relaxed">
              TypeZen 的核心编辑器将永久免费。专业版提供托管发布自动化服务——图片自动转存、
              草稿同步、出口 IP 白名单诊断等需要服务端能力的功能。
            </p>
            <p className="font-bold text-(--neo-muted) leading-relaxed">
              付费收入用于维护免费编辑器、支撑服务器成本和开发更多平台适配器。
            </p>
            <div className="bg-(--neo-yellow) border-[3px] border-(--neo-ink) p-6 text-left shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
              <p className="text-sm font-black mb-3">Early Access 用户享有：</p>
              <ul className="space-y-2 text-sm font-bold text-(--neo-ink)">
                <li>- 首批开通，优先体验微信同步功能</li>
                <li>- 直接反馈通道，功能需求优先响应</li>
                <li>- 后续正式版价格调整时锁定当前价格</li>
              </ul>
            </div>
            <p className="text-sm font-bold text-(--neo-muted)">
              有兴趣？请发送邮件至{" "}
              <a
                href="mailto:hello@typezen.online"
                className="underline text-(--neo-pink) hover:text-(--neo-ink) transition-colors"
              >
                hello@typezen.online
              </a>{" "}
              说明你的使用场景，我们会尽快回复。
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="font-bold text-(--neo-muted) text-sm italic">
            * 免费版已包含所有排版、AI 及预览功能。专业版仅增加自动化发布链路。
          </p>
        </div>
      </div>
    </section>
  );
}
