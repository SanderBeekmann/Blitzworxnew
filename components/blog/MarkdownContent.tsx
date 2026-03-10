'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';

const proseClasses = `
  prose prose-invert max-w-none
  prose-headings:text-cornsilk prose-headings:font-bold
  prose-h2:text-h2 prose-h2:mt-12 prose-h2:mb-6
  prose-h3:text-h3 prose-h3:mt-8 prose-h3:mb-4
  prose-p:text-dry-sage prose-p:leading-relaxed prose-p:mb-4
  prose-ul:text-dry-sage prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6
  prose-ol:text-dry-sage prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6
  prose-li:mb-2
  prose-strong:text-cornsilk
  prose-hr:border-ebony prose-hr:my-8
  prose-a:text-cornsilk prose-a:underline prose-a:underline-offset-2 hover:prose-a:text-dry-sage
`;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');
}

/** Extract plain text from React children */
function extractText(children: React.ReactNode): string {
  if (typeof children === 'string') return children;
  if (Array.isArray(children)) return children.map(extractText).join('');
  if (React.isValidElement(children) && children.props?.children) {
    return extractText(children.props.children);
  }
  return String(children ?? '');
}

/** Custom components for headings and styled tables */
const markdownComponents: Partial<Components> = {
  h2: ({ children }) => {
    const text = extractText(children);
    return <h2 id={slugify(text)}>{children}</h2>;
  },
  h3: ({ children }) => {
    const text = extractText(children);
    return <h3 id={slugify(text)}>{children}</h3>;
  },
  table: ({ children }) => (
    <div className="not-prose my-8 overflow-hidden rounded-sm border border-ebony/60 bg-neutral-900/50">
      <table className="w-full text-small">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-ebony/40 border-b border-ebony">
      {children}
    </thead>
  ),
  th: ({ children }) => (
    <th className="px-5 py-3 text-left text-caption uppercase tracking-wider font-bold text-cornsilk">
      {children}
    </th>
  ),
  tbody: ({ children }) => (
    <tbody className="divide-y divide-ebony/30">{children}</tbody>
  ),
  tr: ({ children }) => (
    <tr className="transition-colors hover:bg-ebony/20">{children}</tr>
  ),
  td: ({ children }) => {
    const text = extractText(children);
    const hasPrice = /[€$]/.test(text);
    const isBoldRow = /^\*\*/.test(text);
    return (
      <td
        className={`px-5 py-3.5 text-dry-sage ${
          hasPrice ? 'font-semibold text-cornsilk tabular-nums' : ''
        } ${isBoldRow ? 'font-bold text-cornsilk' : ''}`}
      >
        {children}
      </td>
    );
  },
};

export function MarkdownContent({ content }: { content: string }) {
  return (
    <div className={proseClasses}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>{content}</ReactMarkdown>
    </div>
  );
}
