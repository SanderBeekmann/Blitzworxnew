'use client';

import ReactMarkdown from 'react-markdown';

const proseClasses = `
  prose prose-invert max-w-none
  prose-headings:text-cornsilk prose-headings:font-bold
  prose-h2:text-h2 prose-h2:mt-12 prose-h2:mb-6
  prose-h3:text-h3 prose-h3:mt-8 prose-h3:mb-4
  prose-p:text-dry-sage prose-p:leading-relaxed prose-p:mb-4
  prose-ul:text-dry-sage prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6
  prose-li:mb-2
  prose-strong:text-cornsilk
  prose-hr:border-ebony prose-hr:my-8
`;

export function MarkdownContent({ content }: { content: string }) {
  return (
    <div className={proseClasses}>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
