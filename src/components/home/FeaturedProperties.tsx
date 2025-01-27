import React from 'react';
import { PropertyCard } from '../ui/PropertyCard';
import { useProperties } from '../../contexts/PropertyContext';
import { LoadingSpinner } from '../LoadingSpinner';

export function FeaturedProperties() {
  const { properties, loading, error } = useProperties();
  const featuredProperties = properties.filter(property => property.featured);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        {error}
      </div>
    );
  }

  if (featuredProperties.length === 0) {
    return null;
  }

  return (
    <section className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">Uitgelichte Woningen</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </section>
  );
}