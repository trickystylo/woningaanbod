import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useEffect, useState } from 'react';
import { UserRole } from '../types';

export function useUserRole() {
  const { user } = useAuth();
  const [role, setRole] = useState<UserRole>('user');
  
  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setRole(userDoc.data().role as UserRole);
        }
      }
    };
    
    fetchUserRole();
  }, [user]);

  const isAdmin = role === 'admin' || user?.email === 'rickyytpremium14@gmail.com';
  const isRealtor = isAdmin || role === 'realtor';
  const isOwner = role === 'owner';
  const isUser = user !== null;

  return {
    isAdmin,
    isRealtor,
    isOwner,
    isUser,
    userId: user?.uid,
    role
  };
}