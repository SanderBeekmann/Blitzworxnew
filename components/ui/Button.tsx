import Link from 'next/link';

type ButtonVariant = 'primary' | 'secondary' | 'outline';

interface ButtonProps {
  href?: string;
  children: React.ReactNode;
  variant?: ButtonVariant;
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
  onClick?: () => void;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-dry-sage text-ink hover:bg-cornsilk focus-visible:ring-2 focus-visible:ring-dry-sage focus-visible:ring-offset-2 focus-visible:ring-offset-ink',
  secondary:
    'btn-secondary-cta focus-visible:ring-2 focus-visible:ring-cornsilk focus-visible:ring-offset-2 focus-visible:ring-offset-ink',
  outline:
    'btn-secondary-cta focus-visible:ring-2 focus-visible:ring-cornsilk focus-visible:ring-offset-2 focus-visible:ring-offset-ink',
};

const baseStyles =
  'inline-flex items-center justify-center min-h-[44px] min-w-[44px] px-6 py-3 font-medium rounded-md transition-colors';

export function Button({
  href,
  children,
  variant = 'primary',
  className = '',
  type = 'button',
  disabled = false,
  onClick,
}: ButtonProps) {
  const styles = `${baseStyles} ${variantStyles[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={styles}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={styles}
    >
      {children}
    </button>
  );
}
