import { marked } from 'marked'

export interface TemplateConfig {
  id: string
  name: string
  desc: string
  category: string
  themeColor: string
  backgroundColor: string
  baseStyle: {
    color: string
    fontFamily: string
  }
  containerStyle: string
  h1Style: string
  h2Style: string
  h3Style: string
  pStyle: string
  blockquoteStyle: string
  blockquoteInnerBefore: string
  blockquoteInnerAfter: string
  listStyle: string
  listItemStyle: string
  listIcon: string
  strongStyle: string
  emStyle: string
  codeContainerStyle: string
  codeHeaderStyle: string
  codeBlockStyle: string
  imgStyle: string
  hrStyle: string
  linkStyle: string
  tableStyle: string
  thStyle: string
  tdStyle: string
  delStyle: string
}

const colorPalettes = {
  minimalist: ['#3b82f6', '#10b981', '#6366f1', '#f59e0b', '#ef4444', '#8b5cf6', '#14b8a6', '#f43f5e', '#64748b', '#000000'],
  business: ['#1e40af', '#0f766e', '#4338ca', '#b45309', '#be123c', '#6d28d9', '#0e7490', '#9f1239', '#334155', '#111827'],
  literary: ['#059669', '#d97706', '#be185d', '#7c3aed', '#0284c7', '#ea580c', '#4d7c0f', '#c026d3', '#0891b2', '#86198f'],
  tech: ['#2563eb', '#0ea5e9', '#06b6d4', '#10b981', '#8b5cf6', '#a855f7', '#d946ef', '#f43f5e', '#6366f1', '#14b8a6'],
  festive: ['#ef4444', '#dc2626', '#b91c1c', '#f59e0b', '#d97706', '#ea580c', '#c2410c', '#be123c', '#9f1239', '#fbbf24']
}

const names = ['经典', '雅致', '先锋', '深邃', '晨光', '星穹', '暖阳', '暮色', '清泉', '破晓']

const categoriesList = [
  { id: 'minimalist', name: '极简风' },
  { id: 'business', name: '商务风' },
  { id: 'literary', name: '文艺风' },
  { id: 'tech', name: '科技风' },
  { id: 'festive', name: '节庆风' }
]

