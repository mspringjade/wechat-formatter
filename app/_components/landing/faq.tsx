import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "TypeZen 真的完全免费吗？",
    a: "是的，TypeZen 的核心编辑、72 套精美模板以及基础转换功能目前完全免费提供。我们的目标是为公众号创作者提供最纯粹的排版工具。"
  },
  {
    q: "AI 排版功能是如何运作的？",
    a: "TypeZen 支持通过填入您自己的 OpenAI、Anthropic 或 OpenRouter API Key 来启用 AI 智能排版。这意味着数据传输发生在您的浏览器和大模型服务商之间，我们不触碰您的文章内容，确保极高的隐私性。"
  },
  {
    q: "模版库会更新吗？",
    a: "我们会定期根据设计趋势和用户反馈，更新和增加新的排版模板。目前已涵盖新粗野、极简、商务、文艺、科技、节庆等 6 大核心风格。"
  },
  {
    q: "为什么我复制过去后图片不显示？",
    a: "如果您使用了本地上传的图片，微信后台需要一定时间来‘转存’这些图片。建议在粘贴后等待 1-2 秒，或者使用 TypeZen 提供的‘公众号同步’功能进行一键同步。"
  },
  {
    q: "支持数学公式和代码高亮吗？",
    a: "完美支持！我们内置了渲染引擎，可以将 Markdown 中的 LaTeX 公式和主流编程语言代码块完美转化为微信兼容的图片或富文本格式。"
  }
];

export function LandingFAQ() {
  return (
    <section id="faq" className="py-24 bg-(--neo-surface) border-t-[3px] border-(--neo-ink)">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-(--neo-ink) uppercase">
            常见问题解答
          </h2>
          <p className="text-xl font-bold text-(--neo-muted)">
            在这里寻找您关于 TypeZen 的所有疑惑。
          </p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq) => (
            <details key={faq.q} className="group neo-panel bg-white [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between p-6 font-black cursor-pointer text-xl text-(--neo-ink)">
                {faq.q}
                <div className="w-10 h-10 border-[3px] border-(--neo-ink) flex items-center justify-center bg-(--neo-yellow) shadow-[2px_2px_0px_var(--neo-shadow-core)] group-open:bg-(--neo-pink) transition-colors">
                  <Plus className="w-6 h-6 group-open:hidden" />
                  <Minus className="w-6 h-6 hidden group-open:block" />
                </div>
              </summary>
              <div className="px-6 pb-8 text-lg font-bold text-(--neo-muted) leading-relaxed border-t-[3px] border-(--neo-ink) pt-6">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
