import { marked, type Tokens } from "marked";
import type { FormatTweaks } from "./_types/formatter";

export interface TemplateConfig {
  id: string;
  name: string;
  desc: string;
  category: string;
  themeColor: string;
  backgroundColor: string;
  baseStyle: {
    color: string;
    fontFamily: string;
  };
  containerStyle: string;
  h1Style: string;
  h2Style: string;
  h3Style: string;
  pStyle: string;
  blockquoteStyle: string;
  blockquoteInnerBefore: string;
  blockquoteInnerAfter: string;
  listStyle: string;
  listItemStyle: string;
  listIcon: string;
  strongStyle: string;
  emStyle: string;
  codeContainerStyle: string;
  codeHeaderStyle: string;
  codeBlockStyle: string;
  imgStyle: string;
  hrStyle: string;
  linkStyle: string;
  tableStyle: string;
  thStyle: string;
  tdStyle: string;
  delStyle: string;
}

const colorPalettes = {
  neoBrutalism: [
    "#ff6f9f",
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#ef4444",
    "#06b6d4",
    "#f43f5e",
    "#14b8a6",
    "#f97316",
    "#d946ef",
    "#84cc16",
  ],
  minimalist: [
    "#3b82f6",
    "#10b981",
    "#6366f1",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#14b8a6",
    "#f43f5e",
    "#64748b",
    "#000000",
    "#2dd4bf",
    "#fb923c",
  ],
  business: [
    "#1e40af",
    "#0f766e",
    "#4338ca",
    "#b45309",
    "#be123c",
    "#6d28d9",
    "#0e7490",
    "#9f1239",
    "#334155",
    "#111827",
    "#1d4ed8",
    "#047857",
  ],
  literary: [
    "#059669",
    "#d97706",
    "#be185d",
    "#7c3aed",
    "#0284c7",
    "#ea580c",
    "#4d7c0f",
    "#c026d3",
    "#0891b2",
    "#86198f",
    "#db2777",
    "#7c2d12",
  ],
  tech: [
    "#2563eb",
    "#0ea5e9",
    "#06b6d4",
    "#10b981",
    "#8b5cf6",
    "#a855f7",
    "#d946ef",
    "#f43f5e",
    "#6366f1",
    "#14b8a6",
    "#f97316",
    "#84cc16",
  ],
  festive: [
    "#ef4444",
    "#dc2626",
    "#b91c1c",
    "#f59e0b",
    "#d97706",
    "#ea580c",
    "#c2410c",
    "#be123c",
    "#9f1239",
    "#fbbf24",
    "#e11d48",
    "#ca8a04",
  ],
};

const names = [
  "经典",
  "雅致",
  "先锋",
  "深邃",
  "晨光",
  "星穹",
  "暖阳",
  "暮色",
  "清泉",
  "破晓",
  "璀璨",
  "幽蓝",
];

const categoriesList = [
  { id: "neo-brutalism", name: "新粗野风" },
  { id: "minimalist", name: "极简风" },
  { id: "business", name: "商务风" },
  { id: "literary", name: "文艺风" },
  { id: "tech", name: "科技风" },
  { id: "festive", name: "节庆风" },
];

function hexToRgb(hex: string) {
  const normalized = hex.replace("#", "").trim();
  const fullHex =
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => char + char)
          .join("")
      : normalized;

  const value = Number.parseInt(fullHex, 16);

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

function hexToRgba(hex: string, alpha: number) {
  const { r, g, b } = hexToRgb(hex);
  const safeAlpha = Math.max(0, Math.min(1, Number(alpha.toFixed(3))));
  return `rgba(${r}, ${g}, ${b}, ${safeAlpha})`;
}

function getStyleValue(style: string, property: string) {
  const escapedProperty = property.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
  const match = style.match(new RegExp(`${escapedProperty}\\s*:\\s*([^;]+)`, "i"));
  return match?.[1]?.trim() ?? "";
}

function ensureStyleValue(style: string, property: string, value: string) {
  const escapedProperty = property.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
  const regex = new RegExp(`${escapedProperty}\\s*:\\s*[^;]+;?`, "i");

  if (regex.test(style)) {
    return style.replace(regex, `${property}: ${value};`);
  }

  const normalizedStyle = style.trim();
  if (!normalizedStyle) {
    return `${property}: ${value};`;
  }

  return normalizedStyle.endsWith(";")
    ? `${normalizedStyle} ${property}: ${value};`
    : `${normalizedStyle}; ${property}: ${value};`;
}

