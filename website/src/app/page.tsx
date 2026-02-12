import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ScrollRevealText from "@/components/ScrollRevealText";
import InfoSection from "@/components/InfoSection";
import PreparationSection from "@/components/PreparationSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <ScrollRevealText
          text="Une semaine au sommet."
          subtitle="8 amis · 7 jours · Val Cenis"
        />
        <InfoSection />
        <PreparationSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
