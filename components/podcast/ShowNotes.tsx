import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ShowNotesProps {
  content: string;
}

export function ShowNotes({ content }: ShowNotesProps) {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-[#fefadc] mb-4">Show notes</h2>
      <div className="prose prose-invert max-w-none prose-headings:text-[#fefadc] prose-p:text-[#cacaaa] prose-a:text-[#cacaaa] prose-a:hover:text-[#fefadc] prose-strong:text-[#fefadc] prose-li:text-[#cacaaa]">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </div>
    </div>
  );
}
