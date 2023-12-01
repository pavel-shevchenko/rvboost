import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Saas-Biz',
  description: ''
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
