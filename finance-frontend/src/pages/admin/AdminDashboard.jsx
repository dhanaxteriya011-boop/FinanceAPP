import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/axios';
import { 
  FileText, Users, Clock, CheckCircle, 
  XCircle, AlertCircle, IndianRupee, ShieldCheck, ArrowUpRight
} from 'lucide-react';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard')
      .then(r => setStats(r.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-state">Optimizing your view...</div>;

  const cards = [
    { label: 'Total Applications', val: stats?.total_applications, icon: FileText, col: '#6366F1', bg: '#EEF2FF' },
    { label: 'Registered Users',   val: stats?.total_users,        icon: Users,    col: '#A855F7', bg: '#F5F3FF' },
    { label: 'Pending Review',     val: stats?.pending,            icon: Clock,    col: '#F59E0B', bg: '#FFFBEB' },
    { label: 'Approved Loans',     val: stats?.approved,           icon: CheckCircle, col: '#10B981', bg: '#ECFDF5' },
    { label: 'Rejected',           val: stats?.rejected,           icon: XCircle,     col: '#EF4444', bg: '#FEF2F2' },
    { label: 'Under Review',       val: stats?.under_review,       icon: AlertCircle, col: '#3B82F6', bg: '#EFF6FF' },
  ];

  return (
    <div className="dashboard-grid-container">
      {/* Featured Metric */}
      <div className="featured-card">
        <div className="featured-info">
          <p>Total Capital Disbursed</p>
          <h2>₹{Number(stats?.total_loan_amount || 0).toLocaleString('en-IN')}</h2>
        </div>
        <div className="featured-icon"><IndianRupee size={32} /></div>
      </div>

      {/* Grid Stats */}
      <div className="stats-grid">
        {cards.map((c, i) => (
          <div key={i} className="stat-card">
            <div className="stat-header">
              <div className="stat-icon" style={{ background: c.bg, color: c.col }}><c.icon size={20} /></div>
              <ArrowUpRight size={16} className="trend-arrow" />
            </div>
            <div className="stat-body">
              <h3>{c.val || 0}</h3>
              <p>{c.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Action Banner */}
      <div className="action-row">
        <h3>System Shortcuts</h3>
        <div className="btn-group">
          <Link to="/admin/applications?status=pending" className="btn-secondary">Review Pending</Link>
          <Link to="/admin/users" className="btn-primary">Manage User Directory</Link>
        </div>
      </div>
    </div>
  );
}