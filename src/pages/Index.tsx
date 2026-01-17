import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import TournamentsPreview from "@/components/home/TournamentsPreview";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import CTASection from "@/components/home/CTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <FeaturesSection />
      <TournamentsPreview />
      <HowItWorksSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
