import React from 'react';
import { Link } from 'react-router-dom';
import { EUROPEAN_COUNTRIES } from '../../data/countries';

interface CountryMenuProps {
  mobile?: boolean;
  onSelect?: () => void;
}

export function CountryMenu({ mobile, onSelect }: CountryMenuProps) {
  if (mobile) {
    return (
      <>
        {EUROPEAN_COUNTRIES.map((country) => (
          <Link
            key={country.name}
            to={`/zoeken?country=${encodeURIComponent(country.name)}`}
            className="block py-2 text-gray-600 hover:text-blue-600"
            onClick={onSelect}
          >
            <span className="mr-2">{country.flag}</span>
            {country.name}
          </Link>
        ))}
      </>
    );
  }

  return (
    <div className="absolute top-full left-0 mt-2 w-96 bg-white rounded-lg shadow-lg border p-4 max-h-[80vh] overflow-y-auto">
      <div className="grid grid-cols-2 gap-2">
        {EUROPEAN_COUNTRIES.map((country) => (
          <Link
            key={country.name}
            to={`/zoeken?country=${encodeURIComponent(country.name)}`}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50"
          >
            <span>{country.flag}</span>
            <span className="text-gray-700">{country.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}