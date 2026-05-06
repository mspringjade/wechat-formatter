/** 站点与品牌常量（metadata、Json-Ld、robots、sitemap 共用） */

export const SITE_HOST = "typezen.online" as const;

export const SITE_URL = `https://${SITE_HOST}` as const;

export const SITE_BRAND = "TypeZen";

export const SITE_PRODUCT_NAME = "公众号一键排版助手";

/** 默认 <title>：品牌前置，突出专业排版工具定位，弱化 AI 关键词的紧邻性 */
export const SITE_TITLE_DEFAULT = `${SITE_BRAND}｜${SITE_PRODUCT_NAME} — 专业的 Markdown 转微信排版工具 · 72 套精美模板 · 智能排版优化`;

/**
 * <meta name="description">：首句包含品牌与域名，便于品牌词与「site:typezen.online」类检索
 */
export const SITE_DESCRIPTION = `${SITE_BRAND}（${SITE_HOST}）是免费在线 Markdown 转微信公众号排版工具，支持 AI 一键优化排版结构，提供新粗野、极简、商务、文艺、科技、节庆 6 大类共 72 套精美模板，并支持实时预览、样式微调与一键复制发布。`;

/** Open Graph site_name：品牌与产品名并列 */
export const SITE_OG_SITE_NAME = `${SITE_BRAND} · ${SITE_PRODUCT_NAME}`;