function generateTemplates(): TemplateConfig[] {
  const result: TemplateConfig[] = []
  
  // 1. 极简风 (Minimalist) - 圆点、清爽边框
  colorPalettes.minimalist.forEach((color, i) => {
    result.push({
      id: `minimalist-${i}`,
      name: names[i],
      desc: '标准的点与线排版，适合日常阅读',
      category: 'minimalist',
      themeColor: color,
      backgroundColor: '#ffffff',
      baseStyle: { color: '#374151', fontFamily: 'system-ui, -apple-system, sans-serif' },
      containerStyle: 'padding: 16px; background-color: #ffffff;',
      h1Style: `font-size: 1.4em; font-weight: bold; text-align: center; margin: 24px 0 16px; color: ${color}; border-bottom: 1px solid ${color}; padding-bottom: 8px; line-height: 1.4;`,
      h2Style: `font-size: 1.25em; font-weight: bold; margin: 24px 0 16px; color: #111827; padding-left: 12px; border-left: 4px solid ${color}; line-height: 1.4;`,
      h3Style: `font-size: 1.1em; font-weight: bold; margin: 16px 0 12px; color: #374151; line-height: 1.4;`,
      pStyle: 'margin: 0 0 16px 0; line-height: 1.8; text-indent: 0;',
      blockquoteStyle: `border-left: 3px solid ${color}; margin: 20px 0; padding: 12px 16px; color: #4b5563; background-color: #f3f4f6;`,
      blockquoteInnerBefore: '',
      blockquoteInnerAfter: '',
      listStyle: 'margin: 0 0 16px 0; padding: 0; list-style-type: none;',
      listItemStyle: 'margin: 0 0 8px 0; line-height: 1.6;',
      listIcon: `<span style="color: ${color}; margin-right: 8px; font-weight: bold;">•</span>`,
      strongStyle: `font-weight: bold; color: ${color};`,
      emStyle: 'font-style: italic; color: #4b5563;',
      codeContainerStyle: `margin: 20px 0; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #e5e7eb; overflow: hidden; background-color: #f8fafc;`,
      codeHeaderStyle: `background-color: #e2e8f0; padding: 8px 12px; font-size: 0; line-height: 1;`,
      codeBlockStyle: `margin: 0; padding: 16px; overflow-x: auto; color: #334155; font-size: 13px; font-family: monospace; line-height: 1.6; white-space: pre-wrap; word-break: break-all;`,
      imgStyle: 'max-width: 100%; border-radius: 8px; display: block; margin: 20px auto;',
      hrStyle: `border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;`,
      linkStyle: `color: ${color}; text-decoration: none; border-bottom: 1px dashed ${color};`,
      tableStyle: 'width: 100%; max-width: 100%; border-collapse: collapse; margin: 24px 0; font-size: 0.95em; table-layout: fixed; word-wrap: break-word;',
      thStyle: `border-bottom: 2px solid ${color}; padding: 12px 8px; text-align: left; color: #111827; font-weight: bold; margin: 0;`,
      tdStyle: 'border-bottom: 1px solid #f3f4f6; padding: 12px 8px; color: #4b5563; margin: 0; word-wrap: break-word; word-break: break-all;',
      delStyle: 'text-decoration: line-through; color: #9ca3af;'
    })
  })

  // 2. 商务风 (Business) - 方块、实底、专业
  colorPalettes.business.forEach((color, i) => {
    result.push({
      id: `business-${i}`,
      name: names[i],
      desc: '方块标识符，适合严谨的行业报告',
      category: 'business',
      themeColor: color,
      backgroundColor: '#ffffff',
      baseStyle: { color: '#334155', fontFamily: 'system-ui, -apple-system, sans-serif' },
      containerStyle: 'padding: 20px; background-color: #ffffff;',
      h1Style: `font-size: 1.5em; font-weight: 800; text-align: left; margin: 24px 0 24px 0; color: ${color}; border-bottom: 3px solid ${color}; line-height: 1.4; padding-bottom: 8px;`,
      h2Style: `font-size: 1.2em; font-weight: 700; background-color: ${color}; color: #ffffff; display: inline-block; padding: 6px 16px; margin: 24px 0 16px 0; border-radius: 2px; line-height: 1.4;`,
      h3Style: `font-size: 1.1em; font-weight: bold; margin: 16px 0 12px 0; color: ${color}; border-bottom: 1px dashed ${color}80; padding-bottom: 4px; line-height: 1.4;`,
      pStyle: 'margin: 0 0 16px 0; line-height: 1.8; text-indent: 2em;',
      blockquoteStyle: `border-left: 6px solid ${color}; margin: 24px 0; padding: 16px; color: #475569; background-color: #f8fafc; font-weight: 500;`,
      blockquoteInnerBefore: '',
      blockquoteInnerAfter: '',
      listStyle: 'margin: 0 0 16px 0; padding: 0; list-style-type: none;',
      listItemStyle: 'margin: 0 0 10px 0; line-height: 1.7;',
      listIcon: `<span style="color: ${color}; margin-right: 8px; font-size: 12px;">■</span>`,
      strongStyle: `font-weight: bold; color: ${color}; background-color: ${color}15; padding: 0 2px;`,
      emStyle: 'font-style: italic; color: #64748b;',
      codeContainerStyle: `margin: 20px 0; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border: 1px solid #475569; overflow: hidden; background-color: #1e293b;`,
      codeHeaderStyle: `background-color: #334155; padding: 8px 12px; font-size: 0; line-height: 1; border-bottom: 1px solid #0f172a;`,
      codeBlockStyle: `margin: 0; padding: 16px; overflow-x: auto; color: #f8fafc; font-size: 13px; font-family: monospace; line-height: 1.6; white-space: pre-wrap; word-break: break-all;`,
      imgStyle: 'max-width: 100%; border: 1px solid #e2e8f0; padding: 4px; display: block; margin: 20px auto;',
      hrStyle: `border: none; border-top: 2px dashed ${color}80; margin: 32px 0;`,
      linkStyle: `color: ${color}; font-weight: 500; text-decoration: none; border-bottom: 1px solid ${color};`,
      tableStyle: 'width: 100%; max-width: 100%; border-collapse: collapse; margin: 24px 0; border: 1px solid #cbd5e1; font-size: 0.9em; table-layout: fixed; word-wrap: break-word;',
      thStyle: `border: 1px solid #cbd5e1; padding: 10px; background-color: #f8fafc; color: ${color}; font-weight: bold; margin: 0;`,
      tdStyle: `border: 1px solid #cbd5e1; padding: 10px; color: #334155; margin: 0; word-wrap: break-word; word-break: break-all;`,
      delStyle: 'text-decoration: line-through; color: #cbd5e1;'
    })
  })

  // 3. 文艺风 (Literary) - 花朵、括号、留白
  colorPalettes.literary.forEach((color, i) => {
    result.push({
      id: `literary-${i}`,
      name: names[i],
      desc: '配有小花图标，给文字呼吸喘息的空间',
      category: 'literary',
      themeColor: color,
      backgroundColor: '#fdfcfb',
      baseStyle: { color: '#4b5563', fontFamily: '"Noto Serif SC", serif, system-ui' },
      containerStyle: `padding: 24px 16px; background-color: #fdfcfb;`,
      h1Style: `font-size: 1.35em; font-weight: normal; text-align: center; margin: 30px 0; color: ${color}; letter-spacing: 4px; line-height: 1.4;`,
      h2Style: `font-size: 1.15em; font-weight: normal; text-align: center; margin: 30px 0 20px; color: ${color}; padding: 8px 0; line-height: 1.4; border-top: 1px solid ${color}40; border-bottom: 1px solid ${color}40; letter-spacing: 2px; display: block;`,
      h3Style: `font-size: 1.05em; font-weight: bold; text-align: center; margin: 20px 0 16px 0; color: #374151; line-height: 1.4;`,
      pStyle: 'margin: 0 0 20px 0; line-height: 2.0; letter-spacing: 1px;',
      blockquoteStyle: `margin: 32px 0; padding: 20px; color: ${color}; text-align: center; font-style: italic; font-size: 0.95em; border-radius: 8px; background-color: ${color}08;`,
      blockquoteInnerBefore: ``,
      blockquoteInnerAfter: ``,
      listStyle: 'margin: 0 0 20px 0; padding: 0; list-style-type: none;',
      listItemStyle: `margin: 0 0 12px 0; line-height: 1.8;`,
      listIcon: `<span style="color: ${color}; margin-right: 8px; font-size: 14px;">✿</span>`,
      strongStyle: `font-weight: normal; color: #1f2937; border-bottom: 2px solid ${color}80;`,
      emStyle: `font-style: italic; color: ${color};`,
      codeContainerStyle: `margin: 24px 0; border-radius: 12px; box-shadow: 0 8px 20px rgba(0,0,0,0.03); border: 1px solid ${color}30; overflow: hidden; background-color: #fdfaf6;`,
      codeHeaderStyle: `background-color: ${color}10; padding: 8px 12px; font-size: 0; line-height: 1; border-bottom: 1px solid ${color}20;`,
      codeBlockStyle: `margin: 0; padding: 16px; overflow-x: auto; color: #374151; font-size: 13px; font-family: monospace; white-space: pre-wrap; word-break: break-all; line-height: 1.6;`,
      imgStyle: 'max-width: 100%; border-radius: 12px; box-shadow: 0 8px 20px rgba(0,0,0,0.05); display: block; margin: 30px auto;',
      hrStyle: `border: none; border-top: 1px solid ${color}40; margin: 32px auto; width: 60%;`,
      linkStyle: `color: ${color}; text-decoration: none; border-bottom: 1px solid ${color}; padding-bottom: 1px;`,
      tableStyle: 'width: 100%; max-width: 100%; border-collapse: collapse; margin: 24px 0; font-size: 0.95em; table-layout: fixed; word-wrap: break-word;',
      thStyle: `border-bottom: 1px solid ${color}; padding: 12px; color: ${color}; font-weight: normal; letter-spacing: 1px; text-align: left; margin: 0;`,
      tdStyle: `border-bottom: 1px dashed ${color}40; padding: 12px; color: #4b5563; margin: 0; word-wrap: break-word; word-break: break-all;`,
      delStyle: 'text-decoration: line-through; opacity: 0.5;'
    })
  })

  // 4. 科技风 (Tech) - 尖角、极客终端
  colorPalettes.tech.forEach((color, i) => {
    const neon = color === '#10b981' ? '#3b82f6' : '#10b981'
    result.push({
      id: `tech-${i}`,
      name: names[i],
      desc: '打破常规的终端 /> 标识设计',
      category: 'tech',
      themeColor: color,
      backgroundColor: '#0f172a',
      baseStyle: { color: '#e5e7eb', fontFamily: '"Space Grotesk", sans-serif' },
      containerStyle: `padding: 20px; background-color: #0f172a;`,
      h1Style: `font-size: 1.6em; font-weight: bold; text-align: left; margin: 20px 0 32px 0; color: ${neon}; text-transform: uppercase; letter-spacing: 2px; line-height: 1.4; border-bottom: 2px solid ${color}50; padding-bottom: 12px;`,
      h2Style: `font-size: 1.25em; font-weight: bold; margin: 30px 0 20px 0; color: #ffffff; border-left: 6px solid ${color}; padding-left: 14px; background-color: #1e293b; display: block; line-height: 1.4; padding-top: 6px; padding-bottom: 6px;`,
      h3Style: `font-size: 1.1em; font-weight: bold; margin: 20px 0 16px 0; color: ${color}; line-height: 1.4;`,
      pStyle: 'margin: 0 0 16px 0; line-height: 1.8; color: #cbd5e1;',
      blockquoteStyle: `border: 1px solid ${color}; margin: 24px 0; padding: 16px; color: #94a3b8; background-color: #1e293b; border-radius: 4px;`,
      blockquoteInnerBefore: `<span style="color: ${neon}; margin-right: 8px;">></span>`,
      blockquoteInnerAfter: ``,
      listStyle: 'margin: 0 0 16px 0; padding: 0; list-style-type: none;',
      listItemStyle: `margin: 0 0 10px 0; line-height: 1.7;`,
      listIcon: `<span style="color: ${neon}; margin-right: 8px; font-weight: bold;">/></span>`,
      strongStyle: `font-weight: bold; color: #ffffff; border-bottom: 1px solid ${color};`,
      emStyle: `color: ${color}; font-style: normal; text-decoration: underline; text-decoration-color: ${color};`,
      codeContainerStyle: `margin: 24px 0; border-radius: 6px; border: 1px solid #334155; overflow: hidden; background-color: #000000;`,
      codeHeaderStyle: `background-color: #1e293b; padding: 8px 12px; font-size: 0; line-height: 1; border-bottom: 1px solid #334155;`,
      codeBlockStyle: `margin: 0; padding: 16px; overflow-x: auto; color: ${neon}; font-size: 13px; font-family: monospace; white-space: pre-wrap; word-break: break-all; line-height: 1.5;`,
      imgStyle: `max-width: 100%; border: 2px solid #334155; border-radius: 8px; display: block; margin: 24px auto;`,
      hrStyle: `border: none; border-top: 1px solid #334155; margin: 32px 0;`,
      linkStyle: `color: ${neon}; text-decoration: underline; text-decoration-style: dashed;`,
      tableStyle: `width: 100%; max-width: 100%; border-collapse: collapse; margin: 24px 0; border: 1px solid #334155; font-size: 0.9em; table-layout: fixed; word-wrap: break-word;`,
      thStyle: `border: 1px solid #334155; padding: 10px; background-color: #1e293b; color: #ffffff; text-align: left; margin: 0;`,
      tdStyle: `border: 1px solid #334155; padding: 10px; color: #cbd5e1; margin: 0; word-wrap: break-word; word-break: break-all;`,
      delStyle: `text-decoration: line-through; color: #475569;`
    })
  })

  // 5. 节庆风 (Festive) - 星星、双线元素
  colorPalettes.festive.forEach((color, i) => {
    result.push({
      id: `festive-${i}`,
      name: names[i],
      desc: '星星标识与浓烈色彩传递节日喜悦',
      category: 'festive',
      themeColor: color,
      backgroundColor: '#fffbeb',
      baseStyle: { color: '#451a03', fontFamily: 'system-ui, sans-serif' },
      containerStyle: `padding: 24px; background-color: #fffbeb; border: 4px solid ${color};`,
      h1Style: `font-size: 1.5em; font-weight: bold; text-align: center; margin: 10px 0 30px 0; color: #ffffff; background-color: ${color}; padding: 12px; border-radius: 8px; letter-spacing: 2px; line-height: 1.4;`,
      h2Style: `font-size: 1.2em; font-weight: bold; text-align: center; background-color: #fef3c7; color: ${color}; border: 2px solid ${color}; margin: 24px auto 20px auto; padding: 8px 24px; border-radius: 20px; display: inline-block; line-height: 1.4;`,
      h3Style: `font-size: 1.1em; font-weight: bold; margin: 16px 0 16px 0; color: ${color}; text-align: center; line-height: 1.4;`,
      pStyle: 'margin: 0 0 16px 0; line-height: 1.8; text-indent: 2em; color: #78350f;',
      blockquoteStyle: `border: 2px dashed ${color}; border-radius: 8px; margin: 24px 0; padding: 16px; color: #92400e; background-color: #fef3c7; text-align: center; font-weight: 500;`,
      blockquoteInnerBefore: ``,
      blockquoteInnerAfter: ``,
      listStyle: 'margin: 0 0 16px 0; padding: 0; color: #78350f; list-style-type: none;',
      listItemStyle: 'margin: 0 0 10px 0; line-height: 1.7;',
      listIcon: `<span style="color: #ea580c; margin-right: 8px; font-size: 14px;">★</span>`,
      strongStyle: `font-weight: bold; color: ${color};`,
      emStyle: `font-style: italic; color: #b45309;`,
      codeContainerStyle: `margin: 24px 0; border-radius: 8px; border: 2px dashed ${color}; overflow: hidden; background-color: #fef3c7;`,
      codeHeaderStyle: `background-color: #fcd34d; padding: 8px 12px; font-size: 0; line-height: 1; border-bottom: 2px solid ${color}20;`,
      codeBlockStyle: `margin: 0; padding: 16px; overflow-x: auto; color: #9f1239; font-size: 13px; font-family: monospace; white-space: pre-wrap; word-break: break-all; line-height: 1.5;`,
      imgStyle: `max-width: 100%; border: 4px solid #fef3c7; border-radius: 12px; display: block; margin: 20px auto;`,
      hrStyle: `border: none; border-top: 2px dashed ${color}; margin: 32px 0;`,
      linkStyle: `color: #9f1239; font-weight: bold; text-decoration: none; border-bottom: 2px solid #fcd34d;`,
      tableStyle: `width: 100%; max-width: 100%; border-collapse: collapse; margin: 24px 0; border: 2px solid ${color}; font-size: 0.9em; table-layout: fixed; word-wrap: break-word;`,
      thStyle: `border: 1px solid ${color}; padding: 10px; background-color: #fef3c7; color: ${color}; font-weight: bold; text-align: center; margin: 0;`,
      tdStyle: `border: 1px solid ${color}; padding: 10px; color: #92400e; margin: 0; word-wrap: break-word; word-break: break-all;`,
      delStyle: `text-decoration: line-through; color: #b45309;`
    })
  })

  return result
}

