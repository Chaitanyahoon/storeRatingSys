import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthContext, { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import ChangePassword from './pages/ChangePassword';
import AdminDashboard from './pages/admin/Dashboard';
import UserList from './pages/admin/UserList';
import UserDetail from './pages/admin/UserDetail';
import StoreListAdmin from './pages/admin/StoreList';
import StoreListUser from './pages/user/StoreList';
import OwnerDashboard from './pages/owner/Dashboard';

const HomeRedirect = () => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (user.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  if (user.role === 'owner') {
    return <Navigate to="/owner/dashboard" replace />;
  }
  
  // Default is 'user' role
  return <Navigate to="/stores" replace />;
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Root Redirect Route */}
          <Route path="/" element={<HomeRedirect />} />

          {/* Accessible to all authenticated users */}
          <Route
            path="/change-password"
            element={
              <ProtectedRoute allowedRoles={['admin', 'user', 'owner']}>
                <ChangePassword />
              </ProtectedRoute>
            }
          />

          {/* Accessible to Shopper (user) and Admin */}
          <Route
            path="/stores"
            element={
              <ProtectedRoute allowedRoles={['user', 'admin']}>
                <StoreListUser />
              </ProtectedRoute>
            }
          />

          {/* Admin Specific Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <UserList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users/:id"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <UserDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/stores"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <StoreListAdmin />
              </ProtectedRoute>
            }
          />

          {/* Store Owner Specific Routes */}
          <Route
            path="/owner/dashboard"
            element={
              <ProtectedRoute allowedRoles={['owner']}>
                <OwnerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
