'use client';

import React, { useState, useEffect, useRef } from 'react';
import { EmailInputForm } from './email-input-form';

export function MagneticForm({ onSubmit, showAttentionBorder }: { 
  onSubmit: (email: string) => void, 
  showAttentionBorder: boolean 
}) {
  const [magnetOffset, setMagnetOffset] = useState({ x: 0, y: 0 });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isHovered, setIsHovered] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!frameRef.current) return;

      const rect = frameRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      
      // Calculate distance from cursor to form center
      const distance = Math.sqrt(
        Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2)
      );
      
      // Define magnetic field radius
      const magnetRadius = 100; // Reduced for less sensitivity
      const maxPull = 8; // Reduced maximum movement for subtlety
      
      if (distance < magnetRadius) {
        setIsHovered(true);
        
        // Calculate pull strength (stronger when closer, but more subtle)
        const pullStrength = Math.max(0, 1 - (distance / magnetRadius)) * 0.6; // Added multiplier for subtlety
        
        // Calculate direction vector
        const directionX = (mouseX - centerX) / distance;
        const directionY = (mouseY - centerY) / distance;
        
        // Apply magnetic pull
        const offsetX = directionX * pullStrength * maxPull;
        const offsetY = directionY * pullStrength * maxPull;
        
        setMagnetOffset({ x: offsetX, y: offsetY });
      } else {
        setIsHovered(false);
        // Return to original position
        setMagnetOffset({ x: 0, y: 0 });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div 
      ref={frameRef}
      className="absolute h-[54px] left-1/2 top-[350px] w-[380px] z-20 transition-transform duration-300 ease-out"
      style={{
        transform: `translate(calc(-50% + ${magnetOffset.x}px), ${magnetOffset.y}px)`,
      }}
    >
      <EmailInputForm onSubmit={onSubmit} showAttentionBorder={showAttentionBorder} />
    </div>
  );
} 