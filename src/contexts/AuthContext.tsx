import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useAuthActions } from '../hooks/useAuthActions';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  clearError: () => void;
  actions: ReturnType<typeof useAuthActions>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  clearError: () => {},
  actions: {} as ReturnType<typeof useAuthActions>
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const actions = useAuthActions();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // Handle redirect result on mount
    actions.handleRedirectResult().catch(() => {
      // Error handling is done in the hook
    });

    return unsubscribe;
  }, [actions]);

  const value = {
    user,
    loading,
    error: actions.error,
    clearError: actions.clearError,
    actions
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}