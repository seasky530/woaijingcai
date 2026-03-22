"use client";

import DOMPurify from "isomorphic-dompurify";
import parse, { HTMLReactParserOptions, Element, domToReact, DOMNode, Text as DOMText } from "html-react-parser";
import { ReactNode } from "react";

interface SafeHtmlProps {
  html: string;
  className?: string;
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

// html-react-parser 配置：自定义元素渲染
const parserOptions: HTMLReactParserOptions = {
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
          {domToReact(domNode.children as DOMNode[], parserOptions) as ReactNode}
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
  },
};

/**
 * 安全 HTML 渲染组件
 * 1. 使用 DOMPurify 净化 HTML，防止 XSS 攻击
 * 2. 保留所有常用富文本标签和属性
 * 3. 特别处理 <a> 标签，确保 href、target、rel 属性正常工作
 * 4. 外部链接自动添加 target="_blank" 和 rel="noopener noreferrer"
 */
export function SafeHtml({ html, className }: SafeHtmlProps) {
  // 第一步：使用 DOMPurify 净化 HTML
  const sanitizedHtml = DOMPurify.sanitize(html, sanitizeConfig);

  // 第二步：使用 html-react-parser 解析为 React 元素
  const parsedContent = parse(sanitizedHtml, parserOptions);

  return <div className={className}>{parsedContent}</div>;
}

export default SafeHtml;
