import type { MetadataRoute } from "next";
import {
  SITE_BRAND,
  SITE_DESCRIPTION,
  SITE_PRODUCT_NAME,
} from "@/lib/site-config";

/** PWA / 「添加到主屏幕」展示名称与简介，强化 TypeZen 品牌 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_BRAND} — ${SITE_PRODUCT_NAME}`,
    short_name: SITE_BRAND,
    description: SITE_DESCRIPTION,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#171717",
    icons: [
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
