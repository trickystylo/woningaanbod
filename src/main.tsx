import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PropertyProvider } from './contexts/PropertyContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { router } from './routes';
import { validateEnv } from './config/env.config';
import './index.css';

// Validate environment variables before starting the app
validateEnv();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <PropertyProvider>
          <RouterProvider router={router} />
        </PropertyProvider>
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>
);