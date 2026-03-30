'use client';

import { useState } from 'react';

interface TranscriptAccordionProps {
  transcript: string;
}

export function TranscriptAccordion({ transcript }: TranscriptAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-8 border border-[#545c52] rounded-lg">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left min-h-[44px]"
      >
        <span className="text-sm font-medium text-[#fefadc]">
          {isOpen ? 'Verberg transcript' : 'Bekijk transcript'}
        </span>
        <svg
          className={`w-5 h-5 text-[#8b8174] transition-transform ${isOpen ? 'rotate-180' : ''}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="px-4 pb-4 border-t border-[#545c52]">
          <p className="pt-4 text-sm text-[#cacaaa] whitespace-pre-wrap leading-relaxed">
            {transcript}
          </p>
        </div>
      )}
    </div>
  );
}
