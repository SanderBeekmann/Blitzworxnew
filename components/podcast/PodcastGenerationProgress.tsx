'use client';

import { useState, useEffect } from 'react';

const STEPS = [
  'Notebook aanmaken',
  'Bronnen toevoegen',
  'Audio genereren',
  'Audio downloaden',
];

interface PodcastGenerationProgressProps {
  podcastId: string;
  onComplete: () => void;
  onError: (message: string) => void;
}

export function PodcastGenerationProgress({
  podcastId,
  onComplete,
  onError,
}: PodcastGenerationProgressProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [polling, setPolling] = useState(true);

  useEffect(() => {
    if (!polling) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/admin/podcasts/${podcastId}/status`);
        if (!res.ok) {
          onError('Kon status niet ophalen');
          setPolling(false);
          return;
        }

        const data = await res.json();

        if (data.status === 'review' && data.audio_url) {
          setCurrentStep(STEPS.length);
          setPolling(false);
          onComplete();
          return;
        }

        if (data.status === 'draft') {
          setPolling(false);
          onError('Generatie is gestopt. Probeer het opnieuw.');
          return;
        }

        // Estimate step based on status and data
        if (data.status === 'generating') {
          if (data.audio_url) {
            setCurrentStep(3);
          } else if (data.sources && data.sources.length > 0) {
            setCurrentStep(2);
          } else {
            setCurrentStep(1);
          }
        }
      } catch {
        onError('Verbinding verloren');
        setPolling(false);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [podcastId, polling, onComplete, onError]);

  return (
    <div className="py-8">
      <div className="space-y-4">
        {STEPS.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep && polling;

          return (
            <div key={step} className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  isCompleted
                    ? 'bg-[#cacaaa] text-[#040711]'
                    : isCurrent
                      ? 'border-2 border-[#cacaaa] text-[#cacaaa]'
                      : 'border border-[#545c52] text-[#545c52]'
                }`}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <span className="text-xs font-medium">{index + 1}</span>
                )}
              </div>
              <span
                className={`text-small ${
                  isCompleted
                    ? 'text-[#cacaaa]'
                    : isCurrent
                      ? 'text-[#fefadc] font-medium'
                      : 'text-[#8b8174]'
                }`}
              >
                {step}
                {isCurrent && (
                  <span className="inline-flex ml-2">
                    <span className="animate-pulse">...</span>
                  </span>
                )}
              </span>
            </div>
          );
        })}
      </div>
      {polling && (
        <p className="mt-6 text-xs text-[#8b8174]">
          Dit kan 2-10 minuten duren. Je kunt deze pagina openlaten.
        </p>
      )}
    </div>
  );
}
