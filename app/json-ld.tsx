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
      "@id": `${SITE_URL}/#webapplication`,
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
        "50套精美模板",
        "实时预览",
        "一键复制发布",
        "5大风格分类",
        "自定义字号行高",
      ],
      screenshot: `${SITE_URL}/logo.png`,
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/#softwareapplication`,
      name: `${SITE_BRAND} · ${SITE_PRODUCT_NAME}`,
      alternateName: SITE_BRAND,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "CNY",
      },
      softwareVersion: "1.0",
      fileFormat: "Web Application",
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
      sameAs: [],
    },
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
