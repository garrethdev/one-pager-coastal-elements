'use client';

import React from 'react';

export function ThankYouPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white px-4">
      <h1 className="font-['Sora',_sans-serif] font-normal text-[#000000] text-[42px]  md:text-[50px] lg:text-[60px] text-center mb-2 z-10 tracking-[-4px]">
        <span className="block sm:inline">Thanks for</span>
        <span className="block sm:inline"> joining the waitlist!</span>
      </h1>
      <p className="font-['Poppins',_sans-serif] font-normal text-[#424242] text-[12px] sm:text-[18px] md:text-[20px] lg:text-[24px] text-center z-10">
        You&apos;ll be the first to know when Realtor AI goes live.
      </p>
    </div>
  );
} 