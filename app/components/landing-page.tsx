'use client';

import React from 'react';
import { MagneticForm } from './magnetic-form';
import { HeaderGroup } from './header-group';
import { CoastalLogo } from './coastal-logo';

export function LandingPage({ onSubmit, showAttentionBorder, onNavButtonClick }: { 
  onSubmit: (email: string) => void, 
  showAttentionBorder: boolean,
  onNavButtonClick: () => void 
}) {
  return (
    <>
      {/* House image background */}
      <div
        className="absolute bg-center bg-no-repeat h-full left-0 top-0 w-full"
        data-name="Rowhouse Background"
        style={{ 
          backgroundImage: `url('/images/NYPictogram.png')`,
          backgroundSize: '110%',
          zIndex: 2
        }}
      />
      
      <MagneticForm onSubmit={onSubmit} showAttentionBorder={showAttentionBorder} />
      
      <div className="absolute font-['Sora',_sans-serif] font-normal leading-[0] left-1/2 not-italic text-[#000000] text-[100px] text-center text-nowrap top-[170px] tracking-[-4px] translate-x-[-50%] z-10">
        <p className="adjustLetterSpacing block leading-[normal] whitespace-pre">
          Realtor AI.
        </p>
      </div>
      
      <div className="z-20">
        <HeaderGroup onSubmit={onNavButtonClick} />
      </div>
      
      <div className="z-20">
        <CoastalLogo />
      </div>
      
      <div
        className="absolute font-['Poppins',_sans-serif] font-light leading-[0] not-italic text-[#424242] text-[24px] text-center text-nowrap top-[140px] tracking-[-1.2px] translate-x-[-50%] z-10"
        style={{ left: "calc(50% + 0.5px)" }}
      >
        <p className="adjustLetterSpacing block leading-[normal] whitespace-pre">
          Coastal Elements Presents,
        </p>
      </div>
    </>
  );
} 