import React from 'react';
import { Heart, Bed, Bath, Square, MapPin, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Property } from '../../types';
import { useFavorites } from '../../hooks/useFavorites';

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(property.id);

  return (
    <Link 
      to={`/woning/${property.id}`}
      className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="relative">
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-36 sm:h-48 object-cover rounded-t-xl"
        />
        <button 
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(property.id);
          }}
        >
          <Heart className={`w-5 h-5 ${favorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
        </button>
        <div className="absolute top-3 left-3 flex gap-1">
          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
            {property.type === 'koop' ? 'Te koop' : 'Te huur'}
          </span>
          {property.featured && (
            <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
              Uitgelicht
            </span>
          )}
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold">€ {property.price.toLocaleString()}</h3>
        </div>
        <div className="flex items-center gap-2 text-gray-600 mb-3">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <p className="truncate text-sm sm:text-base">
            {property.address}, {property.city}, {property.country}
          </p>
        </div>
        <div className="flex items-center gap-4 text-gray-500 text-sm sm:text-base">
          <div className="flex items-center gap-1">
            <Bed className="w-4 h-4" />
            <span>{property.bedrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-4 h-4" />
            <span>{property.bathrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <Square className="w-4 h-4" />
            <span>{property.size}m²</span>
          </div>
        </div>
        {property.makelaarId !== 'admin' && (
          <div className="mt-3 flex items-center gap-2 text-gray-600 text-sm border-t pt-3">
            <Building2 className="w-4 h-4" />
            <span>{property.makelaarId}</span>
          </div>
        )}
      </div>
    </Link>
  );
}