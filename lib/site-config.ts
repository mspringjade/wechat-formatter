/** 站点与品牌常量（metadata、Json-Ld、robots、sitemap 共用） */

export const SITE_HOST = "typezen.online" as const;
export const SITE_URL = `https://${SITE_HOST}` as const;
export const SITE_BRAND = "TypeZen";
export const SITE_PRODUCT_NAME = "公众号一键排版助手";

/** 默认 <title>：首选关键词，极度精简，50-60 字符以内 */
export const SITE_TITLE_DEFAULT = "TypeZen | 微信公众号 Markdown 智能排版工具";

/**
 * <meta name="description">：严格控制在 40-50 字符左右
 */
export const SITE_DESCRIPTION = "TypeZen: 极简 Markdown 转微信排版。AI 智能排版，72套精美模板，一键复制发布。";

/** Open Graph site_name */
export const SITE_OG_SITE_NAME = "TypeZen";

/** 编辑器页面专属 Title */
export const EDITOR_TITLE = "TypeZen 编辑器 | 实时 Markdown 转微信排版";

/** 编辑器页面专属 Description */
export const EDITOR_DESCRIPTION = "TypeZen 在线编辑器：AI 智能排版，72 套精美模板，本地安全，即开即用。";

/** 关键词 */
export const SITE_KEYWORDS = "TypeZen, typezen, typezen.online, 公众号排版, 微信公众号排版, Markdown 排版, 微信编辑器, 公众号编辑器, Markdown 转微信, 智能一键排版, AI 排版";
