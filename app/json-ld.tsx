import {
  SITE_BRAND,
  SITE_DESCRIPTION,
  SITE_HOST,
  SITE_PRODUCT_NAME,
  SITE_URL,
} from "@/lib/site-config";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${SITE_URL}/#web-app`,
      name: `${SITE_BRAND} · ${SITE_PRODUCT_NAME}`,
      alternateName: [SITE_BRAND, SITE_HOST, SITE_PRODUCT_NAME],
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      applicationCategory: "UtilityApplication",
      operatingSystem: "Web Browser",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "CNY",
      },
      featureList: [
        "Markdown转微信排版",
        "AI一键优化排版结构",
        "72套精美模板",
        "6大风格分类",
        "实时预览",
        "一键复制发布",
        "自定义字号行高",
        "主题色与排版细节微调",
        "本地图片粘贴与上传",
      ],
      screenshot: `${SITE_URL}/og-image.png`,
      author: {
        "@id": `${SITE_URL}/#organization`,
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: `${SITE_BRAND} · ${SITE_PRODUCT_NAME}`,
      alternateName: [SITE_HOST, SITE_BRAND],
      description: SITE_DESCRIPTION,
      publisher: {
        "@id": `${SITE_URL}/#organization`,
      },
      inLanguage: "zh-CN",
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_BRAND,
      alternateName: SITE_HOST,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
        width: 512,
        height: 512,
      },
      sameAs: [
        "https://github.com/mspringjade/wechat-formatter",
      ],
    },
    {
      "@type": "HowTo",
      "@id": `${SITE_URL}/#howto`,
      "name": `如何使用 ${SITE_BRAND} 进行公众号排版？`,
      "description": `只需三步，即可将 Markdown 文章转换为精美的微信公众号文章。`,
      "step": [
        {
          "@type": "HowToStep",
          "name": "输入内容",
          "text": "在左侧编辑器中输入或粘贴您的 Markdown 内容。",
          "url": `${SITE_URL}/#input`
        },
        {
          "@type": "HowToStep",
          "name": "选择模板与微调",
          "text": "在右侧选择您喜欢的模板，并根据需要调整字号、行高、主题色等细节。",
          "url": `${SITE_URL}/#settings`
        },
        {
          "@type": "HowToStep",
          "name": "复制发布",
          "text": "点击右上角的“一键复制发布”，然后粘贴到公众号后台即可。",
          "url": `${SITE_URL}/#copy`
        }
      ]
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/#faq`,
      "mainEntity": [
        {
          "@type": "Question",
          "name": "TypeZen 是什么？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "TypeZen 是一个免费在线的 Markdown 转微信公众号排版工具。它支持 AI 一键优化文章结构，提供 72 套精美排版模板，帮助用户快速生成适合公众号阅读的精美文章。"
          }
        },
        {
          "@type": "Question",
          "name": "TypeZen 的 AI 排版功能有什么作用？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "TypeZen 的 AI 一键排版功能可以在不修改原文内容的前提下，自动优化标题层级、空行处理、列表格式、引用块以及重点加粗，让文章结构更加清晰易读。"
          }
        },
        {
          "@type": "Question",
          "name": "TypeZen 支持本地图片吗？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "支持。您可以直接将本地图片拖拽或粘贴到编辑器中，TypeZen 会自动处理图片显示。在复制到公众号时，图片也会随之带入。"
          }
        },
        {
          "@type": "Question",
          "name": "如何将排版好的内容发布到公众号？",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "在 TypeZen 中完成排版后，只需点击右上角的“一键复制发布”按钮，然后直接在微信公众号后台编辑器中粘贴即可，格式将完美保留。"
          }
        }
      ]
    }
  ],
};

export function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
