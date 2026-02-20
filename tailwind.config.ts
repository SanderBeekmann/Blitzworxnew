import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: 'var(--ink-black)',
        ebony: 'var(--ebony)',
        'section-bg': 'var(--color-section-bg)',
        'grey-olive': 'var(--grey-olive)',
        'dry-sage': 'var(--dry-sage)',
        cornsilk: 'var(--cornsilk)',
        neutral: {
          DEFAULT: '#040711',
          50: '#fefadc',
          100: '#cacaaa',
          200: '#b8b89a',
          300: '#8b8174',
          400: '#7a7065',
          500: '#545c52',
          600: '#4a5148',
          700: '#40463e',
          800: '#1a1d2a',
          900: '#040711',
          950: '#040711',
        },
        accent: {
          DEFAULT: '#545c52',
          hover: '#040711',
          light: '#6b7362',
        },
      },
      fontFamily: {
        sans: ['var(--font-gilroy)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'hero': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'hero-lg': ['4rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'hero-xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'hero-2xl': ['5.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'h2': ['2rem', { lineHeight: '1.25', letterSpacing: '-0.01em' }],
        'h2-lg': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'h3': ['1.5rem', { lineHeight: '1.3' }],
        'h3-lg': ['1.75rem', { lineHeight: '1.3' }],
        'body': ['1rem', { lineHeight: '1.5' }],
        'small': ['0.875rem', { lineHeight: '1.5' }],
        'caption': ['0.75rem', { lineHeight: '1.5' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      maxWidth: {
        'container': '1200px',
        'prose': '60ch',
      },
      borderRadius: {
        'sm': '1px',
        'md': '1px',
        'lg': '1px',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.06)',
        'card': '0 4px 16px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
