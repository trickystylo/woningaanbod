import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Bell, Clock, MapPin } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { PropertyCard } from '../../components/ui/PropertyCard';
import { useProperties } from '../../contexts/PropertyContext';
import { useFavorites } from '../../hooks/useFavorites';

export function UserDashboard() {
  const { user } = useAuth();
  const { properties } = useProperties();
  const { favorites } = useFavorites();
  
  const favoriteProperties = properties.filter(property => 
    favorites.includes(property.id)
  );

  // In a real app, these would be fetched from an API
  const savedSearches = [
    { id: 1, query: 'Amsterdam, 2 slaapkamers', date: '2024-03-15' },
    { id: 2, query: 'Rotterdam, max €400.000', date: '2024-03-14' }
  ];

  const viewingRequests = [
    { 
      id: 1, 
      property: properties[0],
      status: 'pending',
      date: '2024-03-20',
      time: '14:00'
    }
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welkom, {user?.displayName}</h1>
        <p className="text-gray-600">Beheer uw favorieten en bezichtigingsaanvragen</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 text-red-600 rounded-lg">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Favorieten</h3>
              <p className="text-2xl font-bold">{favorites.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Zoekopdrachten</h3>
              <p className="text-2xl font-bold">{savedSearches.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Bezichtigingen</h3>
              <p className="text-2xl font-bold">{viewingRequests.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Favoriete Woningen</h2>
            </div>
            <div className="p-6">
              {favoriteProperties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {favoriteProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <Heart className="w-12 h-12 mx-auto mb-4 stroke-1" />
                  <p>U heeft nog geen woningen als favoriet gemarkeerd</p>
                  <Link to="/zoeken" className="text-blue-600 hover:underline mt-2 inline-block">
                    Bekijk alle woningen
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Bezichtigingsaanvragen</h2>
            </div>
            <div className="divide-y">
              {viewingRequests.map((request) => (
                <div key={request.id} className="p-6">
                  <div className="flex items-start gap-4">
                    <img
                      src={request.property.images[0]}
                      alt={request.property.title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div>
                      <h3 className="font-semibold mb-2">{request.property.title}</h3>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{request.property.address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{request.date} om {request.time}</span>
                        </div>
                        <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                          In afwachting
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Opgeslagen Zoekopdrachten</h2>
            </div>
            <div className="divide-y">
              {savedSearches.map((search) => (
                <div key={search.id} className="p-4 hover:bg-gray-50">
                  <Link to={`/zoeken?q=${encodeURIComponent(search.query)}`} className="block">
                    <h3 className="font-medium mb-1">{search.query}</h3>
                    <p className="text-sm text-gray-500">
                      Opgeslagen op {new Date(search.date).toLocaleDateString()}
                    </p>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}