function getStylesByCategory(category: string, color: string) {
  switch (category) {
    case "neo-brutalism":
      return {
        themeColor: color,
        backgroundColor: "#ffffff",
        baseStyle: {
          color: "#000000",
          fontFamily: "system-ui, -apple-system, sans-serif",
        },
        containerStyle: "padding: 24px; background-color: #ffffff;",
        h1Style: `font-size: 1.6em; font-weight: 900; text-align: center; margin: 20px 0; color: #000000; background-color: ${color}; border: 3px solid #000000; padding: 15px 12px; box-shadow: 8px 8px 0px #000000; line-height: 1.3; text-transform: uppercase; letter-spacing: 1px; display: block;`,
        h2Style: `font-size: 1.4em; font-weight: 800; margin: 24px 0 16px; color: #000000; background-color: ${color}; border: 3px solid #000000; padding: 8px 16px; box-shadow: 5px 5px 0px #000000; display: inline-block; line-height: 1.2;`,
        h3Style: `font-size: 1.15em; font-weight: 700; margin: 24px 0 12px; color: #000000; background-color: #ffffff; border: 2px solid #000000; padding: 4px 12px; box-shadow: 3px 3px 0px #000000; display: inline-block;`,
        pStyle: "margin: 0 0 16px 0; line-height: 1.8; font-weight: 500;",
        blockquoteStyle: `border: 3px solid #000000; margin: 24px 0; padding: 20px; color: #000000; background-color: ${hexToRgba(color, 0.1)}; box-shadow: 6px 6px 0px #000000;`,
        blockquoteInnerBefore: `<span style="display: block; font-size: 2em; line-height: 1; margin-bottom: 10px; color: #000000; font-family: Georgia, serif;">“</span>`,
        blockquoteInnerAfter: `<span style="display: block; font-size: 2em; line-height: 1; text-align: right; margin-top: 10px; color: #000000; font-family: Georgia, serif;">”</span>`,
        listStyle: "margin: 0 0 16px 0; padding: 0; list-style-type: none;",
        listItemStyle: "margin: 0 0 10px 0; line-height: 1.6; font-weight: 500;",
        listIcon: `<section style="display: inline-block; width: 12px; height: 12px; background-color: ${color}; border: 2px solid #000000; vertical-align: middle; box-shadow: 2px 2px 0px #000000; box-sizing: border-box; overflow: hidden;"><br/></section>`,
        strongStyle: `font-weight: 800; background-color: ${color}; color: #000000; padding: 0 4px; border: 2px solid #000000;`,
        emStyle: "font-style: italic; text-decoration: underline; text-decoration-thickness: 2px;",
        codeContainerStyle: `margin: 24px 0; border: 3px solid #000000; box-shadow: 6px 6px 0px #000000; background-color: #ffffff; overflow: hidden;`,
        codeHeaderStyle: `background-color: ${color}; padding: 8px 12px; border-bottom: 3px solid #000000;`,
        codeBlockStyle: `margin: 0; padding: 16px; overflow-x: auto; color: #000000; font-size: 13px; font-family: monospace; line-height: 1.6; white-space: pre-wrap; word-break: break-all;`,
        imgStyle:
          "max-width: 100%; border: 3px solid #000000; box-shadow: 6px 6px 0px #000000; display: block; margin: 24px auto;",
        hrStyle: `border: none; border-top: 4px solid #000000; margin: 40px 0;`,
        linkStyle: `color: #000000; font-weight: 700; text-decoration: none; border-bottom: 3px solid ${color};`,
        tableStyle:
          "width: 100%; max-width: 100%; border-collapse: collapse; margin: 24px 0; border: 3px solid #000000; table-layout: fixed; word-wrap: break-word;",
        thStyle: `border: 2px solid #000000; padding: 12px; background-color: ${color}; color: #000000; font-weight: 800; text-align: left;`,
        tdStyle: "border: 2px solid #000000; padding: 12px; color: #000000; font-weight: 500;",
        delStyle: "text-decoration: line-through; opacity: 0.6;",
      };
    case "minimalist":
      return {
        themeColor: color,
        backgroundColor: "#ffffff",
        baseStyle: {
          color: "#374151",
          fontFamily: "system-ui, -apple-system, sans-serif",
        },
        containerStyle: "padding: 16px; background-color: #ffffff;",
        h1Style: `font-size: 1.4em; font-weight: bold; text-align: center; margin: 24px 0 16px; color: ${color}; border-bottom: 1px solid ${color}; padding-bottom: 8px; line-height: 1.4;`,
        h2Style: `font-size: 1.25em; font-weight: bold; margin: 24px 0 16px; color: #111827; padding-left: 12px; border-left: 4px solid ${color}; line-height: 1.4;`,
        h3Style: `font-size: 1.1em; font-weight: bold; margin: 16px 0 12px; color: #374151; line-height: 1.4;`,
        pStyle: "margin: 0 0 16px 0; line-height: 1.8; text-indent: 0;",
        blockquoteStyle: `border-left: 3px solid ${color}; margin: 20px 0; padding: 12px 16px; color: #4b5563; background-color: #f3f4f6;`,
        blockquoteInnerBefore: "",
        blockquoteInnerAfter: "",
        listStyle: "margin: 0 0 16px 0; padding: 0; list-style-type: none;",
        listItemStyle: "margin: 0 0 8px 0; line-height: 1.6;",
        listIcon: `<section style="display: inline-block; color: ${color}; font-weight: bold;">•</section>`,
        strongStyle: `font-weight: bold; color: ${color};`,
        emStyle: "font-style: italic; color: #4b5563;",
        codeContainerStyle: `margin: 20px 0; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #e5e7eb; overflow: hidden; background-color: #f8fafc;`,
        codeHeaderStyle: `background-color: #e2e8f0; padding: 8px 12px; font-size: 0; line-height: 1;`,
        codeBlockStyle: `margin: 0; padding: 16px; overflow-x: auto; color: #334155; font-size: 13px; font-family: monospace; line-height: 1.6; white-space: pre-wrap; word-break: break-all;`,
        imgStyle: "max-width: 100%; border-radius: 8px; display: block; margin: 20px auto;",
        hrStyle: `border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;`,
        linkStyle: `color: ${color}; text-decoration: none; border-bottom: 1px dashed ${color};`,
        tableStyle:
          "width: 100%; max-width: 100%; border-collapse: collapse; margin: 24px 0; font-size: 0.95em; table-layout: fixed; word-wrap: break-word;",
        thStyle: `border-bottom: 2px solid ${color}; padding: 12px 8px; text-align: left; color: #111827; font-weight: bold; margin: 0;`,
        tdStyle:
          "border-bottom: 1px solid #f3f4f6; padding: 12px 8px; color: #4b5563; margin: 0; word-wrap: break-word; word-break: break-all;",
        delStyle: "text-decoration: line-through; color: #9ca3af;",
      };
    case "business":
      return {
        themeColor: color,
        backgroundColor: "#ffffff",
        baseStyle: {
          color: "#334155",
          fontFamily: "system-ui, -apple-system, sans-serif",
        },
        containerStyle: "padding: 20px; background-color: #ffffff;",
        h1Style: `font-size: 1.5em; font-weight: 800; text-align: left; margin: 24px 0 24px 0; color: ${color}; border-bottom: 3px solid ${color}; line-height: 1.4; padding-bottom: 8px;`,
        h2Style: `font-size: 1.2em; font-weight: 700; background-color: ${color}; color: #ffffff; display: inline-block; padding: 6px 16px; margin: 24px 0 16px 0; border-radius: 2px; line-height: 1.4;`,
        h3Style: `font-size: 1.1em; font-weight: bold; margin: 16px 0 12px 0; color: ${color}; border-bottom: 1px dashed ${hexToRgba(color, 0.502)}; padding-bottom: 4px; line-height: 1.4;`,
        pStyle: "margin: 0 0 16px 0; line-height: 1.8; text-indent: 2em;",
        blockquoteStyle: `border-left: 6px solid ${color}; margin: 24px 0; padding: 16px; color: #475569; background-color: #f8fafc; font-weight: 500;`,
        blockquoteInnerBefore: "",
        blockquoteInnerAfter: "",
        listStyle: "margin: 0 0 16px 0; padding: 0; list-style-type: none;",
        listItemStyle: "margin: 0 0 10px 0; line-height: 1.7;",
        listIcon: `<section style="display: inline-block; color: ${color}; font-size: 12px;">■</section>`,
        strongStyle: `font-weight: bold; color: ${color}; background-color: ${hexToRgba(color, 0.082)}; padding: 0 2px;`,
        emStyle: "font-style: italic; color: #64748b;",
        codeContainerStyle: `margin: 20px 0; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border: 1px solid #475569; overflow: hidden; background-color: #1e293b;`,
        codeHeaderStyle: `background-color: #334155; padding: 8px 12px; font-size: 0; line-height: 1; border-bottom: 1px solid #0f172a;`,
        codeBlockStyle: `margin: 0; padding: 16px; overflow-x: auto; color: #f8fafc; font-size: 13px; font-family: monospace; line-height: 1.6; white-space: pre-wrap; word-break: break-all;`,
        imgStyle:
          "max-width: 100%; border: 1px solid #e2e8f0; padding: 4px; display: block; margin: 20px auto;",
        hrStyle: `border: none; border-top: 2px dashed ${hexToRgba(color, 0.502)}; margin: 32px 0;`,
        linkStyle: `color: ${color}; font-weight: 500; text-decoration: none; border-bottom: 1px solid ${color};`,
        tableStyle:
          "width: 100%; max-width: 100%; border-collapse: collapse; margin: 24px 0; border: 1px solid #cbd5e1; font-size: 0.9em; table-layout: fixed; word-wrap: break-word;",
        thStyle: `border: 1px solid #cbd5e1; padding: 10px; background-color: #f8fafc; color: ${color}; font-weight: bold; margin: 0;`,
        tdStyle: `border: 1px solid #cbd5e1; padding: 10px; color: #334155; margin: 0; word-wrap: break-word; word-break: break-all;`,
        delStyle: "text-decoration: line-through; color: #cbd5e1;",
      };
    case "literary":
      return {
        themeColor: color,
        backgroundColor: "#fdfcfb",
        baseStyle: {
          color: "#4b5563",
          fontFamily: '"Noto Serif SC", serif, system-ui',
        },
        containerStyle: `padding: 24px 16px; background-color: #fdfcfb;`,
        h1Style: `font-size: 1.35em; font-weight: normal; text-align: center; margin: 30px 0; color: ${color}; letter-spacing: 4px; line-height: 1.4;`,
        h2Style: `font-size: 1.15em; font-weight: normal; text-align: center; margin: 30px 0 20px; color: ${color}; padding: 8px 0; line-height: 1.4; border-top: 1px solid ${hexToRgba(color, 0.251)}; border-bottom: 1px solid ${hexToRgba(color, 0.251)}; letter-spacing: 2px; display: block;`,
        h3Style: `font-size: 1.05em; font-weight: bold; text-align: center; margin: 20px 0 16px 0; color: #374151; line-height: 1.4;`,
        pStyle: "margin: 0 0 20px 0; line-height: 2.0; letter-spacing: 1px;",
        blockquoteStyle: `margin: 32px 0; padding: 20px; color: ${color}; text-align: center; font-style: italic; font-size: 0.95em; border-radius: 8px; background-color: ${hexToRgba(color, 0.031)};`,
        blockquoteInnerBefore: ``,
        blockquoteInnerAfter: ``,
        listStyle: "margin: 0 0 20px 0; padding: 0; list-style-type: none;",
        listItemStyle: `margin: 0 0 12px 0; line-height: 1.8;`,
        listIcon: `<section style="display: inline-block; width: 8px; height: 8px; border: 1px solid ${color}; border-radius: 50%; vertical-align: middle; box-sizing: border-box; overflow: hidden;"><br/></section>`,
        strongStyle: `font-weight: normal; color: #1f2937; border-bottom: 2px solid ${hexToRgba(color, 0.502)};`,
        emStyle: `font-style: italic; color: ${color};`,
        codeContainerStyle: `margin: 24px 0; border-radius: 12px; box-shadow: 0 8px 20px rgba(0,0,0,0.03); border: 1px solid ${hexToRgba(color, 0.188)}; overflow: hidden; background-color: #fdfaf6;`,
        codeHeaderStyle: `background-color: ${hexToRgba(color, 0.063)}; padding: 8px 12px; font-size: 0; line-height: 1; border-bottom: 1px solid ${hexToRgba(color, 0.125)};`,
        codeBlockStyle: `margin: 0; padding: 16px; overflow-x: auto; color: #374151; font-size: 13px; font-family: monospace; white-space: pre-wrap; word-break: break-all; line-height: 1.6;`,
        imgStyle:
          "max-width: 100%; border-radius: 12px; box-shadow: 0 8px 20px rgba(0,0,0,0.05); display: block; margin: 30px auto;",
        hrStyle: `border: none; border-top: 1px solid ${hexToRgba(color, 0.251)}; margin: 32px auto; width: 60%;`,
        linkStyle: `color: ${color}; text-decoration: none; border-bottom: 1px solid ${color}; padding-bottom: 1px;`,
        tableStyle:
          "width: 100%; max-width: 100%; border-collapse: collapse; margin: 24px 0; font-size: 0.95em; table-layout: fixed; word-wrap: break-word;",
        thStyle: `border-bottom: 1px solid ${color}; padding: 12px; color: ${color}; font-weight: normal; letter-spacing: 1px; text-align: left; margin: 0;`,
        tdStyle: `border-bottom: 1px dashed ${hexToRgba(color, 0.251)}; padding: 12px; color: #4b5563; margin: 0; word-wrap: break-word; word-break: break-all; background-color: #fdfcfb;`,
        delStyle: "text-decoration: line-through; opacity: 0.5;",
      };
    case "tech":
      return {
        themeColor: color,
        backgroundColor: "#0f172a",
        baseStyle: {
          color: "#e5e7eb",
          fontFamily: '"Space Grotesk", sans-serif',
        },
        containerStyle: `padding: 20px; background-color: #0f172a;`,
        h1Style: `font-size: 1.6em; font-weight: bold; text-align: left; margin: 20px 0 32px 0; color: ${color === "#10b981" ? "#3b82f6" : "#10b981"}; text-transform: uppercase; letter-spacing: 2px; line-height: 1.4; border-bottom: 2px solid ${hexToRgba(color, 0.314)}; padding-bottom: 12px;`,
        h2Style: `font-size: 1.25em; font-weight: bold; margin: 30px 0 20px 0; color: #ffffff; border-left: 6px solid ${color}; padding-left: 14px; background-color: #1e293b; display: block; line-height: 1.4; padding-top: 6px; padding-bottom: 6px;`,
        h3Style: `font-size: 1.1em; font-weight: bold; margin: 20px 0 16px 0; color: ${color}; line-height: 1.4;`,
        pStyle: "margin: 0 0 16px 0; line-height: 1.8; color: #cbd5e1;",
        blockquoteStyle: `border: 1px solid ${color}; margin: 24px 0; padding: 16px; color: #94a3b8; background-color: #1e293b; border-radius: 4px;`,
        blockquoteInnerBefore: `<span style="color: ${color === "#10b981" ? "#3b82f6" : "#10b981"}; margin-right: 8px;">></span>`,
        blockquoteInnerAfter: ``,
        listStyle: "margin: 0 0 16px 0; padding: 0; list-style-type: none;",
        listItemStyle: `margin: 0 0 10px 0; line-height: 1.7;`,
        listIcon: `<section style="display: inline-block; color: ${color === "#10b981" ? "#3b82f6" : "#10b981"}; font-weight: bold; font-family: monospace;">/&gt;</section>`,
        strongStyle: `font-weight: bold; color: #ffffff; border-bottom: 1px solid ${color};`,
        emStyle: `color: ${color}; font-style: normal; text-decoration: underline; text-decoration-color: ${color};`,
        codeContainerStyle: `margin: 24px 0; border-radius: 6px; border: 1px solid #334155; overflow: hidden; background-color: #000000;`,
        codeHeaderStyle: `background-color: #1e293b; padding: 8px 12px; font-size: 0; line-height: 1; border-bottom: 1px solid #334155;`,
        codeBlockStyle: `margin: 0; padding: 16px; overflow-x: auto; color: ${color === "#10b981" ? "#3b82f6" : "#10b981"}; font-size: 13px; font-family: monospace; white-space: pre-wrap; word-break: break-all; line-height: 1.5;`,
        imgStyle: `max-width: 100%; border: 2px solid #334155; border-radius: 8px; display: block; margin: 24px auto;`,
        hrStyle: `border: none; border-top: 1px solid #334155; margin: 32px 0;`,
        linkStyle: `color: ${color === "#10b981" ? "#3b82f6" : "#10b981"}; text-decoration: underline; text-decoration-style: dashed;`,
        tableStyle: `width: 100%; max-width: 100%; border-collapse: collapse; margin: 24px 0; border: 1px solid #334155; font-size: 0.9em; table-layout: fixed; word-wrap: break-word;`,
        thStyle: `border: 1px solid #334155; padding: 10px; background-color: #1e293b; color: #ffffff; text-align: left; margin: 0;`,
        tdStyle: `border: 1px solid #334155; padding: 10px; color: #cbd5e1; margin: 0; word-wrap: break-word; word-break: break-all;`,
        delStyle: `text-decoration: line-through; color: #475569;`,
      };
    default:
      return {
        themeColor: color,
        backgroundColor: "#fffbeb",
        baseStyle: { color: "#451a03", fontFamily: "system-ui, sans-serif" },
        containerStyle: `padding: 24px; background-color: #fffbeb; border: 4px solid ${color};`,
        h1Style: `font-size: 1.5em; font-weight: bold; text-align: center; margin: 10px 0 30px 0; color: #ffffff; background-color: ${color}; padding: 12px; border-radius: 8px; letter-spacing: 2px; line-height: 1.4;`,
        h2Style: `font-size: 1.2em; font-weight: bold; text-align: center; background-color: #fef3c7; color: ${color}; border: 2px solid ${color}; margin: 24px auto 20px auto; padding: 8px 24px; border-radius: 20px; display: inline-block; line-height: 1.4;`,
        h3Style: `font-size: 1.1em; font-weight: bold; margin: 16px 0 16px 0; color: ${color}; text-align: center; line-height: 1.4;`,
        pStyle: "margin: 0 0 16px 0; line-height: 1.8; text-indent: 2em; color: #78350f;",
        blockquoteStyle: `border: 2px dashed ${color}; border-radius: 8px; margin: 24px 0; padding: 16px; color: #92400e; background-color: #fef3c7; text-align: center; font-weight: 500;`,
        blockquoteInnerBefore: ``,
        blockquoteInnerAfter: ``,
        listStyle: "margin: 0 0 16px 0; padding: 0; color: #78350f; list-style-type: none;",
        listItemStyle: "margin: 0 0 10px 0; line-height: 1.7;",
        listIcon: `<section style="display: inline-block; width: 8px; height: 8px; background-color: #ea580c; transform: rotate(45deg); vertical-align: middle; box-sizing: border-box; overflow: hidden;"><br/></section>`,
        strongStyle: `font-weight: bold; color: ${color};`,
        emStyle: `font-style: italic; color: #b45309;`,
        codeContainerStyle: `margin: 24px 0; border-radius: 8px; border: 2px dashed ${color}; overflow: hidden; background-color: #fef3c7;`,
        codeHeaderStyle: `background-color: #fcd34d; padding: 8px 12px; font-size: 0; line-height: 1; border-bottom: 2px solid ${hexToRgba(color, 0.125)};`,
        codeBlockStyle: `margin: 0; padding: 16px; overflow-x: auto; color: #9f1239; font-size: 13px; font-family: monospace; white-space: pre-wrap; word-break: break-all; line-height: 1.5;`,
        imgStyle: `max-width: 100%; border: 4px solid #fef3c7; border-radius: 12px; display: block; margin: 20px auto;`,
        hrStyle: `border: none; border-top: 2px dashed ${color}; margin: 32px 0;`,
        linkStyle: `color: #9f1239; font-weight: bold; text-decoration: none; border-bottom: 2px solid #fcd34d;`,
        tableStyle: `width: 100%; max-width: 100%; border-collapse: collapse; margin: 24px 0; border: 2px solid ${color}; font-size: 0.9em; table-layout: fixed; word-wrap: break-word;`,
        thStyle: `border: 1px solid ${color}; padding: 10px; background-color: #fef3c7; color: ${color}; font-weight: bold; text-align: center; margin: 0;`,
        tdStyle: `border: 1px solid ${color}; padding: 10px; color: #92400e; margin: 0; word-wrap: break-word; word-break: break-all;`,
        delStyle: `text-decoration: line-through; color: #b45309;`,
      };
  }
}

