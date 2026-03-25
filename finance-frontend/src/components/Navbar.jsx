import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { TrendingUp, LayoutDashboard, FileText, LogOut, User, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdown, setDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/apply',     label: 'Apply for Loan', icon: FileText },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Brand Logo */}
        <Link to="/dashboard" className="nav-brand">
          <div className="logo-icon">
            <TrendingUp size={18} />
          </div>
          <span className="brand-name">FinanceApp</span>
        </Link>

        {/* Center Navigation */}
        <div className="nav-menu">
          {navItems.map(({ to, label, icon: Icon }) => (
            <Link 
              key={to} 
              to={to}
              className={`nav-link ${isActive(to) ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          ))}
        </div>

        {/* User Dropdown */}
        <div className="nav-user-section" ref={dropdownRef}>
          <button 
            className="user-profile-btn"
            onClick={() => setDropdown(!dropdown)}
          >
            <div className="avatar-circle">
              <User size={18} />
            </div>
            <span className="user-name">{user?.name?.split(' ')[0]}</span>
            <ChevronDown size={14} className={`chevron ${dropdown ? 'rotate' : ''}`} />
          </button>

          {dropdown && (
            <div className="dropdown-menu">
              <div className="dropdown-header">
                <span className="label">Account</span>
                <p className="email">{user?.email}</p>
              </div>
              
              <button onClick={handleLogout} className="logout-btn">
                <LogOut size={16} />
                <span>Sign out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}