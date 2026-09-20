import { supabase } from '../lib/supabase';

let currentUserCache = null;

export const setCurrentUserCache = (user) => {
  currentUserCache = user;
};

export const getCurrentUser = () => currentUserCache;

export const loginUser = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  currentUserCache = data.user;
  return { user: data.user, session: data.session };
};

export const signupUser = async (name, email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } }
  });
  if (error) throw error;
  currentUserCache = data.user;
  return { user: data.user, session: data.session };
};

export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  currentUserCache = null;
};

export const updateUserProfile = async (updatedData) => {
  const { data, error } = await supabase.auth.updateUser({ data: updatedData });
  if (error) throw error;
  currentUserCache = data.user;
  return data.user;
};
