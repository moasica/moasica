import type { Metadata } from 'next';

import { Josefin_Sans } from 'next/font/google';

import '@/styles/globals.scss';

const josefinSans = Josefin_Sans({
  variable: '--font-josefin-sans',
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'Moasica',
  description: 'An alternative front-end for YouTube Music.'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${josefinSans.variable}`}>{children}</body>
    </html>
  );
}
