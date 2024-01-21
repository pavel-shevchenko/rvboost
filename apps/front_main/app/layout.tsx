import type { Metadata } from 'next';

import '@/app/_components/root-layout/styles/css/globals.css';
import { PublicEnvScript } from 'next-runtime-env';

// [?] Important for separating zustand-state of users at calling initUserStore()
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'RvBoost',
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
