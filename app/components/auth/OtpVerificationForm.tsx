'use client';

import React, { useState, useRef, KeyboardEvent, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

interface OtpVerificationFormProps {
  email: string;
  onBack: () => void;
}

export function OtpVerificationForm({ email, onBack }: OtpVerificationFormProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(59 * 60); // 59 minutes in seconds
  const { login, requestOtp } = useAuth();
  const router = useRouter();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Auto-submit when all 6 digits are filled
  useEffect(() => {
    const otpCode = otp.join('');
    if (otpCode.length === 6 && !isLoading && !error) {
      // Small delay to ensure state is updated
      const timer = setTimeout(async () => {
        const otpCode = otp.join('');
        
        if (otpCode.length !== 6) return;

        setIsLoading(true);
        setError('');

        try {
          const result = await login(email, otpCode);

          if (result.success) {
            router.push('/dashboard');
          } else {
            setError(result.error || 'Invalid code. Please try again.');
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
          }
        } catch {
          setError('An unexpected error occurred. Please try again.');
          setOtp(['', '', '', '', '', '']);
          inputRefs.current[0]?.focus();
        } finally {
          setIsLoading(false);
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [otp, isLoading, error, email, login, router]);

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split('').concat(Array(6 - pastedData.length).fill(''));
    setOtp(newOtp);
    
    // Focus last filled input or first empty
    const focusIndex = Math.min(pastedData.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const otpCode = otp.join('');
    
    if (otpCode.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await login(email, otpCode);

      if (result.success) {
        // Redirect to dashboard or home
        router.push('/dashboard');
      } else {
        setError(result.error || 'Invalid code. Please try again.');
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    setError('');
    setOtp(['', '', '', '', '', '']);
    setTimeLeft(59 * 60); // Reset timer

    try {
      const result = await requestOtp(email);
      
      if (result.success) {
        // Success - timer will reset automatically
      } else {
        setError(result.error || 'Failed to resend code');
      }
    } catch {
      setError('Failed to resend code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-2 py-3">
      <div className="w-full max-w-[98%] h-[95vh] flex gap-[15px]">
        {/* Left Panel - Image with overlay */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-white rounded-xl shadow-lg">
          {/* Background Image Panel */}
          <div className="absolute inset-0">
            <img
              src="/images/otppanel.svg"
              alt="OTP Panel"
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Overlay Widget Card - Centered */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="relative w-64 h-80">
              <img
                src="/images/otpwidget.svg"
                alt="OTP Widget"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Bottom Left Text */}
          <div className="absolute bottom-8 left-8 z-20 max-w-md">
            <p className="font-sora text-white text-4xl font-bold leading-tight">
              Your unfair advantage in real estate prospecting.
            </p>
          </div>
        </div>

        {/* Right Panel - OTP Verification Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-16 py-12 bg-white rounded-xl shadow-lg border border-gray-300">
          <div className="w-full max-w-md mx-auto">
            {/* Logo */}
            <div className="mb-10 text-center">
              <img
                src="/images/logo.svg"
                alt="Coastal Elements"
                className="mb-8 h-20 mx-auto"
              />
              <p className="font-poppins text-gray-900 text-lg font-semibold mb-2">
                Enter verification Code
              </p>
              <p className="font-poppins text-gray-600 text-sm text-center">
                We have sent a verification code to email address {email}
              </p>
            </div>

            {/* OTP Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* OTP Input Fields */}
              <div className="flex gap-2 justify-center" onPaste={handlePaste}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    disabled={isLoading}
                    className="w-12 h-14 text-center text-2xl font-bold border border-[#DDDDDD] rounded-lg bg-[#D9D9D933] focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed font-poppins"
                  />
                ))}
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600 font-poppins text-center">{error}</p>
                </div>
              )}

              {/* Timer */}
              <div className="text-center">
                <p className="font-poppins text-gray-600 text-sm">
                  Code expires in <span className="text-[#FF6B6B] font-semibold">{formatTime(timeLeft)}</span>
                </p>
              </div>

              {/* Large spacing instead of button */}
              <div className="h-16"></div>

              {/* Resend Link */}
              <div className="text-center">
                <p className="font-poppins text-gray-600 text-sm">
                  Didn't receive a code?{' '}
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={isLoading}
                    className="text-[#FF6B6B] hover:text-[#FF5252] font-medium disabled:text-gray-400"
                  >
                    Resend
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}


