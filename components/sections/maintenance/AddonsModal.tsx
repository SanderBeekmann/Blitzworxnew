'use client';

import { Modal } from '@/components/ui/Modal';
import { addons } from './packages';

interface AddonsModalProps {
  open: boolean;
  onClose: () => void;
}

export function AddonsModal({ open, onClose }: AddonsModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Add-ons" maxWidth="2xl">
      <p className="text-small text-dry-sage/90 leading-relaxed mb-6">
        Alle add-ons zijn los af te nemen bovenop elk pakket.
      </p>

      <ul className="divide-y divide-white/[0.08]">
        {addons.map((addon) => (
          <li
            key={addon.name}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-4 px-4 -mx-4 rounded-md hover:bg-white/[0.03] transition-colors"
          >
            <span className="text-small text-cornsilk/95 font-medium">{addon.name}</span>
            <span className="text-small text-cornsilk/80 font-mono">{addon.price}</span>
          </li>
        ))}
      </ul>

      <p className="mt-6 text-caption text-cornsilk/50">
        Vragen over een specifieke add-on? Stuur een bericht via het contactformulier.
      </p>
    </Modal>
  );
}
