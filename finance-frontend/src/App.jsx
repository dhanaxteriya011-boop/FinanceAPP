import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

import HomePage          from './pages/HomePage';
import LoginPage         from './pages/LoginPage';
import RegisterPage      from './pages/RegisterPage';
import DashboardPage     from './pages/DashboardPage';
import LoanApplyPage     from './pages/LoanApplyPage';
import LoanDetailPage    from './pages/LoanDetailPage';
import AdminLayout       from './pages/admin/AdminLayout';
import AdminDashboard    from './pages/admin/AdminDashboard';
import AdminApplications from './pages/admin/AdminApplications';
import AdminAppDetail    from './pages/admin/AdminAppDetail';
import AdminUsers        from './pages/admin/AdminUsers';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="page-loader">
      <div className="spinner spinner-dark" style={{ width: 32, height: 32 }} />
    </div>
  );
  return user ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user?.is_admin ? children : <Navigate to="/dashboard" />;
}

function PublicRoute({ children }) {
  const { user } = useAuth();
  return user ? <Navigate to={user.is_admin ? '/admin' : '/dashboard'} /> : children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              fontFamily: "'Outfit', sans-serif",
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: 500,
            },
          }}
        />
        <Routes>
          {/* Public home page */}
          <Route path="/" element={<HomePage />} />

          {/* Auth pages */}
          <Route path="/login"    element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

          {/* User pages */}
          <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          <Route path="/apply"     element={<PrivateRoute><LoanApplyPage /></PrivateRoute>} />
          <Route path="/loans/:id" element={<PrivateRoute><LoanDetailPage /></PrivateRoute>} />

          {/* Admin pages */}
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index                   element={<AdminDashboard />} />
            <Route path="applications"     element={<AdminApplications />} />
            <Route path="applications/:id" element={<AdminAppDetail />} />
            <Route path="users"            element={<AdminUsers />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}