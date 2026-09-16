import React from 'react';
import './LandingPage.css';

// Section components
import HeroLanding from './HeroLanding';
import ProblemStats from './ProblemStats';
import FeatureCropPrediction from './FeatureCropPrediction';
import FeatureChatBot from './FeatureChatBot';
import HowItWorks from './HowItWorks';
import CTAFooter from './CTAFooter';

export default function LandingPage() {
  return (
    <div className="lp-root" style={{ scrollBehavior: 'smooth' }}>
      {/* 1. Hero — word stagger + particles + hero image */}
      <HeroLanding />

      {/* 2. Problem — count-up stat cards */}
      <ProblemStats />

      {/* 3. Feature: Crop Prediction — sticky mockup + scrolling text */}
      <FeatureCropPrediction />

      {/* 4. Feature: Chatbot — typewriter demo */}
      <FeatureChatBot />

      {/* 5. How It Works — animated vertical timeline */}
      <HowItWorks />

      {/* 6. CTA + minimal footer */}
      <CTAFooter />
    </div>
  );
}
