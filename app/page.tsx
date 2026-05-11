import { LandingHeader } from "./_components/landing/header";
import { LandingHero } from "./_components/landing/hero";
import { LandingFeatures } from "./_components/landing/features";
import { LandingHowItWorks } from "./_components/landing/how-it-works";
import { LandingFAQ } from "./_components/landing/faq";
import { LandingPricing } from "./_components/landing/pricing-section";
import { LandingFooter } from "./_components/landing/footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col neo-app-bg font-sans scroll-smooth">
      <LandingHeader />
      
      <div className="flex-1">
        <LandingHero />
        <LandingFeatures />
        <LandingHowItWorks />
        <LandingFAQ />
        <LandingPricing />
      </div>

      <LandingFooter />
    </main>
  );
}
