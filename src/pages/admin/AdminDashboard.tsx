import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Star, Edit, Building2, Users, Trash2 } from 'lucide-react';
import { PropertyStatusBadge } from '../../components/realtor/PropertyStatusBadge';
import { useProperties } from '../../contexts/PropertyContext';
import { Property } from '../../types';
import { UserManagement } from './UserManagement';
import { CsvUploader } from '../../components/realtor/CsvUploader';
import { ListingUrlInput } from '../../components/realtor/ListingUrlInput';
import { WebhookTest } from '../../components/realtor/WebhookTest';

type Tab = 'properties' | 'users';

export function AdminDashboard() {
  const navigate = useNavigate();
  const { properties, toggleFeatured, deleteProperty } = useProperties();
  const [statusFilter, setStatusFilter] = useState<Property['status'] | 'alle'>('alle');
  const [activeTab, setActiveTab] = useState<Tab>('properties');
  const [deletingPropertyId, setDeletingPropertyId] = useState<string | null>(null);

  const filteredProperties = properties.filter(
    p => statusFilter === 'alle' || p.status === statusFilter
  );

  const handleEditProperty = (propertyId: string) => {
    navigate(`/admin/woning/${propertyId}/bewerken`);
  };

  const handleDeleteProperty = async (propertyId: string) => {
    if (window.confirm('Weet u zeker dat u deze woning wilt verwijderen? Dit kan niet ongedaan worden gemaakt.')) {
      await deleteProperty(propertyId);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Link
          to="/makelaar/woning/nieuw"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nieuwe woning
        </Link>
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

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg">
              <Star className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Uitgelichte woningen</h3>
              <p className="text-2xl font-bold">
                {properties.filter(p => p.featured).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Gebruikers</h3>
              <p className="text-2xl font-bold">3</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8 mb-8">
        <ListingUrlInput />
        <WebhookTest />
        <CsvUploader />
      </div>

      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('properties')}
              className={`${
                activeTab === 'properties'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Woningen
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`${
                activeTab === 'users'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Gebruikers
            </button>
          </nav>
        </div>
      </div>

      {activeTab === 'properties' ? (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Alle woningen</h2>
          </div>

          <div className="p-4 border-b bg-gray-50">
            <div className="flex gap-2">
              {(['alle', 'actief', 'concept', 'verkocht', 'verhuurd', 'ingetrokken'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    statusFilter === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y">
            {filteredProperties.map((property) => (
              <div 
                key={property.id} 
                className="p-4 hover:bg-gray-50 cursor-pointer"
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
                        toggleFeatured(property.id);
                      }}
                      className={`p-2 rounded-full ${
                        property.featured
                          ? 'text-yellow-500 hover:bg-yellow-50'
                          : 'text-gray-400 hover:bg-gray-50'
                      }`}
                    >
                      <Star className={`w-5 h-5 ${property.featured ? 'fill-yellow-500' : ''}`} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditProperty(property.id);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteProperty(property.id);
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                    >
                      <Trash2 className="w-5 h-5" />
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
      ) : (
        <UserManagement />
      )}
    </main>
  );
}