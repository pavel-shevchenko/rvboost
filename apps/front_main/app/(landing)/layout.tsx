import { Header, Footer } from '@/app/(landing)/_components/layout';

export default function LandingLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div>{children}</div>
      <Footer />
    </>
  );
}