export const allTemplates = generateTemplates()
export const groupedTemplates = categoriesList.map(cat => ({
  ...cat,
  templates: allTemplates.filter(t => t.category === cat.id)
}))

export function renderArticle(markdownText: string, template: TemplateConfig, fontSize: number, lineHeight: number): string {
  const customRenderer: any = new marked.Renderer()
  const defaultRenderer: any = new marked.Renderer()

  customRenderer.heading = function (token: any) {
    let html = defaultRenderer.heading.call(this, token)
    if (token.depth === 1) return html.replace(/^<h1[^>]*>/i, `<h1 style="${template.h1Style}">`)
    if (token.depth === 2) return html.replace(/^<h2[^>]*>([\s\S]*?)<\/h2>/i, (m: string, content: string) => `<h2 style="${template.h2Style}">${content}</h2>`)
    if (token.depth === 3) return html.replace(/^<h3[^>]*>/i, `<h3 style="${template.h3Style}">`)
    return html.replace(/^<h\d[^>]*>/i, `<h${token.depth} style="${template.h3Style}">`)
  }

  customRenderer.paragraph = function (token: any) {
    let html = defaultRenderer.paragraph.call(this, token)
    return html.replace(/^<p[^>]*>/i, `<p style="${template.pStyle}">`)
  }

  customRenderer.blockquote = function (token: any) {
    let html = defaultRenderer.blockquote.call(this, token)
    html = html.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/i, (m: string, inner: string) => {
        inner = inner.replace(/<p[^>]*>/gi, '').replace(/<\/p>/gi, '<br>')
        inner = inner.replace(/(<br>)+$/i, '')
        return `<blockquote style="${template.blockquoteStyle}">` + template.blockquoteInnerBefore + inner + template.blockquoteInnerAfter + `</blockquote>`
    })
    return html
  }

  // 列表最外层
  customRenderer.list = function (token: any) {
    let html = defaultRenderer.list.call(this, token)
    const tag = token.ordered ? 'ol' : 'ul'
    return html.replace(new RegExp(`^<${tag}[^>]*>`, 'i'), `<${tag} style="${template.listStyle}">`)
  }

  customRenderer.listitem = function (token: any) {
    let html = defaultRenderer.listitem.call(this, token)
    html = html.replace(/<li[^>]*>([\s\S]*?)<\/li>/i, (m: string, inner: string) => {
      inner = inner.replace(/<input disabled="" type="checkbox">/gi, '')
      inner = inner.replace(/^<p[^>]*>/i, '').replace(/<\/p>$/i, '')
      
      const iconHtml = !token.task ? template.listIcon : ''
      // For WeChat: highly compatible flex-like layout using table or inline-block
      return `<li style="${template.listItemStyle}">
        <section style="display: flex; align-items: flex-start; justify-content: flex-start;">
          ${iconHtml}
          <section style="flex: 1;">${inner}</section>
        </section>
      </li>`
    })
    return html
  }

  customRenderer.strong = function (token: any) {
    const html = defaultRenderer.strong.call(this, token)
    return html.replace(/^<strong[^>]*>/i, `<strong style="${template.strongStyle}">`)
  }

  customRenderer.em = function (token: any) {
    const html = defaultRenderer.em.call(this, token)
    return html.replace(/^<em[^>]*>/i, `<em style="${template.emStyle}">`)
  }

  customRenderer.codespan = function (token: any) {
    let html = defaultRenderer.codespan.call(this, token)
    const inlineCodeStyle = `background-color: #f1f5f9; color: ${template.themeColor}; padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em; margin: 0 2px;`
    return html.replace(/^<code[^>]*>/i, `<code style="${inlineCodeStyle}">`)
  }

  customRenderer.code = function (token: any) {
    const rawCode = token.text
    const escapedCode = rawCode.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
    
    const macHeader = `
      <section style="${template.codeHeaderStyle}">
        <span style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background-color: #ff5f56; margin-right: 6px;"></span>
        <span style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background-color: #ffbd2e; margin-right: 6px;"></span>
        <span style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background-color: #27c93f;"></span>
      </section>
    `
    return `<section style="${template.codeContainerStyle}">${macHeader}<section style="padding: 0; margin: 0;"><pre style="${template.codeBlockStyle}"><code>${escapedCode}</code></pre></section></section>`
  }

  customRenderer.image = function (token: any) {
    const html = defaultRenderer.image.call(this, token)
    return html.replace(/^<img([^>]*)>/i, `<img$1 style="${template.imgStyle}" />`)
  }

  customRenderer.hr = function (token: any) {
    return `<hr style="${template.hrStyle}" />`
  }

  customRenderer.link = function (token: any) {
    const html = defaultRenderer.link.call(this, token)
    return html.replace(/^<a([^>]*)>/i, `<a$1 style="${template.linkStyle}">`)
  }

  customRenderer.table = function (token: any) {
    const html = defaultRenderer.table.call(this, token)
    return html.replace(/^<table[^>]*>/i, `<table style="${template.tableStyle}">`)
  }

  customRenderer.tablerow = function (token: any) {
    return defaultRenderer.tablerow.call(this, token)
  }

  customRenderer.tablecell = function (token: any) {
    const html = defaultRenderer.tablecell.call(this, token)
    const isHeader = token.header
    let style = isHeader ? template.thStyle : template.tdStyle
    if (token.align) {
       style = style.trim().endsWith(';') ? `${style} text-align: ${token.align};` : `${style}; text-align: ${token.align};`
    }
    const tag = isHeader ? 'th' : 'td'
    return html.replace(new RegExp(`^<${tag}[^>]*>`, 'i'), `<${tag} style="${style}">`)
  }

  customRenderer.del = function (token: any) {
    const html = defaultRenderer.del.call(this, token)
    return html.replace(/^<del[^>]*>/i, `<del style="${template.delStyle}">`)
  }

  customRenderer.checkbox = function (token: any) {
    return token.checked ? 
      '<span style="color: #10b981; font-weight: bold; margin-right: 4px;">☑</span>' : 
      '<span style="color: #9ca3af; margin-right: 4px;">☐</span>'
  }

  marked.setOptions({ renderer: customRenderer as any, breaks: true, gfm: true })

  const innerHtml = marked.parse(markdownText) as string

  return `<table style="width: 100%; max-width: 100%; border-collapse: collapse; table-layout: fixed; background-color: ${template.backgroundColor};"><tbody><tr><td style="${template.containerStyle} font-size: ${fontSize}px; line-height: ${lineHeight}; color: ${template.baseStyle.color}; font-family: ${template.baseStyle.fontFamily}; word-wrap: break-word; word-break: break-all; box-sizing: border-box;">${innerHtml}</td></tr></tbody></table>`
}
