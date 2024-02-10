import {
  HeroSection,
  CTASection,
  LandingFeatures,
  Testimonials,
  TripleColFeatures
} from '@/app/(landing)/_components/page';

export default function Home() {
  return (
    <>
      <HeroSection />
      <TripleColFeatures />
      <Testimonials />
      <LandingFeatures />
      <CTASection />
    </>
  );
}
