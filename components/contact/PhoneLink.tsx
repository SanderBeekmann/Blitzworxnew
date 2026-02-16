'use client';

import { useState } from 'react';

/**
 * Telefoonnummer obfuscated (base64) om scrapers te ontwijken.
 * Decode: atob('KzMxNjEzMDI2Mjgw') => '+31613026280'
 */
const ENCODED_PHONE = 'KzMxNjEzMDI2Mjgw';

function decodePhone(): string {
  if (typeof window === 'undefined') return '';
  try {
    return atob(ENCODED_PHONE);
  } catch {
    return '';
  }
}

/** Formatteer voor weergave: 06 13 02 62 80 */
function formatDisplay(tel: string): string {
  const digits = tel.replace(/\D/g, '');
  if (digits.startsWith('316')) {
    return `06 ${digits.slice(3, 5)} ${digits.slice(5, 7)} ${digits.slice(7, 9)} ${digits.slice(9)}`;
  }
  return tel;
}

export function PhoneLink() {
  const [revealed, setRevealed] = useState(false);
  const [phone, setPhone] = useState<string | null>(null);

  const handleReveal = () => {
    if (!phone) {
      setPhone(decodePhone());
    }
    setRevealed(true);
  };

  const handleCall = (e: React.MouseEvent) => {
    e.preventDefault();
    const num = phone || decodePhone();
    if (num) {
      window.location.href = `tel:${num}`;
    }
  };

  const num = phone || (typeof window !== 'undefined' ? decodePhone() : '');
  const display = formatDisplay(num);

  return (
    <p className="text-body text-dry-sage">
      <strong className="text-cornsilk">Telefoon</strong>
      <br />
      {revealed ? (
        <a
          href={`tel:${num}`}
          onClick={handleCall}
          className="text-dry-sage hover:text-cornsilk hover:underline"
        >
          {display}
        </a>
      ) : (
        <button
          type="button"
          onClick={handleReveal}
          className="text-dry-sage hover:text-cornsilk hover:underline text-left bg-transparent border-none p-0 cursor-pointer font-inherit"
          aria-label="Toon telefoonnummer"
        >
          Klik om nummer te tonen
        </button>
      )}
    </p>
  );
}