function generateTemplates(): TemplateConfig[] {
  const result: TemplateConfig[] = [];

  // 1. 极简风 (Minimalist) - 圆点、清爽边框
  colorPalettes.minimalist.forEach((color, i) => {
    result.push({
      id: `minimalist-${i}`,
      name: names[i],
      desc: "标准的点与线排版，适合日常阅读",
      category: "minimalist",
      ...getStylesByCategory("minimalist", color),
    });
  });

  // 2. 商务风 (Business) - 方块、实底、专业
  colorPalettes.business.forEach((color, i) => {
    result.push({
      id: `business-${i}`,
      name: names[i],
      desc: "方块标识符，适合严谨的行业报告",
      category: "business",
      ...getStylesByCategory("business", color),
    });
  });

  // 3. 文艺风 (Literary) - 花朵、括号、留白
  colorPalettes.literary.forEach((color, i) => {
    result.push({
      id: `literary-${i}`,
      name: names[i],
      desc: "配有小花图标，给文字呼吸喘息的空间",
      category: "literary",
      ...getStylesByCategory("literary", color),
    });
  });

  // 4. 科技风 (Tech) - 尖角、极客终端
  colorPalettes.tech.forEach((color, i) => {
    result.push({
      id: `tech-${i}`,
      name: names[i],
      desc: "打破常规的终端 /> 标识设计",
      category: "tech",
      ...getStylesByCategory("tech", color),
    });
  });

  // 5. 节庆风 (Festive) - 星星、双线元素
  colorPalettes.festive.forEach((color, i) => {
    result.push({
      id: `festive-${i}`,
      name: names[i],
      desc: "星星标识与浓烈色彩传递节日喜悦",
      category: "festive",
      ...getStylesByCategory("festive", color),
    });
  });

  // 6. 新粗野主义 (Neo-Brutalism) - 粗黑边框、硬投影、高对比
  colorPalettes.neoBrutalism.forEach((color, i) => {
    result.push({
      id: `neo-brutalism-${i}`,
      name: names[i],
      desc: "高饱和度色彩、纯黑边框与硬投影，大胆不羁",
      category: "neo-brutalism",
      ...getStylesByCategory("neo-brutalism", color),
    });
  });

  return result;
}

