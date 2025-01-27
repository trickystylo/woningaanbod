import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Euro, Calendar, Home as HomeIcon, Edit } from 'lucide-react';
import { PropertyGallery } from '../components/property/PropertyGallery';
import { PropertyFeatures } from '../components/property/PropertyFeatures';
import { PropertyContact } from '../components/property/PropertyContact';
import { BackButton } from '../components/ui/BackButton';
import { useProperties } from '../contexts/PropertyContext';
import { useUserRole } from '../hooks/useUserRole';

export function PropertyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { properties } = useProperties();
  const { isAdmin, isRealtor } = useUserRole();
  const property = properties.find(p => p.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleEdit = () => {
    if (isAdmin) {
      navigate(`/admin/woning/${id}/bewerken`);
    } else if (isRealtor) {
      navigate(`/makelaar/woning/${id}/bewerken`);
    }
  };

  if (!property) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <BackButton />
        </div>
        <div className="text-center text-gray-600">Woning niet gevonden</div>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <BackButton />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="relative">
            <PropertyGallery images={property.images} />
            {(isAdmin || isRealtor) && (
              <button
                onClick={handleEdit}
                className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                title="Bewerk woning"
              >
                <Edit className="w-5 h-5 text-blue-600" />
              </button>
            )}
          </div>
          
          <div className="mt-6">
            <h1 className="text-3xl font-bold mb-4">{property.title}</h1>
            
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-5 h-5" />
                <span>{property.address}, {property.city}, {property.country}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Euro className="w-5 h-5" />
                <span>{property.price.toLocaleString()} {property.type === 'huur' ? 'p/m' : ''}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-5 h-5" />
                <span>Geplaatst op {new Date(property.datePosted).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <HomeIcon className="w-5 h-5" />
                <span>{property.type === 'koop' ? 'Te koop' : 'Te huur'}</span>
              </div>
            </div>

            <PropertyFeatures property={property} />
            
            <div className="mt-6">
              <h2 className="text-2xl font-semibold mb-4">Omschrijving</h2>
              <p className="text-gray-700 whitespace-pre-line">{property.description}</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <PropertyContact property={property} />
        </div>
      </div>
    </main>
  );
}