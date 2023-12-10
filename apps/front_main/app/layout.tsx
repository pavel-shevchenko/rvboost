import type { Metadata } from 'next';

import '@/app/_components/root-layout/styles/css/globals.css';
import { PublicEnvScript } from 'next-runtime-env';

export const metadata: Metadata = {
  title: 'Saas-Biz',
  description: ''
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <PublicEnvScript />
      </head>
      <body>{children}</body>
    </html>
  );
}
