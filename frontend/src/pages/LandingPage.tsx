import SocialProof from "../components/SocialProof.tsx";
import Solutions from "../components/Solutions.tsx";
import Agents from "../components/Agents.tsx";
import HowItWorks from "../components/HowItWorks.tsx";
import Pricing from "../components/Pricing.tsx";
import Security from "../components/Security.tsx";
import Contact from "../components/Contact.tsx";
import Hero from "../components/Hero.tsx";
import { Review } from "../types";
interface LandingPageProps {
  reviews: Review[];
  reviewsLoading: boolean;
  handleReviewCreated: (r: Review) => void;
  onGetStarted: () => void;
}

export default function LandingPage({
  reviews,
  reviewsLoading,
  handleReviewCreated,
}: LandingPageProps) {
  return (
    <>
      <Hero
        reviews={reviews}
        loading={reviewsLoading}
        onGetStarted={() => {}}
      />
      <SocialProof />
      <Solutions />
      <Agents />
      <HowItWorks />
      <Pricing />
      <Security />
      <Contact {...({ onReviewCreated: handleReviewCreated } as any)} />
    </>
  );
}
