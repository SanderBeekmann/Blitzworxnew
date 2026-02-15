import localFont from 'next/font/local';

export const gilroy = localFont({
  src: [
    { path: '../assets/fonts/Gilroy-Light.woff2', weight: '300' },
    { path: '../assets/fonts/Gilroy-Regular.woff2', weight: '400' },
    { path: '../assets/fonts/Gilroy-Medium.woff2', weight: '500' },
    { path: '../assets/fonts/Gilroy-Bold.woff2', weight: '700' },
    { path: '../assets/fonts/Gilroy-Heavy.woff2', weight: '800' },
  ],
  variable: '--font-gilroy',
  display: 'swap',
});
