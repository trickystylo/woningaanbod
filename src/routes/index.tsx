import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { HomePage } from '../pages/HomePage';
import { PropertyPage } from '../pages/PropertyPage';
import { SearchResultsPage } from '../pages/SearchResultsPage';
import { RealtorDashboard } from '../pages/realtor/RealtorDashboard';
import { PropertyForm } from '../pages/realtor/PropertyForm';
import { RealtorAppointments } from '../pages/realtor/RealtorAppointments';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { UserDashboard } from '../pages/user/UserDashboard';
import { OwnerDashboard } from '../pages/owner/OwnerDashboard';
import { ProfilePage } from '../pages/user/ProfilePage';
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { AuthGuard } from '../components/auth/AuthGuard';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'woning/:id',
        element: <PropertyPage />,
      },
      {
        path: 'zoeken',
        element: <SearchResultsPage />,
      },
      {
        path: 'dashboard',
        element: (
          <AuthGuard>
            <UserDashboard />
          </AuthGuard>
        ),
      },
      {
        path: 'profiel',
        element: (
          <AuthGuard>
            <ProfilePage />
          </AuthGuard>
        ),
      },
      {
        path: 'makelaar',
        element: (
          <AuthGuard requireRealtor>
            <RealtorDashboard />
          </AuthGuard>
        ),
      },
      {
        path: 'makelaar/woning/nieuw',
        element: (
          <AuthGuard requireRealtor>
            <PropertyForm />
          </AuthGuard>
        ),
      },
      {
        path: 'makelaar/woning/:id/bewerken',
        element: (
          <AuthGuard requireRealtor>
            <PropertyForm />
          </AuthGuard>
        ),
      },
      {
        path: 'makelaar/afspraken',
        element: (
          <AuthGuard requireRealtor>
            <RealtorAppointments />
          </AuthGuard>
        ),
      },
      {
        path: 'owner',
        element: (
          <AuthGuard requireOwner>
            <OwnerDashboard />
          </AuthGuard>
        ),
      },
      {
        path: 'owner/woning/nieuw',
        element: (
          <AuthGuard requireOwner>
            <PropertyForm ownerMode />
          </AuthGuard>
        ),
      },
      {
        path: 'owner/woning/:id/bewerken',
        element: (
          <AuthGuard requireOwner>
            <PropertyForm ownerMode />
          </AuthGuard>
        ),
      },
      {
        path: 'admin',
        element: (
          <AuthGuard requireAdmin>
            <AdminDashboard />
          </AuthGuard>
        ),
      },
      {
        path: 'admin/woning/:id/bewerken',
        element: (
          <AuthGuard requireAdmin>
            <PropertyForm />
          </AuthGuard>
        ),
      },
    ],
  },
  {
    path: 'login',
    element: (
      <AuthGuard requireAuth={false}>
        <LoginPage />
      </AuthGuard>
    ),
  },
  {
    path: 'registreren',
    element: (
      <AuthGuard requireAuth={false}>
        <RegisterPage />
      </AuthGuard>
    ),
  },
]);