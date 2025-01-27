import React, { useState, useEffect } from 'react';
import { MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { TOP_COUNTRIES, EUROPEAN_COUNTRIES } from '../../../data/countries';
import { useFilter } from '../../../hooks/useFilter';

export function CountryFilter() {
  const [searchParams] = useSearchParams();
  const [showAllCountries, setShowAllCountries] = useState(false);
  const { updateFilter } = useFilter();

  // Get selected countries from URL parameters
  const selectedCountries = searchParams.get('country')?.split(',') || [];

  // Effect to show all countries if a non-top country is selected
  useEffect(() => {
    if (selectedCountries.some(country => !TOP_COUNTRIES.includes(country))) {
      setShowAllCountries(true);
    }
  }, [selectedCountries]);

  const handleCountryChange = (country: string) => {
    const newSelectedCountries = selectedCountries.includes(country)
      ? selectedCountries.filter(c => c !== country)
      : [...selectedCountries, country];
    
    updateFilter('country', newSelectedCountries.length > 0 ? newSelectedCountries.join(',') : '');
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
        <MapPin className="w-5 h-5" />
        Landen
      </h3>
      <div className="space-y-2">
        {TOP_COUNTRIES.map(country => {
          const countryData = EUROPEAN_COUNTRIES.find(c => c.name === country);
          if (!countryData) return null;
          
          return (
            <label key={country} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedCountries.includes(country)}
                onChange={() => handleCountryChange(country)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm">
                {countryData.flag} {country}
              </span>
            </label>
          );
        })}

        <button
          onClick={() => setShowAllCountries(!showAllCountries)}
          className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          {showAllCountries ? (
            <>
              <ChevronUp className="w-4 h-4" />
              Minder landen tonen
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              Meer landen tonen
            </>
          )}
        </button>

        {showAllCountries && (
          <div className="pt-2 space-y-2">
            {EUROPEAN_COUNTRIES
              .filter(country => !TOP_COUNTRIES.includes(country.name))
              .map(country => (
                <label key={country.name} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedCountries.includes(country.name)}
                    onChange={() => handleCountryChange(country.name)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">
                    {country.flag} {country.name}
                  </span>
                </label>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}