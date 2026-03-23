import { Navbar } from "@/components/layout";
import { Footer } from "@/components/layout";
import {
  HeroSection,
  HowItWorksSection,
  CtaSection,
} from "@/components/landing";
import { WhySynapsySection } from "@/components/landing/why-synapsy-section";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <WhySynapsySection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
