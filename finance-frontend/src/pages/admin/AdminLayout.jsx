import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import {
  TrendingUp, LayoutDashboard, FileText, Users, LogOut, ChevronRight, Bell
} from 'lucide-react';
import './AdminLayout.css';

const navItems = [
  { to: '/admin',              label: 'Dashboard',    icon: LayoutDashboard, exact: true },
  { to: '/admin/applications', label: 'Applications', icon: FileText },
  { to: '/admin/users',        label: 'Users',        icon: Users },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();
  const location         = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out');
      navigate('/login');
    } catch (err) {
      toast.error('Logout failed');
    }
  };

  const isActive = (path, exact) =>
    exact ? location.pathname === path : location.pathname.startsWith(path);

  // Determine page title based on route
  const activeNavItem = navItems.find(n => isActive(n.to, n.exact));

  return (
    <div className="admin-layout">
      {/* Sidebar Navigation */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <div className="brand-wrapper">
            <div className="brand-logo">
              <TrendingUp size={20} />
            </div>
            <div className="brand-info">
              <p>FinanceApp</p>
              <span>Admin Panel</span>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(({ to, label, icon: Icon, exact }) => (
            <Link 
              key={to} 
              to={to}
              className={`nav-item ${isActive(to, exact) ? 'active' : ''}`}
            >
              <Icon size={18} className="nav-icon" />
              <span>{label}</span>
              {isActive(to, exact) && <ChevronRight size={14} className="chevron" />}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-pill">
            <div className="user-avatar">
              {user?.name ? user.name[0].toUpperCase() : 'A'}
            </div>
            <div className="user-meta">
              <span className="u-name">{user?.name}</span>
              <span className="u-email">{user?.email}</span>
            </div>
          </div>
          
          <button onClick={handleLogout} className="logout-trigger">
            <LogOut size={16} />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        <header className="top-bar">
          <h2>{activeNavItem ? activeNavItem.label : 'Admin Overview'}</h2>
          
          <div className="header-actions">
            <button className="notification-btn" title="Notifications">
              <Bell size={18} />
              <span className="dot" />
            </button>
            
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--admin-text-main)' }}>
              Administrator
            </div>
          </div>
        </header>

        <div className="content-body">
          <Outlet />
        </div>
      </main>
    </div>
  );
}