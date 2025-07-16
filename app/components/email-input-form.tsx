import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { LoadingSpinner } from './loading-spinner';

export function EmailInputForm({ onSubmit, showAttentionBorder }: { onSubmit: (email: string) => void, showAttentionBorder: boolean }) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    if (email.trim() && isValidEmail(email)) {
      setIsLoading(true);
      
      try {
        const res = await fetch('/api/submit-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });

        const result = await res.json();
        
        if (result.success) {
          console.log('Email saved to HubSpot successfully!');
          // Show loading for 2 seconds then navigate
          setTimeout(() => {
            setIsLoading(false);
            onSubmit(email);
          }, 2000);
        } else {
          console.error('Error saving email:', result.error);
          setIsLoading(false);
          toast.error(result.error || 'Failed to save email. Please try again.');
        }
      } catch (error) {
        console.error('Email submission error:', error);
        setIsLoading(false);
        toast.error('Network error. Please check your connection and try again.');
      }
    }
  };

  // Debug log to see if the state is changing
  useEffect(() => {
    if (showAttentionBorder) {
      console.log('Attention border is now showing');
    }
  }, [showAttentionBorder]);

  return (
    <div className={`absolute bg-[#e3e3e3] box-border content-stretch flex flex-row gap-2 items-center justify-between left-0 pl-3 pr-2 py-2 rounded-[5px] top-0 w-full transition-all duration-300 ${
      showAttentionBorder 
        ? 'border border-black shadow-[0_0_20px_rgba(0,0,0,0.3)] animate-pulse' 
        : 'border border-transparent'
    }`}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="realtor@email.com"
        disabled={isLoading}
        className={`font-['Poppins',_sans-serif] font-light leading-[0] not-italic flex-1 ${email.length > 0 ? 'text-[#000000]' : 'text-[#c0c0c0]'} text-[12px] sm:text-[14px] md:text-[16px] text-left text-nowrap tracking-[-0.8px] bg-transparent border-none outline-none placeholder:text-[#c0c0c0] ${isLoading ? 'opacity-50' : ''}`}
        onKeyPress={(e) => {
          if (e.key === 'Enter' && !isLoading) {
            handleSubmit();
          }
        }}
      />
      <button 
        onClick={handleSubmit}
        disabled={!email.trim() || !isValidEmail(email) || isLoading}
        className={`box-border content-stretch flex flex-row gap-2 items-center justify-center px-[6px] sm:px-[8px] md:px-[12px] py-[8px] sm:py-[10px] rounded-[5px] transition-colors duration-300 shrink-0 min-w-[80px] sm:min-w-[100px] md:min-w-[140px] ${
          (email.trim() && isValidEmail(email) && !isLoading)
            ? 'bg-[#1c1348] hover:bg-[#1c1348]/90 cursor-pointer' 
            : 'bg-[#1c1348]/50 cursor-not-allowed'
        }`}
      >
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="font-['Poppins',_sans-serif] font-medium leading-[1.2] not-italic text-[#ffffff] text-[12px] sm:text-[14px] md:text-[16px] text-center text-nowrap tracking-[-0.8px]">
            <p className="adjustLetterSpacing block leading-[normal] whitespace-pre">
              Join the Waitlist
            </p>
          </div>
        )}
      </button>
    </div>
  );
}
