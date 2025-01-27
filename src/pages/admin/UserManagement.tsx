import React, { useState } from 'react';
import { UserProperties } from '../../components/admin/UserProperties';
import { Users, Building2, Mail, Calendar, Hash } from 'lucide-react';

interface User {
  id: string;
  email: string;
  displayName: string;
  role: 'admin' | 'realtor' | 'user';
  createdAt: string;
  status: 'active' | 'inactive';
  company?: string;
  propertyCount?: number;
  realtorId?: string;
}

const DEMO_USERS: User[] = [
  {
    id: 'admin',
    email: 'rickyytpremium14@gmail.com',
    displayName: 'Admin',
    role: 'admin',
    createdAt: '2024-03-01',
    status: 'active',
    propertyCount: 2
  },
  {
    id: 'jan.devries@makelaardij.nl',
    email: 'jan.devries@makelaardij.nl',
    displayName: 'Jan de Vries',
    role: 'realtor',
    createdAt: '2024-03-15',
    status: 'active',
    company: 'De Vries Makelaardij',
    propertyCount: 3,
    realtorId: 'RLTR-24031501' // Format: RLTR-YYMMDDXX (XX is sequence number)
  },
  {
    id: '3',
    email: 'sarah@woningzoeker.nl',
    displayName: 'Sarah Jansen',
    role: 'user',
    createdAt: '2024-03-10',
    status: 'active'
  }
];

export function UserManagement() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<User['role'] | 'all'>('all');

  const filteredUsers = DEMO_USERS.filter(
    user => roleFilter === 'all' || user.role === roleFilter
  );

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold">Gebruikers</h2>
      </div>

      <div className="p-4 border-b bg-gray-50">
        <div className="flex gap-2">
          {(['all', 'admin', 'realtor', 'user'] as const).map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-3 py-1 rounded-full text-sm ${
                roleFilter === role
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {role === 'all' ? 'Alle gebruikers' : role}
            </button>
          ))}
        </div>
      </div>

      <div className="divide-y">
        {filteredUsers.map((user) => (
          <div key={user.id} className="p-4 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${
                  user.role === 'admin' 
                    ? 'bg-purple-100 text-purple-600'
                    : user.role === 'realtor'
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {user.role === 'realtor' ? (
                    <Building2 className="w-6 h-6" />
                  ) : (
                    <Users className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">{user.displayName}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{user.email}</span>
                  </div>
                  {user.company && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Building2 className="w-4 h-4" />
                      <span>{user.company}</span>
                    </div>
                  )}
                  {user.role === 'realtor' && user.realtorId && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Hash className="w-4 h-4" />
                      <span>Makelaar ID: {user.realtorId}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Lid sinds {new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {(user.role === 'admin' || user.role === 'realtor') && (
                  <button
                    onClick={() => setSelectedUserId(user.id)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    Bekijk woningen ({user.propertyCount})
                  </button>
                )}
                <span className={`px-2 py-1 rounded-full text-sm ${
                  user.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {user.status === 'active' ? 'Actief' : 'Inactief'}
                </span>
              </div>
            </div>
          </div>
        ))}

        {filteredUsers.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            Geen gebruikers gevonden voor het geselecteerde filter
          </div>
        )}
      </div>

      {selectedUserId && (
        <UserProperties 
          userId={selectedUserId}
          onClose={() => setSelectedUserId(null)}
        />
      )}
    </div>
  );
}