export const allTemplates = generateTemplates();
export const groupedTemplates = categoriesList.map((cat) => ({
  ...cat,
  templates: allTemplates.filter((t) => t.category === cat.id),
}));

export function renderArticle(
  markdownText: string,
  baseTemplate: TemplateConfig,
  formatTweaks: FormatTweaks,
): string {
  // Use custom theme color if provided
  const template = formatTweaks.themeColor
    ? {
        ...baseTemplate,
        ...getStylesByCategory(baseTemplate.category, formatTweaks.themeColor),
      }
    : baseTemplate;

  const customRenderer = new marked.Renderer();
  const defaultRenderer = new marked.Renderer();

  const tuneBlockStyle = (
    style: string,
    options: {
      lineHeight?: boolean;
      paragraphSpacing?: boolean;
      firstLineIndent?: boolean;
      letterSpacing?: boolean;
    } = {},
  ) => {
    let nextStyle = style;

    if (options.lineHeight) {
      nextStyle = ensureStyleValue(nextStyle, "line-height", String(formatTweaks.lineHeight));
    }

    if (options.paragraphSpacing) {
      nextStyle = ensureStyleValue(nextStyle, "margin", `0 0 ${formatTweaks.paragraphSpacing}px 0`);
    }

    if (options.firstLineIndent) {
      nextStyle = ensureStyleValue(
        nextStyle,
        "text-indent",
        formatTweaks.firstLineIndent ? "2em" : "0",
      );
    }

    if (options.letterSpacing) {
      nextStyle = ensureStyleValue(nextStyle, "letter-spacing", `${formatTweaks.letterSpacing}px`);
    }

    return nextStyle;
  };

  const paragraphStyle = tuneBlockStyle(template.pStyle, {
    lineHeight: true,
    paragraphSpacing: true,
    firstLineIndent: true,
    letterSpacing: true,
  });

  const listItemStyle = tuneBlockStyle(template.listItemStyle, {
    lineHeight: true,
    letterSpacing: true,
  });

  const blockquoteStyle = tuneBlockStyle(template.blockquoteStyle, {
    lineHeight: true,
    letterSpacing: true,
  });

  const imageStyle = ensureStyleValue(
    template.imgStyle,
    "border-radius",
    `${formatTweaks.imageRadius}px`,
  );

  // Adds background-color to a style string only when it doesn't already have one.
  // This distributes the article background across individual block elements so that
  // even if WeChat's paste handler strips the outer section background, each content
  // block still shows the correct color. Crucially, it also removes the need for a
  // monolithic <table> wrapper, which was blocking WeChat's smart-ad system from
  // finding paragraph break points inside the article.
  const bgFallback = (style: string): string => {
    if (/background-color\s*:/i.test(style)) return style;
    const trimmed = style.trimEnd();
    return `${trimmed}${trimmed.endsWith(";") ? " " : "; "}background-color: ${template.backgroundColor};`;
  };

  customRenderer.heading = function (token: Tokens.Heading) {
    const depth = token.depth;
    const textHtml = this.parser.parseInline(token.tokens);

    let baseStyle = "";
    if (depth === 1) baseStyle = template.h1Style;
    else if (depth === 2) baseStyle = template.h2Style;
    else baseStyle = template.h3Style;

    const s = bgFallback(baseStyle);

    // Extract margin and align
    const marginMatch = s.match(/margin\s*:\s*([^;]+)/i);
    const margin = marginMatch ? marginMatch[1] : (depth === 1 ? "32px 0" : "24px 0");
    const cleanStyle = s.replace(/margin\s*:\s*[^;]+;?/gi, "margin: 0;");
    
    const textAlignMatch = cleanStyle.match(/text-align\s*:\s*([^;]+)/i);
    const textAlign = textAlignMatch ? textAlignMatch[1] : (depth === 1 ? "center" : "left");

    const isInline = cleanStyle.includes("display: inline-block");

    // Use robust nested section structure for WeChat to avoid text displacement
    if (isInline) {
      return `<section style="margin: ${margin}; text-align: ${textAlign};">
        <section style="${cleanStyle} display: inline-block; text-align: left;">
          <section style="margin: 0; padding: 0; font-size: 1em; font-weight: inherit; line-height: 1.4; background: none; border: none; color: inherit;">
            ${textHtml}
          </section>
        </section>
      </section>`;
    }

    return `<section style="margin: ${margin}; text-align: ${textAlign};">
      <section style="${cleanStyle}">
        <section style="margin: 0; padding: 0; font-size: 1em; font-weight: inherit; line-height: 1.4; background: none; border: none; color: inherit;">
          ${textHtml}
        </section>
      </section>
    </section>`;
  };

  customRenderer.paragraph = function (token: Tokens.Paragraph) {
    const html = defaultRenderer.paragraph.call(this, token);

    // Check for multi-image row (only contains images and optional whitespaces/breaks)
    const pContent = html
      .trim()
      .replace(/^<p[^>]*>/i, "")
      .replace(/<\/p>$/i, "");
    const textWithoutImg = pContent
      .replace(/<img[^>]*>/gi, "")
      .replace(/<br\s*\/?>/gi, "")
      .trim();

    if (textWithoutImg === "") {
      const imagesMatch = pContent.match(/<img[^>]*>/gi);
      if (imagesMatch && imagesMatch.length > 1) {
        // Multi-image layout using inline-block (Highly compatible, avoids table and flex)
        const gapWidth = 4;
        const imgCount = imagesMatch.length;
        const widthPercent = (100 / imgCount) - 1.5;

        const flexItems = imagesMatch
          .map((imgHtml: string) => {
            const styledImg = imgHtml.replace(
              /style="[^"]*"/i,
              `style="width: 100%; height: auto; object-fit: cover; border-radius: ${formatTweaks.imageRadius}px; display: block; vertical-align: middle;"`,
            );
            return `<section style="display: inline-block; width: ${widthPercent}%; padding: 0 ${gapWidth}px; box-sizing: border-box; vertical-align: top;">${styledImg}</section>`;
          })
          .join("");

        return `<section style="text-align: center; margin: 0 0 16px 0; line-height: 0;">${flexItems}</section>`;
      }
    }

    return html.replace(/^<p[^>]*>/i, `<p style="${bgFallback(paragraphStyle)}">`);
  };

  customRenderer.blockquote = function (token: Tokens.Blockquote) {
    let html = defaultRenderer.blockquote.call(this, token);
    html = html.replace(
      /<blockquote[^>]*>([\s\S]*?)<\/blockquote>/i,
      (m: string, inner: string) => {
        inner = inner.replace(/<p[^>]*>/gi, "").replace(/<\/p>/gi, "<br>");
        inner = inner.replace(/(<br>)+$/i, "");
        return (
          `<blockquote style="${blockquoteStyle}">` +
          template.blockquoteInnerBefore +
          inner +
          template.blockquoteInnerAfter +
          `</blockquote>`
        );
      },
    );
    return html;
  };

  // 列表最外层
  customRenderer.list = function (token: Tokens.List) {
    const ordered = token.ordered;
    const start = token.start || 1;
    
    const itemsHtml = token.items.map((item, index) => {
      // Use block parser for list item content
      let inner = this.parser.parse(item.tokens);
      // Clean up paragraph margins for the first element
      inner = inner.replace(/^<p style="([^"]*)"/i, (m: string, s: string) => {
        const cleanS = s.replace(/margin\s*:\s*[^;]+;?/gi, "margin: 0;");
        return `<p style="${cleanS}"`;
      });
      inner = inner.replace(/<input disabled="" type="checkbox">/gi, "");

      let icon = "";
      if (item.task) {
        icon = item.checked
          ? `<section style="display: inline-block; width: 14px; height: 14px; line-height: 14px; text-align: center; border: 2px solid #000000; background-color: #10b981; color: #000000; font-size: 10px; font-weight: bold; margin-top: 4px; box-sizing: border-box;">√</section>`
          : `<section style="display: inline-block; width: 14px; height: 14px; border: 2px solid #000000; background-color: #ffffff; margin-top: 4px; box-sizing: border-box; overflow: hidden;"><br/></section>`;
      } else if (ordered) {
        const num = start + index;
        if (template.category === "neo-brutalism") {
          icon = `<section style="display: inline-block; width: 20px; height: 20px; line-height: 20px; text-align: center; background-color: ${template.themeColor}; color: #000000; border: 2px solid #000000; font-size: 12px; font-weight: 900; box-shadow: 2px 2px 0px #000000; box-sizing: border-box; overflow: hidden;">${num}</section>`;
        } else {
          icon = `<section style="display: inline-block; color: ${template.themeColor}; font-weight: bold; font-family: sans-serif;">${num}.</section>`;
        }
      } else {
        icon = template.listIcon;
      }

      const iconWidth = template.category === "neo-brutalism" ? 32 : 24;

      // Extremely robust float layout for WeChat Official Accounts
      return `<section style="display: block; clear: both; margin-bottom: 12px;">
        <section style="float: left; width: ${iconWidth}px; box-sizing: border-box;">
          <section style="text-align: left;">${icon}</section>
        </section>
        <section style="margin-left: ${iconWidth}px; box-sizing: border-box; overflow: hidden;">
          <section style="display: block; overflow: hidden;">
            ${inner}
          </section>
        </section>
        <section style="display: block; clear: both; height: 0; line-height: 0; font-size: 0; overflow: hidden;"></section>
      </section>`;
    }).join("");

    return `<section style="${bgFallback(template.listStyle)} padding: 0; margin: 20px 0 16px 0;">${itemsHtml}</section>`;
  };

  customRenderer.strong = function (token: Tokens.Strong) {
    const html = defaultRenderer.strong.call(this, token);
    return html.replace(/^<strong[^>]*>/i, `<strong style="${template.strongStyle}">`);
  };

  customRenderer.em = function (token: Tokens.Em) {
    const html = defaultRenderer.em.call(this, token);
    return html.replace(/^<em[^>]*>/i, `<em style="${template.emStyle}">`);
  };

  customRenderer.codespan = function (token: Tokens.Codespan) {
    const html = defaultRenderer.codespan.call(this, token);
    const inlineCodeStyle = `background-color: #f1f5f9; color: ${template.themeColor}; padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em; margin: 0 2px;`;
    return html.replace(/^<code[^>]*>/i, `<code style="${inlineCodeStyle}">`);
  };

  customRenderer.code = function (token: Tokens.Code) {
    const rawCode = token.text;
    const escapedCode = rawCode
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

    const macHeader = `<svg width="42" height="12" viewBox="0 0 42 12" xmlns="http://www.w3.org/2000/svg"><circle cx="6" cy="6" r="6" fill="#ff5f56"/><circle cx="21" cy="6" r="6" fill="#ffbd2e"/><circle cx="36" cy="6" r="6" fill="#27c93f"/></svg>`;
    const headerBg =
      template.codeHeaderStyle.match(/background-color:\s*([^;]+)/i)?.[1] || "#e2e8f0";
    const headerPadding = template.codeHeaderStyle.match(/padding:\s*([^;]+)/i)?.[1] || "8px 12px";
    const headerBorder = template.codeHeaderStyle.match(/border-bottom:\s*([^;]+)/i)?.[1] || "";
    const headerBorderStyle = headerBorder ? `border-bottom: ${headerBorder};` : "";
    return `<section style="${template.codeContainerStyle}"><section style="background-color: ${headerBg}; padding: ${headerPadding}; ${headerBorderStyle}">${macHeader}</section><section style="padding: 0; margin: 0;"><pre style="${template.codeBlockStyle}"><code>${escapedCode}</code></pre></section></section>`;
  };

  customRenderer.image = function (token: Tokens.Image) {
    const html = defaultRenderer.image.call(this, token);
    return html.replace(/^<img([^>]*)>/i, `<img$1 style="${imageStyle}" />`);
  };

  customRenderer.hr = function () {
    return `<hr style="${template.hrStyle}" />`;
  };

  customRenderer.link = function (token: Tokens.Link) {
    const html = defaultRenderer.link.call(this, token);
    return html.replace(/^<a([^>]*)>/i, `<a$1 style="${template.linkStyle}">`);
  };

  customRenderer.table = function (token: Tokens.Table) {
    const html = defaultRenderer.table.call(this, token);
    const tableStyle = ensureStyleValue(
      template.tableStyle,
      "background-color",
      template.backgroundColor,
    );
    return html.replace(
      /^<table[^>]*>/i,
      `<table cellpadding="0" cellspacing="0" border="0" style="${tableStyle}">`,
    );
  };

  customRenderer.tablerow = function (token: Tokens.TableRow) {
    return defaultRenderer.tablerow.call(this, token);
  };

  customRenderer.tablecell = function (token: Tokens.TableCell) {
    const html = defaultRenderer.tablecell.call(this, token);
    const isHeader = token.header;
    let style = isHeader ? template.thStyle : template.tdStyle;
    const fallbackCellBackground = isHeader
      ? getStyleValue(template.thStyle, "background-color") || template.backgroundColor
      : getStyleValue(template.tdStyle, "background-color") || template.backgroundColor;

    style = ensureStyleValue(style, "background-color", fallbackCellBackground);

    if (token.align) {
      style = style.trim().endsWith(";")
        ? `${style} text-align: ${token.align};`
        : `${style}; text-align: ${token.align};`;
    }

    const tag = isHeader ? "th" : "td";
    const bgColor = getStyleValue(style, "background-color") || template.backgroundColor;

    return html.replace(
      new RegExp(`^<${tag}[^>]*>`, "i"),
      `<${tag} bgcolor="${bgColor}" style="${style}">`,
    );
  };

  customRenderer.del = function (token: Tokens.Del) {
    const html = defaultRenderer.del.call(this, token);
    return html.replace(/^<del[^>]*>/i, `<del style="${template.delStyle}">`);
  };

  customRenderer.checkbox = function (token: Tokens.Checkbox) {
    return token.checked
      ? '<span style="display: inline-block; width: 12px; height: 12px; line-height: 12px; text-align: center; border: 1px solid #10b981; color: #10b981; font-size: 10px; font-weight: bold; margin-right: 4px;">x</span>'
      : '<span style="display: inline-block; width: 12px; height: 12px; border: 1px solid #9ca3af; margin-right: 4px;"></span>';
  };

  marked.setOptions({
    renderer: customRenderer,
    breaks: true,
    gfm: true,
  });

  const innerHtml = marked.parse(markdownText) as string;
  const articleContainerStyle = ensureStyleValue(
    ensureStyleValue(
      `${template.containerStyle} font-size: ${formatTweaks.fontSize}px; line-height: ${formatTweaks.lineHeight}; letter-spacing: ${formatTweaks.letterSpacing}px; color: ${template.baseStyle.color}; font-family: ${template.baseStyle.fontFamily}; word-wrap: break-word; word-break: break-all; box-sizing: border-box;`,
      "padding",
      `${formatTweaks.pagePaddingTop}px ${formatTweaks.pagePaddingRight}px ${formatTweaks.pagePaddingBottom}px ${formatTweaks.pagePaddingLeft}px`,
    ),
    "background-color",
    template.backgroundColor,
  );

  return `<section style="width: 100%; max-width: 100%; box-sizing: border-box; background-color: ${template.backgroundColor};"><section style="${articleContainerStyle}">${innerHtml}</section></section>`;
}
