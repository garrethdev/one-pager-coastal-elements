'use client';

import React from 'react';

export function NavButton({ onSubmit }: { onSubmit: () => void }) {
  const handleNavSubmit = () => {
    console.log('Nav button clicked!'); // Debug log
    onSubmit();
  };

  return (
    <button 
      onClick={handleNavSubmit}
      className="absolute bg-[#1c1348] box-border content-stretch flex flex-row gap-2 items-center justify-center px-[12px] py-[10px] rounded-[5px] top-[25px] hover:bg-[#1c1348]/90 transition-colors duration-300 z-50"
      style={{ right: "32px" }}
    >
      <div className="font-['Poppins',_sans-serif] font-medium leading-[1.2] not-italic relative shrink-0 text-[#ffffff] text-[16px] text-center text-nowrap tracking-[-0.8px]">
        <p className="adjustLetterSpacing block leading-[normal] whitespace-pre">
          Join the Waitlist
        </p>
      </div>
    </button>
  );
} 