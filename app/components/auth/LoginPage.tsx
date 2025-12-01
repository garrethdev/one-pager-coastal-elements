'use client';

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface LoginPageProps {
  onOtpSent?: (email: string) => void;
  email?: string;
  onBack?: () => void;
}

export function LoginPage({ onOtpSent, email, onBack }: LoginPageProps) {
  const [emailInput, setEmailInput] = useState(email || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { requestOtp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!emailInput) {
      setError('Please enter your email');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      const result = await requestOtp(emailInput);

      if (result.success) {
        if (onOtpSent) {
          onOtpSent(emailInput);
        }
      } else {
        setError(result.error || 'Failed to send reset link. Please try again.');
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-2 py-3">
        <div className="w-full max-w-[98%] h-[95vh] flex gap-[15px]">
          {/* Left Panel - Image with overlay */}
          <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-white rounded-xl shadow-lg">
          {/* Background Image Panel */}
          <div className="absolute inset-0">
            <img
              src="/images/loginpanel.svg"
              alt="Login Panel"
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Overlay Widget Card - Centered */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="relative w-64 h-80">
              <img
                src="/images/loginwidget.svg"
                alt="Login Widget"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Bottom Left Text */}
          <div className="absolute bottom-8 left-8 z-20 max-w-md">
            <p className="font-sora text-white text-4xl font-bold leading-tight">
              Find sellers before your competitors do.
            </p>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-16 py-12 bg-white rounded-xl shadow-lg border border-gray-300">
          <div className="w-full max-w-md mx-auto">
            {/* Logo */}
            <div className="mb-10 text-center">
              <img
                src="/images/logo.svg"
                alt="Coastal Elements"
                className="mb-8 h-20 mx-auto"
              />
              <p className="font-poppins text-gray-600 text-sm text-center">
                Enter your email to reset your password
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Email"
                  disabled={isLoading}
                  className="font-poppins w-full pl-10 pr-4 py-3 border border-gray-300 rounded-[20px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed bg-white"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600 font-poppins">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="font-poppins w-full bg-[#3C6382] hover:bg-[#2d4a61] text-white font-semibold py-3.5 px-4 rounded-[20px] transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Sending...
                </>
              ) : (
                'Send reset link'
              )}
            </button>

            {/* Go Back Link */}
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                disabled={isLoading}
                className="font-poppins w-full text-gray-600 hover:text-gray-700 text-sm font-medium disabled:text-gray-300 flex items-center justify-center"
              >
                ← Go Back
              </button>
            )}
          </form>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

