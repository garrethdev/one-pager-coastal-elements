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
  highEquity: boolean; // ≥40% equity
  cashBuyers: boolean; // Cash buyers (12 mo)
  onMarket: boolean; // On market
}

export function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Property filters (Column C - FE Input)
  const [beds, setBeds] = useState({ min: '', max: '' });
  const [baths, setBaths] = useState({ min: '', max: '' });
  const [squareFeet, setSquareFeet] = useState({ min: '', max: '' });
  const [lotSizeAcres, setLotSizeAcres] = useState({ min: '', max: '' });
  const [yearBuilt, setYearBuilt] = useState({ min: '', max: '' });
  const [storyCount, setStoryCount] = useState({ min: '', max: '' });

  // Boolean toggles (quick filters)
  const [quickFilter, setQuickFilter] = useState<QuickFilterState>({
    absenteeOwner: false,
    ownerOccupied: false,
    propertyVacant: false,
    freeAndClear: false,
    preforeclosureStatus: false,
    tiredLandlord: false,
    landVacantlot: false,
    highEquity: false,
    cashBuyers: false,
    onMarket: false,
  });

  // Value fields (quick filter values)
  const [quickFilterValues, setQuickFilterValues] = useState({
    estimatedEquityRateMin: '', // Maps to valuation.equityPercent.min
    taxDelinquentYearMin: '', // Maps to tax.taxDelinquentYear.min
    purchaseDateMin: '', // Maps to sale.lastSaleDate.minDate
  });

  // Owner filters
  const [ownerStatusType, setOwnerStatusType] = useState<string[]>([]);

  // Sale filters
  const [lastSaleDate, setLastSaleDate] = useState({ minDate: '', maxDate: '' });
  const [lastSalePrice, setLastSalePrice] = useState({ min: '', max: '' });

  // Valuation/Equity filters
  const [equityPercent, setEquityPercent] = useState({ min: '', max: '' });
  const [totalAssessedValue, setTotalAssessedValue] = useState({ min: '', max: '' });
  const [assessedLandValue, setAssessedLandValue] = useState({ min: '', max: '' });
  const [ltv, setLtv] = useState({ min: '', max: '' });

  // Mortgage/OpenLien filters
  const [allLoanTypes, setAllLoanTypes] = useState<string[]>([]);
  const [firstLoanInterestRate, setFirstLoanInterestRate] = useState({ min: '', max: '' });
  const [totalOpenLienCount, setTotalOpenLienCount] = useState({ min: '', max: '' });
  const [totalOpenLienBalance, setTotalOpenLienBalance] = useState({ min: '', max: '' });

  // Foreclosure filters
  const [foreclosureStatus, setForeclosureStatus] = useState<string[]>([]);
  const [foreclosureRecordingDate, setForeclosureRecordingDate] = useState({ minDate: '', maxDate: '' });
  const [foreclosureAuctionDate, setForeclosureAuctionDate] = useState({ minDate: '', maxDate: '' });

  // Tax filters
  const [taxDelinquentYear, setTaxDelinquentYear] = useState({ min: '' });

  // Involuntary Lien filters
  const [lienAmount, setLienAmount] = useState({ min: '', max: '' });
  const [lienType, setLienType] = useState<string[]>([]);

  // Owner Profile filters
  const [ownerPropertiesCount, setOwnerPropertiesCount] = useState({ min: '', max: '' });

  // Market filters
  const [daysOnMarket, setDaysOnMarket] = useState({ min: '', max: '' });
  const [listingPrice, setListingPrice] = useState({ min: '', max: '' });

  // Collapsible sections
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

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

    // Helper to build range objects
    const buildRange = (min: string, max: string) => {
      if (!min && !max) return undefined;
      return {
        min: min ? (isNaN(parseInt(min)) ? undefined : parseInt(min)) : undefined,
        max: max ? (isNaN(parseInt(max)) ? undefined : parseInt(max)) : undefined,
      };
    };

    const buildDateRange = (minDate: string, maxDate: string) => {
      if (!minDate && !maxDate) return undefined;
      return {
        minDate: minDate || undefined,
        maxDate: maxDate || undefined,
      };
    };

    const filters: Record<string, unknown> = {
      // Location & Basic
      location: location || undefined,
      property_type: propertyType || undefined,
      min_price: minPrice ? parseInt(minPrice) : undefined,
      max_price: maxPrice ? parseInt(maxPrice) : undefined,
      
      // Property filters (Column C → Column H mapping)
      beds: buildRange(beds.min, beds.max),
      baths: buildRange(baths.min, baths.max),
      squareFeet: buildRange(squareFeet.min, squareFeet.max),
      lotSizeAcres: buildRange(lotSizeAcres.min, lotSizeAcres.max),
      yearBuilt: buildRange(yearBuilt.min, yearBuilt.max),
      storyCount: buildRange(storyCount.min, storyCount.max),
      
      // Quick filters
      quickFilter: Object.keys(enabledQuickFilter).length > 0 ? enabledQuickFilter : undefined,
      quickFilterValues: Object.keys(enabledQuickFilterValues).length > 0 ? enabledQuickFilterValues : undefined,
      
      // Owner filters
      ownerStatusType: ownerStatusType.length > 0 ? ownerStatusType : undefined,
      
      // Sale filters
      lastSaleDate: buildDateRange(lastSaleDate.minDate, lastSaleDate.maxDate),
      lastSalePrice: buildRange(lastSalePrice.min, lastSalePrice.max),
      
      // Valuation/Equity filters
      // High Equity quick filter (≥40%) - if enabled, set min to 40
      equityPercent: quickFilter.highEquity 
        ? { min: Math.max(40, equityPercent.min ? parseInt(equityPercent.min) : 40) }
        : buildRange(equityPercent.min, equityPercent.max),
      totalAssessedValue: buildRange(totalAssessedValue.min, totalAssessedValue.max),
      assessedLandValue: buildRange(assessedLandValue.min, assessedLandValue.max),
      ltv: buildRange(ltv.min, ltv.max),
      
      // Mortgage/OpenLien filters
      allLoanTypes: allLoanTypes.length > 0 ? allLoanTypes : undefined,
      firstLoanInterestRate: buildRange(firstLoanInterestRate.min, firstLoanInterestRate.max),
      totalOpenLienCount: buildRange(totalOpenLienCount.min, totalOpenLienCount.max),
      totalOpenLienBalance: buildRange(totalOpenLienBalance.min, totalOpenLienBalance.max),
      
      // Foreclosure filters
      foreclosureStatus: foreclosureStatus.length > 0 ? foreclosureStatus : undefined,
      foreclosureRecordingDate: buildDateRange(foreclosureRecordingDate.minDate, foreclosureRecordingDate.maxDate),
      foreclosureAuctionDate: buildDateRange(foreclosureAuctionDate.minDate, foreclosureAuctionDate.maxDate),
      
      // Tax filters
      taxDelinquentYear: taxDelinquentYear.min ? { min: parseInt(taxDelinquentYear.min) } : undefined,
      
      // Involuntary Lien filters
      lienAmount: buildRange(lienAmount.min, lienAmount.max),
      lienType: lienType.length > 0 ? lienType : undefined,
      
      // Owner Profile filters
      ownerPropertiesCount: buildRange(ownerPropertiesCount.min, ownerPropertiesCount.max),
      
      // Market filters
      daysOnMarket: buildRange(daysOnMarket.min, daysOnMarket.max),
      listingPrice: buildRange(listingPrice.min, listingPrice.max),
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

          {/* Property Type - Column C spec values */}
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
              <option value="SFR">SFR</option>
              <option value="Condo">Condo</option>
              <option value="2-4 Unit">2-4 Unit</option>
              <option value="5+">5+</option>
              <option value="Land/Vacant">Land/Vacant</option>
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
                { key: 'highEquity', label: 'High Equity (≥40%)', icon: '📈' },
                { key: 'absenteeOwner', label: 'Absentee Owner', icon: '🏠' },
                { key: 'ownerOccupied', label: 'Owner Occupied', icon: '👤' },
                { key: 'propertyVacant', label: 'Vacant Property', icon: '🔑' },
                { key: 'freeAndClear', label: 'Free & Clear', icon: '💰' },
                { key: 'preforeclosureStatus', label: 'Pre-Foreclosure', icon: '⚠️' },
                { key: 'tiredLandlord', label: 'Tired Landlord', icon: '🏢' },
                { key: 'cashBuyers', label: 'Cash Buyers (12 mo)', icon: '💵' },
                { key: 'landVacantlot', label: 'Land / Vacant Lot', icon: '🌳' },
                { key: 'onMarket', label: 'On Market', icon: '🏪' },
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

        {/* Property Details Filters (Column C spec) */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-gray-900 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Property Details
            </h3>
            <button
              type="button"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {showAdvancedFilters ? 'Hide Advanced' : 'Show Advanced'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Beds */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Beds</label>
              <div className="flex gap-2">
                <input type="number" placeholder="Min" min="0" max="10" value={beds.min} onChange={(e) => setBeds({ ...beds, min: e.target.value })} disabled={isLoading} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100" />
                <input type="number" placeholder="Max" min="0" max="10" value={beds.max} onChange={(e) => setBeds({ ...beds, max: e.target.value })} disabled={isLoading} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100" />
              </div>
            </div>

            {/* Baths */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Baths</label>
              <div className="flex gap-2">
                <input type="number" placeholder="Min" min="0" max="10" value={baths.min} onChange={(e) => setBaths({ ...baths, min: e.target.value })} disabled={isLoading} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100" />
                <input type="number" placeholder="Max" min="0" max="10" value={baths.max} onChange={(e) => setBaths({ ...baths, max: e.target.value })} disabled={isLoading} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100" />
              </div>
            </div>

            {/* Square Feet */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Building Area (SqFt)</label>
              <div className="flex gap-2">
                <input type="number" placeholder="Min" min="0" value={squareFeet.min} onChange={(e) => setSquareFeet({ ...squareFeet, min: e.target.value })} disabled={isLoading} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100" />
                <input type="number" placeholder="Max" min="0" value={squareFeet.max} onChange={(e) => setSquareFeet({ ...squareFeet, max: e.target.value })} disabled={isLoading} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100" />
              </div>
            </div>

            {/* Lot Size Acres */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Lot Size (Acres)</label>
              <div className="flex gap-2">
                <input type="number" placeholder="Min" min="0" step="0.01" value={lotSizeAcres.min} onChange={(e) => setLotSizeAcres({ ...lotSizeAcres, min: e.target.value })} disabled={isLoading} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100" />
                <input type="number" placeholder="Max" min="0" step="0.01" value={lotSizeAcres.max} onChange={(e) => setLotSizeAcres({ ...lotSizeAcres, max: e.target.value })} disabled={isLoading} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100" />
              </div>
            </div>

            {/* Year Built */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Year Built</label>
              <div className="flex gap-2">
                <input type="number" placeholder="Min" min="1900" max="2025" value={yearBuilt.min} onChange={(e) => setYearBuilt({ ...yearBuilt, min: e.target.value })} disabled={isLoading} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100" />
                <input type="number" placeholder="Max" min="1900" max="2025" value={yearBuilt.max} onChange={(e) => setYearBuilt({ ...yearBuilt, max: e.target.value })} disabled={isLoading} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100" />
              </div>
            </div>

            {/* Stories */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stories</label>
              <div className="flex gap-2">
                <input type="number" placeholder="Min" min="1" max="5" value={storyCount.min} onChange={(e) => setStoryCount({ ...storyCount, min: e.target.value })} disabled={isLoading} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100" />
                <input type="number" placeholder="Max" min="1" max="5" value={storyCount.max} onChange={(e) => setStoryCount({ ...storyCount, max: e.target.value })} disabled={isLoading} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100" />
              </div>
            </div>
          </div>

          {/* Advanced Filters (Collapsible) */}
          {showAdvancedFilters && (
            <div className="mt-6 space-y-6 border-t border-gray-200 pt-6">
              {/* Valuation/Equity Section */}
              <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-3">Valuation & Equity</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Equity % (Min/Max)</label>
                    <div className="flex gap-2">
                      <input type="number" placeholder="Min %" min="0" max="100" value={equityPercent.min} onChange={(e) => setEquityPercent({ ...equityPercent, min: e.target.value })} disabled={isLoading} className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100" />
                      <input type="number" placeholder="Max %" min="0" max="100" value={equityPercent.max} onChange={(e) => setEquityPercent({ ...equityPercent, max: e.target.value })} disabled={isLoading} className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Total Assessed Value</label>
                    <div className="flex gap-2">
                      <input type="number" placeholder="Min $" value={totalAssessedValue.min} onChange={(e) => setTotalAssessedValue({ ...totalAssessedValue, min: e.target.value })} disabled={isLoading} className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100" />
                      <input type="number" placeholder="Max $" value={totalAssessedValue.max} onChange={(e) => setTotalAssessedValue({ ...totalAssessedValue, max: e.target.value })} disabled={isLoading} className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Assessed Land Value</label>
                    <div className="flex gap-2">
                      <input type="number" placeholder="Min $" value={assessedLandValue.min} onChange={(e) => setAssessedLandValue({ ...assessedLandValue, min: e.target.value })} disabled={isLoading} className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100" />
                      <input type="number" placeholder="Max $" value={assessedLandValue.max} onChange={(e) => setAssessedLandValue({ ...assessedLandValue, max: e.target.value })} disabled={isLoading} className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">LTV (Loan-to-Value) %</label>
                    <div className="flex gap-2">
                      <input type="number" placeholder="Min %" min="0" max="100" value={ltv.min} onChange={(e) => setLtv({ ...ltv, min: e.target.value })} disabled={isLoading} className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100" />
                      <input type="number" placeholder="Max %" min="0" max="100" value={ltv.max} onChange={(e) => setLtv({ ...ltv, max: e.target.value })} disabled={isLoading} className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Sale Section */}
              <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-3">Sale Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Last Sale Date</label>
                    <div className="flex gap-2">
                      <input type="date" value={lastSaleDate.minDate} onChange={(e) => setLastSaleDate({ ...lastSaleDate, minDate: e.target.value })} disabled={isLoading} className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100" />
                      <input type="date" value={lastSaleDate.maxDate} onChange={(e) => setLastSaleDate({ ...lastSaleDate, maxDate: e.target.value })} disabled={isLoading} className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Last Sale Price</label>
                    <div className="flex gap-2">
                      <input type="number" placeholder="Min $" value={lastSalePrice.min} onChange={(e) => setLastSalePrice({ ...lastSalePrice, min: e.target.value })} disabled={isLoading} className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100" />
                      <input type="number" placeholder="Max $" value={lastSalePrice.max} onChange={(e) => setLastSalePrice({ ...lastSalePrice, max: e.target.value })} disabled={isLoading} className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Market Section */}
              <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-3">Market Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Days on Market</label>
                    <div className="flex gap-2">
                      <input type="number" placeholder="Min" min="0" value={daysOnMarket.min} onChange={(e) => setDaysOnMarket({ ...daysOnMarket, min: e.target.value })} disabled={isLoading} className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100" />
                      <input type="number" placeholder="Max" min="0" value={daysOnMarket.max} onChange={(e) => setDaysOnMarket({ ...daysOnMarket, max: e.target.value })} disabled={isLoading} className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Listing Price</label>
                    <div className="flex gap-2">
                      <input type="number" placeholder="Min $" value={listingPrice.min} onChange={(e) => setListingPrice({ ...listingPrice, min: e.target.value })} disabled={isLoading} className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100" />
                      <input type="number" placeholder="Max $" value={listingPrice.max} onChange={(e) => setListingPrice({ ...listingPrice, max: e.target.value })} disabled={isLoading} className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Mortgage/OpenLien Section */}
              <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-3">Mortgage & Liens</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">First Loan Interest Rate (%)</label>
                    <div className="flex gap-2">
                      <input type="number" placeholder="Min %" min="0" max="20" step="0.1" value={firstLoanInterestRate.min} onChange={(e) => setFirstLoanInterestRate({ ...firstLoanInterestRate, min: e.target.value })} disabled={isLoading} className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100" />
                      <input type="number" placeholder="Max %" min="0" max="20" step="0.1" value={firstLoanInterestRate.max} onChange={(e) => setFirstLoanInterestRate({ ...firstLoanInterestRate, max: e.target.value })} disabled={isLoading} className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Total Open Lien Count</label>
                    <div className="flex gap-2">
                      <input type="number" placeholder="Min" min="0" value={totalOpenLienCount.min} onChange={(e) => setTotalOpenLienCount({ ...totalOpenLienCount, min: e.target.value })} disabled={isLoading} className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100" />
                      <input type="number" placeholder="Max" min="0" value={totalOpenLienCount.max} onChange={(e) => setTotalOpenLienCount({ ...totalOpenLienCount, max: e.target.value })} disabled={isLoading} className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Total Open Lien Balance</label>
                    <div className="flex gap-2">
                      <input type="number" placeholder="Min $" value={totalOpenLienBalance.min} onChange={(e) => setTotalOpenLienBalance({ ...totalOpenLienBalance, min: e.target.value })} disabled={isLoading} className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100" />
                      <input type="number" placeholder="Max $" value={totalOpenLienBalance.max} onChange={(e) => setTotalOpenLienBalance({ ...totalOpenLienBalance, max: e.target.value })} disabled={isLoading} className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Tax Delinquent Year</label>
                    <input type="number" placeholder="Min year" min="2000" max="2030" value={taxDelinquentYear.min} onChange={(e) => setTaxDelinquentYear({ min: e.target.value })} disabled={isLoading} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100" />
                  </div>
                </div>
              </div>

              {/* Owner Profile Section */}
              <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-3">Owner Profile</h4>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Owner Properties Count</label>
                  <div className="flex gap-2">
                    <input type="number" placeholder="Min" min="0" value={ownerPropertiesCount.min} onChange={(e) => setOwnerPropertiesCount({ ...ownerPropertiesCount, min: e.target.value })} disabled={isLoading} className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100" />
                    <input type="number" placeholder="Max" min="0" value={ownerPropertiesCount.max} onChange={(e) => setOwnerPropertiesCount({ ...ownerPropertiesCount, max: e.target.value })} disabled={isLoading} className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100" />
                  </div>
                </div>
              </div>
            </div>
          )}
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
          💳 <strong>Credits:</strong> Each search costs 1 credit. Results limited to 1 per page.
        </div>
      </form>
    </div>
  );
}
