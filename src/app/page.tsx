import { Navbar } from "@/components/layout";
import { Footer } from "@/components/layout";
import {
  HeroSection,
  HowItWorksSection,
  ForPsychologistsSection,
  CtaSection,
} from "@/components/landing";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <ForPsychologistsSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
