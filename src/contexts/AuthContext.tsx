import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { supabase } from '../lib/supabase';
import { User } from '../types';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string, role: User['role'], name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (updates: Partial<Pick<User, 'name' | 'photoUrl'>>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          const { data: supabaseUser, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', firebaseUser.uid)
            .single();

          if (supabaseUser && !error) {
            setCurrentUser({
              uid: supabaseUser.id,
              email: supabaseUser.email,
              role: supabaseUser.role,
              name: supabaseUser.name,
              photoUrl: supabaseUser.photo_url,
              createdAt: new Date(supabaseUser.created_at),
              updatedAt: supabaseUser.updated_at ? new Date(supabaseUser.updated_at) : undefined
            });
          } else {
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              setCurrentUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email!,
                role: userData.role,
                name: userData.name,
                photoUrl: userData.photoUrl,
                createdAt: userData.createdAt.toDate(),
                updatedAt: userData.updatedAt?.toDate()
              });
            }
          }
        } catch (err) {
          console.error('Error loading user:', err);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string, role: User['role'], name: string) => {
    const { user } = await signInWithEmailAndPassword(auth, email, password);

    const userData = {
      name: name || user.email?.split('@')[0] || 'User',
      email: user.email,
      role,
      createdAt: new Date()
    };

    await setDoc(doc(db, 'users', user.uid), userData, { merge: true });

    await supabase
      .from('users')
      .upsert({
        id: user.uid,
        email: user.email,
        name: userData.name,
        role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
  };

  const logout = async () => {
    await signOut(auth);
  };

  const updateUserProfile = async (updates: Partial<Pick<User, 'name' | 'photoUrl'>>) => {
    if (!currentUser) throw new Error('No user logged in');

    if (updates.name) {
      await setDoc(doc(db, 'users', currentUser.uid), {
        name: updates.name,
        updatedAt: new Date()
      }, { merge: true });
    }

    setCurrentUser(prev => prev ? { ...prev, ...updates } : null);
  };

  const value = {
    currentUser,
    loading,
    login,
    logout,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};