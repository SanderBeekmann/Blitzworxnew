'use client';

import Script from 'next/script';

interface GoogleAnalyticsProps {
  consent: boolean | null;
}

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export function GoogleAnalytics({ consent }: GoogleAnalyticsProps) {
  if (!GA_ID || consent !== true) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            anonymize_ip: true,
            cookie_flags: 'SameSite=None;Secure'
          });
        `}
      </Script>
    </>
  );
}
