import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Home, AlertCircle } from 'lucide-react';
import { useProperties } from '../../contexts/PropertyContext';
import { useAuth } from '../../contexts/AuthContext';
import { PropertyCard } from '../../components/ui/PropertyCard';

export function OwnerDashboard() {
  const { user } = useAuth();
  const { properties } = useProperties();
  const userProperties = properties.filter(p => p.makelaarId === user?.uid);
  const canAddProperty = userProperties.length === 0;

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Mijn Woning</h1>
        {canAddProperty && (
          <Link
            to="/owner/woning/nieuw"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Woning toevoegen
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userProperties.length > 0 ? (
          userProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))
        ) : (
          <div className="col-span-full bg-white p-8 rounded-lg shadow-sm text-center">
            <Home className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold mb-2">Nog geen woning toegevoegd</h2>
            <p className="text-gray-600 mb-6">
              U kunt één woning toevoegen om te verkopen of verhuren
            </p>
            <Link
              to="/owner/woning/nieuw"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Woning toevoegen
            </Link>
          </div>
        )}
      </div>

      {userProperties.length > 0 && (
        <div className="mt-8 bg-yellow-50 p-4 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-yellow-600">
            <p className="font-semibold">Let op:</p>
            <p>Als huiseigenaar kunt u maximaal één woning beheren. Neem contact op met een makelaar als u meerdere woningen wilt aanbieden.</p>
          </div>
        </div>
      )}
    </main>
  );
}