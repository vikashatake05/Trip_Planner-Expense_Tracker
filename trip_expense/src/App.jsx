import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Public Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Invitation from './pages/Invitation';

// Authenticated Pages
import HomeDashboard from './pages/HomeDashboard';
import MyTrips from './pages/MyTrips';
import CreateTrip from './pages/CreateTrip';
import TripDashboard from './pages/TripDashboard';
import Expenses from './pages/Expenses';
import AddExpense from './pages/AddExpense';
import EditExpense from './pages/EditExpense';
import SplitExpense from './pages/SplitExpense';
import Settlement from './pages/Settlement';
import TripPlan from './pages/TripPlan';
import TripMembers from './pages/TripMembers';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';

// Auth Guard
import ProtectedRoute from './components/layout/ProtectedRoute';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/invite/:token" element={<Invitation />} />

        {/* PROTECTED ROUTES */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <HomeDashboard />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/trips" 
          element={
            <ProtectedRoute>
              <MyTrips />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/trips/new" 
          element={
            <ProtectedRoute>
              <CreateTrip />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/trips/:tripId/dashboard" 
          element={
            <ProtectedRoute>
              <TripDashboard />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/trips/:tripId/expenses" 
          element={
            <ProtectedRoute>
              <Expenses />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/trips/:tripId/expenses/new" 
          element={
            <ProtectedRoute>
              <AddExpense />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/trips/:tripId/expenses/:expenseId/edit" 
          element={
            <ProtectedRoute>
              <EditExpense />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/trips/:tripId/split" 
          element={
            <ProtectedRoute>
              <SplitExpense />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/trips/:tripId/settlement" 
          element={
            <ProtectedRoute>
              <Settlement />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/trips/:tripId/plan" 
          element={
            <ProtectedRoute>
              <TripPlan />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/trips/:tripId/members" 
          element={
            <ProtectedRoute>
              <TripMembers />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/notifications" 
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          } 
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
