'use client';

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { useRouter } from 'next/navigation';

function DashboardContent() {
  const { user, profile, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Realtor AI Dashboard
            </h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Welcome! 🎉
          </h2>
          <p className="text-gray-600">
            You have successfully logged in using OTP authentication.
          </p>
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            User Information
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-medium text-gray-700">Email:</span>
              <span className="text-gray-900">{user?.email}</span>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-medium text-gray-700">User ID:</span>
              <span className="text-gray-600 text-sm font-mono">
                {user?.id.slice(0, 8)}...
              </span>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-medium text-gray-700">Token Type:</span>
              <span className="text-gray-900">{user?.token_type}</span>
            </div>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Profile Details
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-medium text-gray-700">Credits:</span>
              <span className="text-2xl font-bold text-green-600">
                {profile?.current_credits}
              </span>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-medium text-gray-700">Plan:</span>
              <span className="text-gray-900 capitalize">
                {profile?.subscription_plan}
              </span>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-medium text-gray-700">Member Since:</span>
              <span className="text-gray-900">
                {profile?.created_at
                  ? new Date(profile.created_at).toLocaleDateString()
                  : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <button
            onClick={() => router.push('/search')}
            className="bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 hover:border-blue-300 rounded-lg p-6 transition text-left"
          >
            <div className="text-4xl mb-2">🔍</div>
            <h4 className="font-semibold text-gray-900 mb-2">Search Properties</h4>
            <p className="text-sm text-gray-600">
              Search through millions of properties with AI-powered insights
            </p>
            <p className="text-xs text-blue-600 mt-3 font-semibold">
              Click to start searching →
            </p>
          </button>

          <button
            onClick={() => router.push('/saved-searches')}
            className="bg-green-50 hover:bg-green-100 border-2 border-green-200 hover:border-green-300 rounded-lg p-6 transition text-left"
          >
            <div className="text-4xl mb-2">💾</div>
            <h4 className="font-semibold text-gray-900 mb-2">Saved Searches</h4>
            <p className="text-sm text-gray-600">
              Save your favorite searches and get instant updates
            </p>
            <p className="text-xs text-green-600 mt-3 font-semibold">
              View saved searches →
            </p>
          </button>

          <button
            onClick={() => router.push('/search')}
            className="bg-purple-50 hover:bg-purple-100 border-2 border-purple-200 hover:border-purple-300 rounded-lg p-6 transition text-left"
          >
            <div className="text-4xl mb-2">📊</div>
            <h4 className="font-semibold text-gray-900 mb-2">Export Data</h4>
            <p className="text-sm text-gray-600">
              Export search results to CSV for further analysis
            </p>
            <p className="text-xs text-purple-600 mt-3 font-semibold">
              Search then export →
            </p>
          </button>
        </div>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

