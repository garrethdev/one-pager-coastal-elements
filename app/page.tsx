'use client';

import React, { useState } from 'react';
import { LandingPage } from './components/landing-page';
import { ThankYouPage } from './components/thank-you-page';
import { AnimatedGrid } from './components/AnimatedGrid';

export default function Home() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [showAttentionBorder, setShowAttentionBorder] = useState(false);

  const handleSubmit = (email: string) => {
    setSubmittedEmail(email);
    setIsSubmitted(true);
    console.log('Email submitted:', email);
  };

  const handleNavButtonClick = () => {
    console.log('handleNavButtonClick called!'); // Debug log
    // Show attention border for 2 seconds
    setShowAttentionBorder(true);
    setTimeout(() => {
      setShowAttentionBorder(false);
      console.log('Attention border hidden'); // Debug log
    }, 2000);
  };

  return (
    <div className="bg-[#ffffff] relative h-screen w-full overflow-hidden" data-name="Desktop - 1">
      {/* Animated grid background */}
      <AnimatedGrid />
      
      {/* Conditionally render either landing page or thank you page */}
      {isSubmitted ? (
        <ThankYouPage />
      ) : (
        <LandingPage 
          onSubmit={handleSubmit} 
          showAttentionBorder={showAttentionBorder}
          onNavButtonClick={handleNavButtonClick}
        />
      )}
    </div>
  );
}
