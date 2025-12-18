import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../utils/supabaseClient';

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (from localStorage)
    const storedUser = localStorage.getItem('cms_user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setProfile(userData);
    }
    setLoading(false);
  }, []);

  const signIn = async (email, password) => {
    try {
      // Query the profiles table for matching email and password
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .single();

      if (error || !data) {
        throw new Error('Invalid email or password');
      }

      // Store user in state and localStorage
      setUser(data);
      setProfile(data);
      localStorage.setItem('cms_user', JSON.stringify(data));

      return { user: data };
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    setUser(null);
    setProfile(null);
    localStorage.removeItem('cms_user');
  };

  const value = {
    user,
    profile,
    loading,
    signIn,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};