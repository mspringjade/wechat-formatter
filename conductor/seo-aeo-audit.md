# SEO and AEO Optimization Plan

Enhance TypeZen's visibility in search engines and AI answer engines by adding visible content, refining structured data, and improving technical SEO.

## Objective
- Improve SEO ranking for keywords like "公众号排版", "Markdown 转微信".
- Increase citation probability in AI answer engines (ChatGPT, Gemini, etc.) by providing high-quality, "answer-first" visible content and matching JSON-LD.
- Fix technical SEO issues (image dimensions).

## Changes

### 1. Technical SEO & Image Optimization
- **File**: `app/_components/app-header.tsx`
  - Add `width={40}` and `height={40}` to the logo `img` tag to improve LCP and prevent layout shifts.
- **File**: `app/_components/app-footer.tsx`
  - Ensure the footer is semantic and contains appropriate keywords.

### 2. JSON-LD Refinement
- **File**: `app/json-ld.tsx`
  - Refine `WebApplication` and `SoftwareApplication` definitions.
  - Add a `HowTo` schema to explain how to use the tool, which is a strong signal for AI engines.
  - Expand `FAQPage` to cover more potential user queries.

### 3. AEO: Visible "About & FAQ" Section
- **File**: `app/_components/about-section.tsx` (New Component)
  - Create a section containing:
    - **Introduction**: 40-60 word "answer-first" description of TypeZen.
    - **Key Features**: Bulleted list of core functionalities.
    - **FAQ**: Visible FAQ section matching the JSON-LD content exactly, using semantic `h2` and `h3` tags.
    - **How It Works**: Brief steps for using the tool.
  - This section will be styled to match the "Neo-Brutalism" theme of the project.

### 4. Layout Adjustment for SEO Content
- **File**: `app/page.tsx`
  - Change the `main` container from `h-screen overflow-hidden` to `min-h-screen flex flex-col`.
  - Wrap the main "Editor App" area in a container that fills the viewport (`h-screen`) and maintains its `overflow-hidden` behavior.
  - Place the `AboutSection` below the `AppFooter`.
  - This allows the app to feel like a full-screen tool while providing SEO-rich content below the fold.

### 5. Robots & Sitemap (Optional)
- **File**: `app/robots.ts`
  - Add `Disallow: /api/` and `Disallow: /_next/` (already present, but ensure consistency).

## Verification & Testing
- Run `npm run build` to ensure no build errors.
- Inspect the rendered HTML to verify `h1`, `h2`, `h3` hierarchy.
- Use Google Rich Results Test (locally or via deployment) to validate JSON-LD.
- Check the page layout on mobile to ensure the editor remains functional and the SEO section is properly placed.
