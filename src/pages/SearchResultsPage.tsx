import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PropertyCard } from '../components/ui/PropertyCard';
import { SearchFilters } from '../components/search/SearchFilters';
import { useSearch } from '../hooks/useSearch';

export function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const { results, loading, error } = useSearch();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [searchParams]);

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {searchParams.get('country') 
            ? `Woningen in ${searchParams.get('country')}` 
            : searchParams.get('city')
            ? `Woningen in ${searchParams.get('city')}`
            : 'Alle woningen'}
        </h1>
        <p className="text-gray-600">
          {results.length} resultaten gevonden
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside>
          <SearchFilters />
        </aside>

        <div className="lg:col-span-3">
          {loading ? (
            <div className="text-center py-8">Zoeken...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">{error}</div>
          ) : results.length === 0 ? (
            <div className="text-center py-8">
              Geen woningen gevonden voor deze zoekcriteria
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {results.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}