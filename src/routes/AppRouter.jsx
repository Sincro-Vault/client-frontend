import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import AppLayout from '../layouts/AppLayout';
import ProtectedRoute from './ProtectedRoute';

import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Secrets from '../pages/Secrets';
import CreateSecret from '../pages/CreateSecret';
import Certificate from '../pages/Certificate';
import Settings from '../pages/Settings';
import SessionExpired from '../pages/SessionExpired';

function PublicRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}

export default function AppRouter() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/session-expired" element={<SessionExpired />} />

      {/* Protected */}
      <Route path="/" element={<ProtectedRoute><AppLayout><Navigate to="/dashboard" replace /></AppLayout></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />
      <Route path="/secrets" element={<ProtectedRoute><AppLayout><Secrets /></AppLayout></ProtectedRoute>} />
      <Route path="/secrets/create" element={<ProtectedRoute><AppLayout><CreateSecret /></AppLayout></ProtectedRoute>} />
      <Route path="/certificate" element={<ProtectedRoute><AppLayout><Certificate /></AppLayout></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><AppLayout><Settings /></AppLayout></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
