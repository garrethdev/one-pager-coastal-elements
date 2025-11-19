'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthCallback() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('🔍 Callback started, checking URL hash...');
        console.log('Full URL:', window.location.href);
        console.log('Hash:', window.location.hash);
        
        // Get hash params from URL
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const expiresIn = hashParams.get('expires_in');
        const tokenType = hashParams.get('token_type');
        const errorParam = hashParams.get('error');
        const errorDescription = hashParams.get('error_description');

        console.log('📝 Extracted params:', {
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
          expiresIn,
          tokenType,
          error: errorParam,
        });

        // Check for errors
        if (errorParam) {
          console.error('❌ Auth error:', errorParam, errorDescription);
          setError(errorDescription || 'Authentication failed');
          setIsProcessing(false);
          return;
        }

        // Validate tokens
        if (!accessToken || !refreshToken) {
          console.error('❌ Missing tokens!', { accessToken: !!accessToken, refreshToken: !!refreshToken });
          setError('Missing authentication tokens');
          setIsProcessing(false);
          return;
        }

        // Extract email from token (JWT decode - simple version)
        console.log('🔐 Decoding JWT token...');
        const tokenParts = accessToken.split('.');
        if (tokenParts.length !== 3) {
          console.error('❌ Invalid JWT format');
          setError('Invalid token format');
          setIsProcessing(false);
          return;
        }

        const payload = JSON.parse(atob(tokenParts[1]));
        const email = payload.email;
        const userId = payload.sub;

        console.log('👤 User info from token:', { email, userId });

        if (!email || !userId) {
          console.error('❌ Missing email or userId in token');
          setError('Invalid token payload');
          setIsProcessing(false);
          return;
        }

        // Store auth data in localStorage (same format as OTP login)
        const userData = {
          id: userId,
          email: email,
          access_token: accessToken,
          refresh_token: refreshToken,
          expires_in: parseInt(expiresIn || '3600'),
          token_type: tokenType || 'bearer',
        };

        console.log('💾 Saving user data to localStorage...');
        localStorage.setItem('coastal_user', JSON.stringify(userData));
        localStorage.setItem('coastal_auth_token', accessToken);
        
        // Get user profile from backend
        console.log('📡 Fetching user profile from backend...');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
        console.log('API URL:', apiUrl);
        
        const response = await fetch(`${apiUrl}/users/profile`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        console.log('📡 Profile fetch response:', response.status, response.statusText);

        if (response.ok) {
          const profileData = await response.json();
          console.log('✅ Profile data received:', profileData);
          
          // Save to localStorage
          localStorage.setItem('coastal_profile', JSON.stringify(profileData.data || profileData));
          
          console.log('✅ All data saved! Redirecting to dashboard...');
          // Redirect to dashboard
          setTimeout(() => {
            router.push('/dashboard');
          }, 100);
        } else {
          console.warn('⚠️ Profile fetch failed, but continuing with basic user data');
          // If profile fetch fails, still redirect (profile can be fetched later)
          setTimeout(() => {
            router.push('/dashboard');
          }, 100);
        }
      } catch (err) {
        console.error('Callback error:', err);
        setError(err instanceof Error ? err.message : 'Failed to process authentication');
        setIsProcessing(false);
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg text-center">
        {isProcessing ? (
          <>
            <svg
              className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4"
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
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Processing Authentication...
            </h2>
            <p className="text-gray-600">
              Please wait while we log you in
            </p>
          </>
        ) : error ? (
          <>
            <div className="text-red-600 text-5xl mb-4">❌</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Authentication Failed
            </h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => router.push('/login')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
            >
              Return to Login
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}

