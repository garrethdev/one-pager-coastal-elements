'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../lib/api-client';

interface SavedSearch {
  id: string;
  search_query: string;
  created_at: string;
}

export default function SavedSearchesPage() {
  return (
    <ProtectedRoute>
      <SavedSearchesContent />
    </ProtectedRoute>
  );
}

function SavedSearchesContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [searches, setSearches] = useState<SavedSearch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadSavedSearches();
  }, []);

  const loadSavedSearches = async () => {
    if (!user?.access_token) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await apiClient.getSavedSearches(user.access_token);

      if (response.success && response.data) {
        setSearches(response.data.data || response.data);
      } else {
        setError(response.error || 'Failed to load saved searches');
      }
    } catch (err) {
      setError('An error occurred while loading searches');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (searchId: string) => {
    if (!user?.access_token) return;
    if (!confirm('Are you sure you want to delete this saved search?')) return;

    try {
      const response = await apiClient.deleteSavedSearch(user.access_token, searchId);

      if (response.success) {
        // Remove from list
        setSearches(searches.filter(s => s.id !== searchId));
      } else {
        alert(response.error || 'Failed to delete search');
      }
    } catch (err) {
      alert('An error occurred while deleting');
    }
  };

  const handleRunSearch = (query: string) => {
    // Navigate to search page with pre-filled query
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Saved Searches</h1>
              <p className="text-gray-600 mt-1">
                Your saved property searches
              </p>
            </div>
            <button
              onClick={() => router.push('/search')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
            >
              New Search
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading */}
        {isLoading && (
          <div className="text-center py-12">
            <svg
              className="animate-spin h-12 w-12 text-blue-600 mx-auto"
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
            <p className="mt-4 text-gray-600">Loading saved searches...</p>
          </div>
        )}

        {/* Error */}
        {error && !isLoading && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && searches.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No saved searches</h3>
            <p className="mt-2 text-gray-500">
              Save your searches to quickly access them later
            </p>
            <button
              onClick={() => router.push('/search')}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
            >
              Start Searching
            </button>
          </div>
        )}

        {/* Saved Searches List */}
        {!isLoading && searches.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {searches.map((search) => (
              <div
                key={search.id}
                className="bg-white rounded-lg shadow hover:shadow-md transition p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {search.search_query}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Saved {new Date(search.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(search.id)}
                    className="text-red-600 hover:text-red-700 ml-2"
                    title="Delete"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>

                <button
                  onClick={() => handleRunSearch(search.search_query)}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition flex items-center justify-center"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  Run Search
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

