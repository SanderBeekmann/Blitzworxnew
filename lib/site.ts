/**
 * Site configuratie voor blitzworx.nl
 * Gebruik NEXT_PUBLIC_SITE_URL in .env.local voor productie
 */
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blitzworx.nl';

/** Domein zonder protocol (voor vergelijkingen, etc.) */
export const siteDomain = 'blitzworx.nl';
