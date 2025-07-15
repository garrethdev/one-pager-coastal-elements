'use client';

import React from 'react';
import Image from 'next/image';

export function CoastalLogo() {
  return (
    <div
      className="absolute h-12 sm:h-14 md:h-16 top-4 translate-x-[-50%] w-[50px] sm:w-[60px] md:w-[65px] z-20"
      data-name="Coastal Elements Logo-03 1"
      style={{ left: "calc(50% + 0.5px)" }}
    >
      <Image
        src="/images/Coastal Elements Logo.png"
        alt="Coastal Elements Logo"
        width={65}
        height={64}
        className="block size-full object-contain"
      />
    </div>
  );
} 