'use client';

import { useState } from 'react';

interface SearchFormProps {
  onSearch: (query: string, filters: Record<string, unknown>) => void;
  isLoading: boolean;
}

interface QuickFilterState {
  absenteeOwner: boolean;
  ownerOccupied: boolean;
  propertyVacant: boolean;
  freeAndClear: boolean;
  preforeclosureStatus: boolean;
  tiredLandlord: boolean;
  landVacantlot: boolean;
}

export function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Boolean toggles (no additional values needed)
  const [quickFilter, setQuickFilter] = useState<QuickFilterState>({
    absenteeOwner: false,
    ownerOccupied: false,
    propertyVacant: false,
    freeAndClear: false,
    preforeclosureStatus: false,
    tiredLandlord: false,
    landVacantlot: false,
  });

  // Value fields (require inputs)
  const [quickFilterValues, setQuickFilterValues] = useState({
    estimatedEquityRateMin: '',
    taxDelinquentYearMin: '',
    purchaseDateMin: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) {
      alert('Please enter a search query');
      return;
    }

    // Build quickFilter object with only true keys
    const enabledQuickFilter: Record<string, boolean> = {};
    Object.entries(quickFilter).forEach(([k, v]) => {
      if (v) enabledQuickFilter[k] = true;
    });

    // Build quickFilterValues object with only non-empty values
    const enabledQuickFilterValues: Record<string, string | number> = {};
    if (quickFilterValues.estimatedEquityRateMin)
      enabledQuickFilterValues.estimatedEquityRateMin = parseInt(quickFilterValues.estimatedEquityRateMin);
    if (quickFilterValues.taxDelinquentYearMin)
      enabledQuickFilterValues.taxDelinquentYearMin = parseInt(quickFilterValues.taxDelinquentYearMin);
    if (quickFilterValues.purchaseDateMin)
      enabledQuickFilterValues.purchaseDateMin = quickFilterValues.purchaseDateMin;

    const filters: Record<string, unknown> = {
      location: location || undefined,
      property_type: propertyType || undefined,
      min_price: minPrice ? parseInt(minPrice) : undefined,
      max_price: maxPrice ? parseInt(maxPrice) : undefined,
      quickFilter: Object.keys(enabledQuickFilter).length > 0 ? enabledQuickFilter : undefined,
      quickFilterValues: Object.keys(enabledQuickFilterValues).length > 0 ? enabledQuickFilterValues : undefined,
    };

    onSearch(query, filters);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Search Bar */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            Search Query
          </label>
          <input
            type="text"
            id="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., Phoenix, AZ or Miami, FL..."
            disabled={isLoading}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-100 transition"
          />
        </div>

        {/* Basic Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, State or ZIP"
              disabled={isLoading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-100 transition"
            />
          </div>

          {/* Property Type */}
          <div>
            <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-2">
              Property Type
            </label>
            <select
              id="propertyType"
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-100 transition"
            >
              <option value="">All Types</option>
              <option value="Single Family">Single Family</option>
              <option value="Condo">Condo</option>
              <option value="Townhouse">Townhouse</option>
              <option value="Multi-Family">Multi-Family</option>
              <option value="Land">Land</option>
            </select>
          </div>

          {/* Min Price */}
          <div>
            <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 mb-2">
              Min Price
            </label>
            <input
              type="number"
              id="minPrice"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="Min price"
              disabled={isLoading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-100 transition"
            />
          </div>

          {/* Max Price */}
          <div>
            <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-2">
              Max Price
            </label>
            <input
              type="number"
              id="maxPrice"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Max price"
              disabled={isLoading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-100 transition"
            />
          </div>
        </div>

        {/* Quick Filters Section */}
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Quick Filters
          </h3>

          {/* Boolean Toggles */}
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-3 font-medium">Property Characteristics (Toggle ON/OFF)</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { key: 'absenteeOwner', label: 'Absentee Owner', icon: '🏠' },
                { key: 'ownerOccupied', label: 'Owner Occupied', icon: '👤' },
                { key: 'propertyVacant', label: 'Vacant Property', icon: '🔑' },
                { key: 'freeAndClear', label: 'Free & Clear', icon: '💰' },
                { key: 'preforeclosureStatus', label: 'Pre-Foreclosure', icon: '⚠️' },
                { key: 'tiredLandlord', label: 'Tired Landlord', icon: '🏢' },
                { key: 'landVacantlot', label: 'Land / Vacant Lot', icon: '🌳' },
              ].map(({ key, label, icon }) => {
                const isChecked = quickFilter[key as keyof QuickFilterState];
                return (
                  <label key={key} className="relative flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 cursor-pointer transition group">
                    <input
                      type="checkbox"
                      className="sr-only"
                      disabled={isLoading}
                      checked={isChecked}
                      onChange={(e) =>
                        setQuickFilter((prev) => ({ ...prev, [key]: e.target.checked }))
                      }
                    />
                    <div className={`flex items-center space-x-2 ${isChecked ? 'text-blue-600' : 'text-gray-600'}`}>
                      <div className={`w-5 h-5 border-2 rounded flex items-center justify-center ${isChecked ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                        {isChecked && <span className="text-white text-xs">✓</span>}
                      </div>
                    <span className="text-lg">{icon}</span>
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Value Fields */}
          <div className="border-t border-gray-200 pt-4">
            <p className="text-xs text-gray-500 mb-3 font-medium">Advanced Filters (Enter Values)</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="equityMin" className="block text-sm font-medium text-gray-700 mb-2">
                  Min Equity Rate (%)
                </label>
                <input
                  type="number"
                  id="equityMin"
                  value={quickFilterValues.estimatedEquityRateMin}
                  onChange={(e) =>
                    setQuickFilterValues((prev) => ({
                      ...prev,
                      estimatedEquityRateMin: e.target.value,
                    }))
                  }
                  placeholder="e.g., 60"
                  min="0"
                  max="100"
                  disabled={isLoading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-100 transition"
                />
              </div>

              <div>
                <label htmlFor="taxDelinquentYear" className="block text-sm font-medium text-gray-700 mb-2">
                  Tax Delinquent Year
                </label>
                <input
                  type="number"
                  id="taxDelinquentYear"
                  value={quickFilterValues.taxDelinquentYearMin}
                  onChange={(e) =>
                    setQuickFilterValues((prev) => ({
                      ...prev,
                      taxDelinquentYearMin: e.target.value,
                    }))
                  }
                  placeholder="e.g., 2022"
                  min="2000"
                  max="2030"
                  disabled={isLoading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-100 transition"
                />
              </div>

              <div>
                <label htmlFor="purchaseDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Purchase Date (YYYY-MM-DD)
                </label>
                <input
                  type="date"
                  id="purchaseDate"
                  value={quickFilterValues.purchaseDateMin}
                  onChange={(e) =>
                    setQuickFilterValues((prev) => ({
                      ...prev,
                      purchaseDateMin: e.target.value,
                    }))
                  }
                  disabled={isLoading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-100 transition"
                />
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-3 bg-blue-50 p-2 rounded-lg">
            💡 <strong>Quick Filters:</strong> Toggles use AND logic (all selected must match). Value fields are optional.
          </p>
        </div>

        {/* Search Button */}
        <div>
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-[1.01]"
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
                Searching...
              </>
            ) : (
              <>
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
                Search Properties
              </>
            )}
          </button>
        </div>

        {/* Cost Notice */}
        <div className="text-center text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
          💳 <strong>Credits:</strong> Each search costs 1 credit. Results limited to 25 per page.
        </div>
      </form>
    </div>
  );
}
