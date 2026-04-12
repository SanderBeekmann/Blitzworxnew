/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: '/over-ons', destination: '/about', permanent: true },
      { source: '/intake', destination: '/contact', permanent: true },
      { source: '/blog/snelheid-is-alles', destination: '/blog', permanent: true },
      { source: '/blog/seo-basics-2025', destination: '/blog', permanent: true },
      { source: '/blog/rebranding-visuele-identiteit', destination: '/blog', permanent: true },
      { source: '/maand', destination: '/', permanent: true },
      { source: '/search', destination: '/', permanent: true },
      { source: '/start-nu', destination: '/contact', permanent: true },
      { source: '/Heroepingsformulier_Blitzworx.pdf', destination: '/', permanent: true },
    ];
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
  },
};

export default nextConfig;
