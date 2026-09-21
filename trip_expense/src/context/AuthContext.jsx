import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { setCurrentUserCache } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      const errorMessage = error.message?.toLowerCase() || '';
      const sessionIsGone = error.name === 'AuthSessionMissingError'
        || error.status === 401
        || errorMessage.includes('session') && errorMessage.includes('missing');

      if (!sessionIsGone) throw error;
    }

    setSession(null);
    setUser(null);
    setCurrentUserCache(null);
  };

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      if (!mounted) return;
      setSession(currentSession);
      setUser(currentSession?.user || null);
      setCurrentUserCache(currentSession?.user || null);
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return;
      setSession(nextSession);
      setUser(nextSession?.user || null);
      setCurrentUserCache(nextSession?.user || null);
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, user, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider');
  return value;
}
