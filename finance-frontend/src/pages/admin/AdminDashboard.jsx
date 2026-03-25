import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/axios';
import { 
  FileText, Users, Clock, CheckCircle, 
  XCircle, AlertCircle, IndianRupee, ShieldCheck 
} from 'lucide-react';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(false);

  useEffect(() => {
    api.get('/admin/dashboard')
      .then(r => setStats(r.data))
      .catch(err => {
        console.error("Dashboard API Error:", err);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="admin-dashboard-wrapper">
      <div className="admin-skeleton-grid">
        {[...Array(8)].map((_, i) => <div key={i} className="admin-skeleton-card" />)}
      </div>
    </div>
  );

  if (error || !stats) return (
    <div className="admin-dashboard-wrapper">
      <div style={{ textAlign: 'center', padding: '100px 20px', background: '#fef2f2', borderRadius: '24px', border: '1px solid #fee2e2' }}>
        <AlertCircle size={48} color="#ef4444" style={{ marginBottom: '16px' }} />
        <h2 style={{ color: '#991b1b' }}>Failed to load Admin Stats</h2>
        <p style={{ color: '#b91c1c' }}>Check your Laravel logs (storage/logs/laravel.log) for 500 error details.</p>
        <button onClick={() => window.location.reload()} className="admin-action-btn" style={{ background: '#ef4444', marginTop: '20px', cursor: 'pointer' }}>Retry Now</button>
      </div>
    </div>
  );

  const cards = [
    { label: 'Total Applications', value: stats?.total_applications || 0, icon: FileText,    color: { color: '#4f46e5', bg: '#eef2ff' } },
    { label: 'Registered Users',   value: stats?.total_users || 0,        icon: Users,       color: { color: '#9333ea', bg: '#f5f3ff' } },
    { label: 'Pending Review',     value: stats?.pending || 0,            icon: Clock,       color: { color: '#d97706', bg: '#fffbeb' } },
    { label: 'Under Review',       value: stats?.under_review || 0,       icon: AlertCircle, color: { color: '#2563eb', bg: '#eff6ff' } },
    { label: 'Approved',           value: stats?.approved || 0,           icon: CheckCircle, color: { color: '#059669', bg: '#ecfdf5' } },
    { label: 'Rejected',           value: stats?.rejected || 0,           icon: XCircle,     color: { color: '#dc2626', bg: '#fef2f2' } },
    { label: 'Total Disbursed',    value: `₹${Number(stats?.total_loan_amount || 0).toLocaleString('en-IN')}`, icon: IndianRupee, color: { color: '#0d9488', bg: '#f0fdfa' } },
    { label: 'Docs Pending',       value: stats?.pending_documents || 0,  icon: ShieldCheck, color: { color: '#ea580c', bg: '#fff7ed' } },
  ];

  return (
    <div className="admin-dashboard-wrapper">
      <header className="admin-header">
        <h1>Dashboard Overview</h1>
        <p>Comprehensive summary of platform activity and loan performance.</p>
      </header>

      <section className="admin-stats-grid">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="admin-stat-card">
            <div className="admin-icon-box" style={{ color: color.color, backgroundColor: color.bg }}>
              <Icon size={24} />
            </div>
            <div className="admin-stat-value">{value}</div>
            <div className="admin-stat-label">{label}</div>
          </div>
        ))}
      </section>

      <section className="admin-actions-banner">
        <p>Shortcuts & Quick Actions</p>
        <div className="admin-actions-group">
          <Link to="/admin/applications?status=pending" className="admin-action-btn">
            Review Pending ({stats?.pending || 0})
          </Link>
          <Link to="/admin/applications?status=under_review" className="admin-action-btn">
            In-Progress Review ({stats?.under_review || 0})
          </Link>
          <Link to="/admin/users" className="admin-action-btn">
            Manage User Directory
          </Link>
        </div>
      </section>
    </div>
  );
}