import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useUserRole } from '../../hooks/useUserRole';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
  requireRealtor?: boolean;
  requireOwner?: boolean;
}

export function AuthGuard({ 
  children, 
  requireAuth = true,
  requireAdmin = false,
  requireRealtor = false,
  requireOwner = false
}: AuthGuardProps) {
  const { user } = useAuth();
  const { isAdmin, isRealtor, isOwner } = useUserRole();
  const location = useLocation();

  if (requireAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (requireRealtor && !isRealtor && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (requireOwner && !isOwner) {
    return <Navigate to="/" replace />;
  }

  if (!requireAuth && user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}