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
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (err) {
      toast.error('Logout failed');
    }
  };

  const isActive = (path, exact) => 
    exact ? location.pathname === path : location.pathname.startsWith(path);

  const activeNavItem = navItems.find(n => isActive(n.to, n.exact));

  return (
    <div className="admin-container">
      {/* --- Sidebar --- */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="logo-icon"><TrendingUp size={22} /></div>
          <div className="brand-text">
            <h3>FinanceApp</h3>
            <span>Admin Console</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(({ to, label, icon: Icon, exact }) => (
            <Link 
              key={to} 
              to={to} 
              className={`nav-link ${isActive(to, exact) ? 'active' : ''}`}
            >
              <Icon size={20} />
              <span>{label}</span>
              {isActive(to, exact) && <div className="active-indicator" />}
            </Link>
          ))}
        </nav>

        <div className="sidebar-user">
          <div className="user-info">
            <div className="avatar">{user?.name?.[0] || 'A'}</div>
            <div className="details">
              <p className="u-name">{user?.name || 'Administrator'}</p>
              <p className="u-role">Super Admin</p>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* --- Main Content --- */}
      <main className="main-content">
        <header className="main-header">
          <div className="header-left">
            <h1>{activeNavItem ? activeNavItem.label : 'Overview'}</h1>
          </div>
          <div className="header-right">
            <button className="icon-button"><Bell size={20} /><span className="badge" /></button>
            <div className="divider" />
            <div className="header-profile">
              <span>Admin Mode</span>
            </div>
          </div>
        </header>

        <section className="content-area">
          <Outlet />
        </section>
      </main>
    </div>
  );
}