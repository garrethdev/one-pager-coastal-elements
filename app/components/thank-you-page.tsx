'use client';

import React from 'react';

export function ThankYouPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <h1 className="font-['Sora',_sans-serif] font-normal text-[#000000] text-[60px] text-center mb-2 z-10 tracking-[-4px]">
        Thanks for joining the waitlist!
      </h1>
      <p className="font-['Poppins',_sans-serif] font-normal text-[#424242] text-[24px] text-center z-10">
        You&apos;ll be the first to know when Realtor AI goes live.
      </p>
    </div>
  );
} 