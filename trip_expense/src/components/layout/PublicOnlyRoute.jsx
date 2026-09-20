import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function PublicOnlyRoute({ children }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  return user
    ? <Navigate to="/dashboard" replace />
    : children;
}
