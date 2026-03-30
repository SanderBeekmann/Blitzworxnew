interface FAQ {
  question: string;
  answer: string;
}

export function BlogFAQ({ faqs }: { faqs?: FAQ[] }) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <section>
      <h2 className="text-h3 font-bold text-cornsilk mb-4">Veelgestelde vragen</h2>
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <details
            key={i}
            className="group border border-ebony rounded-sm"
          >
            <summary className="cursor-pointer p-4 text-small font-bold text-cornsilk flex items-center justify-between list-none [&::-webkit-details-marker]:hidden">
              {faq.question}
              <span className="text-grey-olive group-open:rotate-45 transition-transform duration-300 text-body shrink-0 ml-3">
                +
              </span>
            </summary>
            <div className="grid grid-rows-[0fr] group-open:grid-rows-[1fr] transition-[grid-template-rows] duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]">
              <div className="overflow-hidden">
                <p className="px-4 pb-4 text-small text-dry-sage leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
