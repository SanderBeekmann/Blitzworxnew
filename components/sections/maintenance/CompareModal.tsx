'use client';

import { Modal } from '@/components/ui/Modal';
import { comparisonRows, packages } from './packages';

interface CompareModalProps {
  open: boolean;
  onClose: () => void;
}

function CheckIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      className="text-dry-sage"
      aria-label="Inbegrepen"
    >
      <path
        d="M5 12l5 5L20 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      className="text-red-400/90"
      aria-label="Niet inbegrepen"
    >
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function renderValue(value: string) {
  if (value === '-') {
    return (
      <span className="flex items-center justify-center">
        <CrossIcon />
      </span>
    );
  }
  if (value === 'Ja') {
    return (
      <span className="flex items-center justify-center">
        <CheckIcon />
      </span>
    );
  }
  return <span className="block text-center">{value}</span>;
}

export function CompareModal({ open, onClose }: CompareModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Vergelijk de pakketten" maxWidth="4xl">
      <div className="overflow-x-auto -mx-6 sm:-mx-8 px-6 sm:px-8">
        <table className="w-full min-w-[560px] border-collapse">
          <thead>
            <tr>
              <th className="text-left text-caption font-mono tracking-[0.2em] uppercase text-cornsilk/70 py-4 pr-4 border-b border-white/15 border-r border-r-white/10">
                Kenmerk
              </th>
              {packages.map((pkg, idx) => {
                const isLast = idx === packages.length - 1;
                return (
                  <th
                    key={pkg.id}
                    className={`text-center text-small font-bold py-4 px-4 border-b border-white/15 ${
                      !isLast ? 'border-r border-r-white/10' : ''
                    } ${
                      pkg.highlighted
                        ? 'text-cornsilk bg-cornsilk/[0.04]'
                        : 'text-dry-sage'
                    }`}
                  >
                    <span className="inline-flex items-center gap-2">
                      {pkg.name}
                      {pkg.highlighted && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-cornsilk text-ink text-[0.65rem] font-mono tracking-[0.1em] uppercase font-medium">
                          Top
                        </span>
                      )}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {comparisonRows.map((row) => (
              <tr key={row.label}>
                <td className="text-small text-dry-sage/90 py-3 pr-4 border-b border-white/[0.06] border-r border-r-white/10 font-medium">
                  {row.label}
                </td>
                {row.values.map((value, colIdx) => {
                  const isHighlightedCol = packages[colIdx]?.highlighted;
                  const isLast = colIdx === row.values.length - 1;
                  return (
                    <td
                      key={`${row.label}-${colIdx}`}
                      className={`text-small py-3 px-4 border-b border-white/[0.06] align-middle ${
                        !isLast ? 'border-r border-r-white/10' : ''
                      } ${
                        isHighlightedCol
                          ? 'text-cornsilk bg-cornsilk/[0.04]'
                          : 'text-dry-sage/80'
                      }`}
                    >
                      {renderValue(value)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-6 text-caption text-cornsilk/50">
        Alle prijzen zijn exclusief BTW. Minimale looptijd 12 maanden.
      </p>
    </Modal>
  );
}
