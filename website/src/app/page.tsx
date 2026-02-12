import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
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
        <InfoSection />
        <PreparationSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
