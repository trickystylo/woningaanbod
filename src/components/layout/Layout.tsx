import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Toaster } from 'react-hot-toast';

export function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Outlet />
      <Toaster position="top-right" />
    </div>
  );
}