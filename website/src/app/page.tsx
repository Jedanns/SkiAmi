import Header from "@/components/Header";
import VideoBackground from "@/components/VideoBackground";
import HeroSection from "@/components/HeroSection";
import InfoSection from "@/components/InfoSection";
import PreparationSection from "@/components/PreparationSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <VideoBackground />
      <Header />
      <main style={{ position: "relative", zIndex: 1 }}>
        <HeroSection />
        <InfoSection />
        <PreparationSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
