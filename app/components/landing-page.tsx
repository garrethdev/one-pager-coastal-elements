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
      
      <div className="absolute font-['Sora',_sans-serif] font-normal leading-[0] left-1/2 not-italic text-[#000000] text-[50px] sm:text-[80px] md:text-[100px] lg:text-[120px] xl:text-[140px] text-center text-nowrap top-6/12 tracking-[-4px] translate-x-[-50%] translate-y-[-70%] z-10">
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
          className="absolute font-['Poppins',_sans-serif] font-light leading-[0] not-italic text-[#424242] text-[16px] sm:text-[20px] md:text-[24px] lg:text-[28px] xl:text-[32px] text-center text-nowrap top-6/12 tracking-[-1.2px] translate-x-[-50%] translate-y-[-300%] z-10"
          style={{ left: "calc(50% + 0.5px)" }}
        >
        <p className="adjustLetterSpacing block leading-[normal] whitespace-pre">
          Coastal Elements Presents,
        </p>
      </div>

    </>
  );
} 