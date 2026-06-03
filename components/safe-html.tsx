"use client";

import DOMPurify from "isomorphic-dompurify";
import parse, { HTMLReactParserOptions, Element, domToReact, DOMNode } from "html-react-parser";
import { ReactNode } from "react";
import InArticleAd from "@/app/components/InArticleAd";

interface SafeHtmlProps {
  html: string;
  className?: string;
  insertAds?: boolean;
}

// DOMPurify 配置：允许 <a> 标签及其属性
const sanitizeConfig = {
  ALLOWED_TAGS: [
    "p", "br", "hr",
    "h1", "h2", "h3", "h4", "h5", "h6",
    "strong", "b", "em", "i", "u", "strike", "del", "s",
    "a", "img",
    "ul", "ol", "li",
    "blockquote", "code", "pre",
    "table", "thead", "tbody", "tr", "th", "td",
    "div", "span", "figure", "figcaption"
  ],
  ALLOWED_ATTR: [
    // 链接属性
    "href", "target", "rel", "title",
    // 图片属性
    "src", "alt", "width", "height", "loading",
    // 通用属性
    "class", "id", "style"
  ],
  // 允许 data URI 的图片
  ALLOW_DATA_ATTR: false,
  // 允许外部链接
  ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp|xxx):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
};

// 创建 parser 配置
// wrapTables=true 时拦截 table 并包上滚动容器；
// wrapTables=false 时递归渲染表格内部，避免死循环。
const createParserOptions = (wrapTables: boolean, insertAds: boolean): HTMLReactParserOptions => {
  let pCount = 0;

  const options: HTMLReactParserOptions = {
    replace: (domNode) => {
      if (domNode instanceof Element && domNode.name === "a") {
        const { href, target, rel, title, class: className } = domNode.attribs || {};
        
        // 处理外部链接：如果没有 rel，添加安全属性
        const isExternal = href?.startsWith("http://") || href?.startsWith("https://");
        const finalRel = rel || (isExternal ? "noopener noreferrer" : undefined);
        const finalTarget = target || (isExternal ? "_blank" : undefined);

        return (
          <a
            href={href}
            target={finalTarget}
            rel={finalRel}
            title={title}
            className={className || "text-red-600 hover:text-red-700 hover:underline transition-colors"}
          >
            {domToReact(domNode.children as DOMNode[], createParserOptions(wrapTables, false)) as ReactNode}
          </a>
        );
      }

      // 处理图片：添加懒加载和样式
      if (domNode instanceof Element && domNode.name === "img") {
        const { src, alt, width, height, class: className } = domNode.attribs || {};
        
        return (
          <img
            src={src}
            alt={alt || ""}
            width={width}
            height={height}
            loading="lazy"
            className={className || "rounded-xl my-6 max-w-full h-auto"}
          />
        );
      }

      // 处理表格：在移动端开启横向滚动，防止列被挤压
      // 使用 domToReact 自然渲染表格，保留所有原始属性（class/style/width 等），
      // 仅在外层包一个负责滚动的 div，彻底避免手动重建 <table> 导致的属性丢失。
      if (wrapTables && domNode instanceof Element && domNode.name === "table") {
        return (
          <div 
            className="overflow-x-auto my-6" 
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {domToReact([domNode], createParserOptions(false, false)) as ReactNode}
          </div>
        );
      }

      // 处理段落：在第1个 <p> 前、第3个和第6个 <p> 后插入广告
      if (insertAds && domNode instanceof Element && domNode.name === "p") {
        pCount++;
        const { class: className, style, id } = domNode.attribs || {};
        const paragraph = (
          <p className={className} style={style} id={id}>
            {domToReact(domNode.children as DOMNode[], createParserOptions(wrapTables, false)) as ReactNode}
          </p>
        );
        if (pCount === 1) {
          return (
            <>
              <InArticleAd index={0} />
              {paragraph}
            </>
          );
        }
        if (pCount === 3) {
          return (
            <>
              {paragraph}
              <InArticleAd index={1} />
            </>
          );
        }
        if (pCount === 6) {
          return (
            <>
              {paragraph}
              <InArticleAd index={2} />
            </>
          );
        }
      }
    },
  };

  return options;
};

/**
 * 安全 HTML 渲染组件
 * 1. 使用 DOMPurify 净化 HTML，防止 XSS 攻击
 * 2. 保留所有常用富文本标签和属性
 * 3. 特别处理 <a> 标签，确保 href、target、rel 属性正常工作
 * 4. 外部链接自动添加 target="_blank" 和 rel="noopener noreferrer"
 * 5. <table> 自动包裹横向滚动容器，优化移动端体验
 * 6. insertAds=true 时，在第3和第6个 <p> 标签后自动插入 InArticleAd
 */
export function SafeHtml({ html, className, insertAds }: SafeHtmlProps) {
  // 第一步：使用 DOMPurify 净化 HTML
  const sanitizedHtml = DOMPurify.sanitize(html, sanitizeConfig);

  // 第二步：使用 html-react-parser 解析为 React 元素
  const options = createParserOptions(true, insertAds || false);
  const parsedContent = parse(sanitizedHtml, options);

  return <div className={className}>{parsedContent}</div>;
}

export default SafeHtml;
