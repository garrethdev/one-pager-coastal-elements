'use client';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  image_url: string;
  property_type: string;
}

interface SearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export function SearchResults({ results, isLoading, pagination }: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="mt-8">
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
          <p className="mt-4 text-gray-600">Searching properties...</p>
        </div>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="mt-8 text-center py-12 bg-white rounded-lg shadow">
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
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-900">No results yet</h3>
        <p className="mt-2 text-gray-500">
          Start searching to find properties that match your criteria
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      {/* Results Header */}
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Search Results ({pagination?.total || results.length})
        </h2>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((result) => (
          <div
            key={result.id}
            className="bg-white rounded-lg shadow hover:shadow-lg transition duration-200 overflow-hidden"
          >
            {/* Image */}
            <div className="h-48 bg-gray-200 relative">
              {result.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={result.image_url}
                  alt={result.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/images/placeholder-property.jpg';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100">
                  <svg
                    className="w-16 h-16 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </div>
              )}
              {/* Property Type Badge */}
              <div className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                {result.property_type}
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                {result.title}
              </h3>
              
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {result.description}
              </p>

              <div className="flex items-center text-gray-500 text-sm mb-3">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {result.location}
              </div>

              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold text-green-600">
                  ${result.price.toLocaleString()}
                </div>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination (Future) */}
      {pagination && pagination.pages > 1 && (
        <div className="mt-8 flex justify-center">
          <div className="text-sm text-gray-600">
            Page {pagination.page} of {pagination.pages}
          </div>
        </div>
      )}
    </div>
  );
}


