'use client';

import { useState } from 'react';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { useAuth } from '../context/AuthContext';
import { SearchForm } from '../components/search/SearchForm';
import { SearchResults, SearchResult } from '../components/search/SearchResults';
import { apiClient } from '../lib/api-client';

export default function SearchPage() {
  return (
    <ProtectedRoute>
      <SearchPageContent />
    </ProtectedRoute>
  );
}

interface SearchInfo {
  creditsUsed: number;
  remainingCredits: number;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

function SearchPageContent() {
  const { user, profile, refreshProfile } = useAuth();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchInfo, setSearchInfo] = useState<SearchInfo | null>(null);
  const [lastQuery, setLastQuery] = useState('');
  const [lastFilters, setLastFilters] = useState<Record<string, unknown>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleSearch = async (query: string, filters: Record<string, unknown>) => {
    setLastQuery(query); // Save last query for saving later
    setLastFilters(filters); // Save filters for export
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
        1 // limit per AC (matches BATCHDATA_DEFAULT_TAKE in backend .env)
      );

      if (response.success && response.data) {
        setResults(response.data as SearchResult[]);
        setSearchInfo({
          creditsUsed: response.credits_used || 1,
          remainingCredits: response.remaining_credits || 0,
          pagination: response.pagination,
        });

        // Refresh profile to update credits
        await refreshProfile();
      } else {
        setError(response.error || 'Search failed');
        setResults([]);
      }
    } catch {
      setError('An error occurred');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSearch = async () => {
    if (!user?.access_token || !lastQuery) return;

    setIsSaving(true);
    try {
      const response = await apiClient.saveSearch(user.access_token, lastQuery);

      if (response.success) {
        alert('Search saved successfully!');
      } else {
        alert(response.error || 'Failed to save search');
      }
    } catch {
      alert('An error occurred while saving');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = async () => {
    if (!user?.access_token) {
      setError('Please login to export');
      return;
    }

    if (!lastQuery && !lastFilters) {
      setError('Please perform a search first before exporting');
      return;
    }

    // Check credits before export
    if (profile && profile.current_credits < 1) {
      setError('Insufficient credits. You need at least 1 credit to export.');
      return;
    }

    setIsExporting(true);
    setError('');
    
    try {
      const response = await apiClient.exportSearchToCsv(
        user.access_token,
        lastQuery || '',
        lastFilters || {}
      );

      if (response.success && response.data) {
        // Create blob and download
        const csvContent = response.data.csv;
        const filename = response.data.filename || `property-export-${Date.now()}.csv`;
        const totalProperties = response.data.total_properties || 0;
        const creditsUsed = response.credits_used || 0;
        
        if (!csvContent || csvContent === 'No properties found') {
          alert('No properties found to export. Try different search criteria.');
          setIsExporting(false);
          return;
        }
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url); // Clean up

        // Refresh profile to update credits
        await refreshProfile();

        alert(`✅ Successfully exported ${totalProperties} properties!${creditsUsed > 0 ? ` (Used ${creditsUsed} credit)` : ''}`);
      } else {
        setError(response.error || 'Failed to export');
        alert(response.error || 'Failed to export');
      }
    } catch (err) {
      console.error('Export error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Export failed: ${errorMessage}`);
      alert(`An error occurred while exporting: ${errorMessage}`);
    } finally {
      setIsExporting(false);
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
              <div className="flex-1">
                <p className="text-blue-900 font-semibold">
                  Search Complete!
                </p>
                <p className="text-blue-700 text-sm">
                  Found {searchInfo.pagination?.total || results.length} results
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-blue-700 text-sm">Credits Used: {searchInfo.creditsUsed}</p>
                  <p className="text-blue-900 font-semibold">
                    Remaining: {searchInfo.remainingCredits}
                  </p>
                </div>
                <button
                  onClick={handleSaveSearch}
                  disabled={isSaving}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition disabled:bg-green-300 flex items-center"
                >
                  {isSaving ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Save Search
                    </>
                  )}
                </button>
                <button
                  onClick={handleExport}
                  disabled={isExporting}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition disabled:bg-purple-300 flex items-center"
                >
                  {isExporting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Exporting...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Export CSV
                    </>
                  )}
                </button>
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

