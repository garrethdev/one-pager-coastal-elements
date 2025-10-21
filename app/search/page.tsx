'use client';

import { useState } from 'react';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { useAuth } from '../context/AuthContext';
import { SearchForm } from '../components/search/SearchForm';
import { SearchResults } from '../components/search/SearchResults';
import { apiClient } from '../lib/api-client';

export default function SearchPage() {
  return (
    <ProtectedRoute>
      <SearchPageContent />
    </ProtectedRoute>
  );
}

function SearchPageContent() {
  const { user, profile, refreshProfile } = useAuth();
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchInfo, setSearchInfo] = useState<any>(null);

  const handleSearch = async (query: string, filters: any) => {
    if (!user?.access_token) {
      setError('Please login to search');
      return;
    }

    // Check credits
    if (profile && profile.current_credits < 1) {
      setError('Insufficient credits. You need at least 1 credit to search.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await apiClient.searchProperties(
        user.access_token,
        query,
        filters,
        1, // page
        20 // limit
      );

      if (response.success && response.data) {
        setResults(response.data.data || response.data);
        setSearchInfo({
          creditsUsed: response.data.credits_used || 1,
          remainingCredits: response.data.remaining_credits,
          pagination: response.data.pagination,
        });

        // Refresh profile to update credits
        await refreshProfile();
      } else {
        setError(response.error || 'Search failed');
        setResults([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Property Search
              </h1>
              <p className="text-gray-600 mt-1">
                Search millions of properties powered by AI
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Available Credits</div>
              <div className="text-2xl font-bold text-green-600">
                {profile?.current_credits || 0}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Form */}
        <SearchForm onSearch={handleSearch} isLoading={isLoading} />

        {/* Error Message */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Search Info */}
        {searchInfo && !isLoading && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-blue-900 font-semibold">
                  Search Complete!
                </p>
                <p className="text-blue-700 text-sm">
                  Found {searchInfo.pagination?.total || results.length} results
                </p>
              </div>
              <div className="text-right">
                <p className="text-blue-700 text-sm">Credits Used: {searchInfo.creditsUsed}</p>
                <p className="text-blue-900 font-semibold">
                  Remaining: {searchInfo.remainingCredits}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        <SearchResults 
          results={results} 
          isLoading={isLoading}
          pagination={searchInfo?.pagination}
        />
      </main>
    </div>
  );
}

