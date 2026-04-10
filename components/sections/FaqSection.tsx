import { FadeIn } from '@/components/animations/FadeIn';

export interface FaqItem {
  question: string;
  answer: string;
}

interface FaqSectionProps {
  items: readonly FaqItem[];
  title?: string;
  id?: string;
}

export function FaqSection({ items, title = 'Veelgestelde vragen', id = 'faq-title' }: FaqSectionProps) {
  return (
    <section className="section" aria-labelledby={id}>
      <div className="container-narrow">
        <FadeIn>
          <h2 id={id} className="text-h2 font-bold text-cornsilk mb-12">
            {title}
          </h2>
        </FadeIn>
        <div className="space-y-4">
          {items.map((item, index) => (
            <FadeIn key={item.question} delay={index * 0.05}>
              <details className="group border border-ebony rounded-sm">
                <summary className="cursor-pointer p-5 text-body font-bold text-cornsilk flex items-center justify-between list-none [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <span className="text-grey-olive group-open:rotate-45 transition-transform duration-300 text-h3 shrink-0 ml-4">
                    +
                  </span>
                </summary>
                <div className="grid grid-rows-[0fr] group-open:grid-rows-[1fr] transition-[grid-template-rows] duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]">
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-body text-dry-sage leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </details>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

export function buildFaqJsonLd(items: readonly FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}
