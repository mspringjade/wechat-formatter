import Link from "next/link";
import { blogPosts } from "../../blog/_data/posts";
import { ArrowRight, BookOpen, Calendar, Clock } from "lucide-react";

const categoryColors: Record<string, string> = {
  "排版指南": "bg-(--neo-pink)",
  "AI 创作": "bg-(--neo-cyan)",
  "设计美学": "bg-(--neo-yellow)",
  "技术教程": "bg-(--neo-green)",
};

export function LandingBlogSection() {
  // 取最新的 3 篇文章显示在首页
  const latestPosts = [...blogPosts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <section className="py-20 px-6 border-b-[3px] border-(--neo-ink) bg-(--neo-surface-alt)">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-block bg-(--neo-pink) text-black font-black text-xs uppercase px-3 py-1 border-2 border-(--neo-ink) shadow-[2px_2px_0px_var(--neo-shadow-core)] mb-4">
              TypeZen Blog & Guides
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-(--neo-ink) tracking-tighter uppercase">
              排版干货与运营指南
            </h2>
            <p className="text-base sm:text-lg font-bold text-(--neo-muted) mt-3 max-w-2xl">
              探索微信公众号美学设计、Markdown 写作技巧、微信搜一搜 SEO 以及 AI 智能排版的深度干货。
            </p>
          </div>

          <Link
            href="/blog"
            className="neo-button neo-button-primary px-6 py-3 text-sm flex items-center gap-2 self-start md:self-auto font-black whitespace-nowrap"
          >
            查看全部指南 <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Blog Post Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {latestPosts.map((post) => {
            const categoryBg = categoryColors[post.category] || "bg-white";
            return (
              <article
                key={post.slug}
                className="neo-panel bg-(--neo-surface) flex flex-col justify-between p-6 hover:translate-y-[-4px] hover:shadow-[8px_8px_0px_var(--neo-shadow-core)] transition-all duration-150"
              >
                <div>
                  {/* Category & Date */}
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`text-xs font-black uppercase text-black px-2.5 py-1 border-2 border-(--neo-ink) ${categoryBg}`}
                    >
                      {post.category}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-(--neo-muted)">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{post.date}</span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-black text-(--neo-ink) mb-3 leading-tight hover:text-(--neo-pink) transition-colors">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p className="text-sm font-bold text-(--neo-muted) leading-relaxed mb-6 line-clamp-3">
                    {post.description}
                  </p>
                </div>

                {/* Footer link */}
                <div className="pt-4 border-t-2 border-dashed border-(--neo-ink) flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs font-bold text-(--neo-muted)">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{post.readTime}</span>
                  </div>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="neo-button neo-button-ghost text-xs px-3 py-1.5 flex items-center gap-1 font-black"
                  >
                    阅读全文 <BookOpen className="w-3.5 h-3.5 ml-0.5" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
