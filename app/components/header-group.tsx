'use client';

import React from 'react';
import { NavButton } from './nav-button';

export function HeaderGroup({ onSubmit }: { onSubmit: () => void }) {
  return (
    <div
      className="absolute contents top-[25px] translate-x-[-50%]"
      style={{ left: "calc(50% + 1px)" }}
    >
      <div
        className="absolute font-['Sora',_sans-serif] leading-[0] not-italic text-[#000000] font-bold text-[20px] sm:text-[24px] md:text-[26px] lg:text-[30px] text-center text-nowrap top-8 tracking-[-1.25px] left-4 sm:left-8 z-20"
      >
        <p className="adjustLetterSpacing block leading-[normal] whitespace-pre">
          Realtor AI
        </p>
      </div>
      <NavButton onSubmit={onSubmit} />
    </div>
  );
} 