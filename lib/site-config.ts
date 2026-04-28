/** 站点与品牌常量（metadata、Json-Ld、robots、sitemap 共用） */

export const SITE_HOST = "typezen.online" as const;

export const SITE_URL = `https://${SITE_HOST}` as const;

export const SITE_BRAND = "TypeZen";

export const SITE_PRODUCT_NAME = "公众号一键排版助手";

/** 默认 <title>：品牌前置，兼顾「TypeZen」「公众号」「Markdown」「微信」等检索词 */
export const SITE_TITLE_DEFAULT = `${SITE_BRAND}｜${SITE_PRODUCT_NAME} — Markdown 转微信排版 · 50 套模板`;

/**
 * <meta name="description">：首句包含品牌与域名，便于品牌词与「site:typezen.online」类检索
 */
export const SITE_DESCRIPTION = `${SITE_BRAND}（${SITE_HOST}）是免费在线 Markdown 转微信公众号排版工具，提供极简、商务、文艺、科技、节庆 5 大类共 50 套精美模板，支持实时预览、一键复制，让文章在公众号后台呈现更专业、更美观。`;

/** Open Graph site_name：品牌与产品名并列 */
export const SITE_OG_SITE_NAME = `${SITE_BRAND} · ${SITE_PRODUCT_NAME}`;
