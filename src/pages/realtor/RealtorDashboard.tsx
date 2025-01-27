import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Calendar, Building2, ListFilter } from 'lucide-react';
import { PropertyStatusBadge } from '../../components/realtor/PropertyStatusBadge';
import { CsvUploader } from '../../components/realtor/CsvUploader';
import { ListingUrlInput } from '../../components/realtor/ListingUrlInput';
import { WebhookTest } from '../../components/realtor/WebhookTest';
import { useProperties } from '../../contexts/PropertyContext';
import { Property } from '../../types';

export function RealtorDashboard() {
  const navigate = useNavigate();
  const { properties, toggleFeatured } = useProperties();
  const [statusFilter, setStatusFilter] = useState<Property['status'] | 'all'>('all');

  const filteredProperties = properties.filter(
    p => statusFilter === 'all' || p.status === statusFilter
  );

  const handleEditProperty = (propertyId: string) => {
    navigate(`/makelaar/woning/${propertyId}/bewerken`);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Makelaarsdashboard</h1>
        <div className="flex gap-4">
          <Link
            to="/makelaar/afspraken"
            className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
          >
            <Calendar className="w-5 h-5" />
            <span>Afspraken</span>
          </Link>
          <Link
            to="/makelaar/woning/nieuw"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            <span>Nieuwe woning</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Actieve woningen</h3>
              <p className="text-2xl font-bold">
                {properties.filter(p => p.status === 'actief').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <ListingUrlInput />
        <WebhookTest />
        <CsvUploader />

        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Mijn woningen</h2>
              <div className="flex items-center gap-2">
                <ListFilter className="w-5 h-5 text-gray-500" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as Property['status'] | 'all')}
                  className="border-0 bg-transparent text-gray-600 focus:ring-0"
                >
                  <option value="all">Alle statussen</option>
                  <option value="actief">Actief</option>
                  <option value="concept">Concept</option>
                  <option value="verkocht">Verkocht</option>
                  <option value="verhuurd">Verhuurd</option>
                  <option value="ingetrokken">Ingetrokken</option>
                </select>
              </div>
            </div>
          </div>

          <div className="divide-y">
            {filteredProperties.map((property) => (
              <div 
                key={property.id} 
                className="p-4 hover:bg-gray-50"
                onClick={() => navigate(`/woning/${property.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div>
                      <h3 className="font-semibold">{property.title}</h3>
                      <p className="text-gray-600 text-sm">{property.address}</p>
                      <p className="text-gray-600 text-sm">€ {property.price.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <PropertyStatusBadge status={property.status} />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditProperty(property.id);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredProperties.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                Geen woningen gevonden voor de geselecteerde status
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}