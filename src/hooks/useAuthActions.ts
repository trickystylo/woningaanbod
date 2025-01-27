import { useState, useCallback } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile as firebaseUpdateProfile,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  browserPopupRedirectResolver,
  User
} from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { UserRole } from '../types';

export function useAuthActions() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const clearError = useCallback(() => setError(null), []);

  const register = async (email: string, password: string, name: string, role: UserRole = 'user') => {
    try {
      setError(null);
      setLoading(true);
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(user, { displayName: name });
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email,
        displayName: name,
        role,
        favorites: [],
        createdAt: new Date().toISOString()
      });

      return user;
    } catch (err: any) {
      setError(getErrorMessage(err.code));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Rest of the code remains the same...
  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      return user;
    } catch (err: any) {
      setError(getErrorMessage(err.code));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setError(null);
      setLoading(true);

      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });

      try {
        const { user } = await signInWithPopup(auth, provider, browserPopupRedirectResolver);
        return user;
      } catch (popupError: any) {
        if (popupError.code === 'auth/popup-blocked') {
          await signInWithRedirect(auth, provider);
          return;
        }
        throw popupError;
      }
    } catch (err: any) {
      setError(getErrorMessage(err.code));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleRedirectResult = async () => {
    try {
      const result = await getRedirectResult(auth);
      if (result) {
        return result.user;
      }
    } catch (err: any) {
      setError(getErrorMessage(err.code));
      throw err;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      setLoading(true);
      await signOut(auth);
    } catch (err: any) {
      setError(getErrorMessage(err.code));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (user: User, updates: { displayName?: string; photoURL?: string }) => {
    try {
      setError(null);
      setLoading(true);
      await firebaseUpdateProfile(user, updates);
    } catch (err: any) {
      setError(getErrorMessage(err.code));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      setError(null);
      setLoading(true);

      const user = auth.currentUser;
      if (!user || !user.email) throw new Error('No user logged in');

      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
    } catch (err: any) {
      setError(getErrorMessage(err.code));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    register,
    login,
    loginWithGoogle,
    handleRedirectResult,
    logout,
    updateProfile,
    changePassword,
    error,
    loading,
    clearError
  };
}

function getErrorMessage(code: string): string {
  switch (code) {
    case 'auth/popup-blocked':
      return 'Pop-up geblokkeerd. We gebruiken nu een alternatieve inlogmethode.';
    case 'auth/popup-closed-by-user':
      return 'Inloggen geannuleerd. Probeer het opnieuw.';
    case 'auth/invalid-email':
      return 'Ongeldig emailadres.';
    case 'auth/user-disabled':
      return 'Dit account is uitgeschakeld.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Ongeldige email of wachtwoord.';
    case 'auth/too-many-requests':
      return 'Te veel pogingen. Probeer het later opnieuw.';
    case 'auth/email-already-in-use':
      return 'Dit emailadres is al in gebruik.';
    case 'auth/weak-password':
      return 'Wachtwoord moet minimaal 6 tekens bevatten.';
    case 'auth/requires-recent-login':
      return 'Log opnieuw in om deze actie uit te voeren.';
    default:
      return 'Er is een fout opgetreden. Probeer het opnieuw.';
  }
}