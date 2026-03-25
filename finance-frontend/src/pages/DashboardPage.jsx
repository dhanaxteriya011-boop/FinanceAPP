import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../lib/axios';
import { useAuth } from '../context/AuthContext';
import { FileText, Clock, CheckCircle, XCircle, ChevronRight, Plus, AlertCircle } from 'lucide-react';
import './Dashboard.css'; // Import the new CSS

const STATUS_CONFIG = {
  pending:      { label: 'Pending',      cls: 'badge-pending',  icon: Clock },
  under_review: { label: 'Under Review', cls: 'badge-review',   icon: AlertCircle },
  approved:     { label: 'Approved',     cls: 'badge-approved', icon: CheckCircle },
  rejected:     { label: 'Rejected',     cls: 'badge-rejected', icon: XCircle },
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    api.get('/loans')
      .then(r => setApplications(r.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: 'Total Applications', value: applications.length, icon: FileText, colorStyle: { color: '#4f46e5', backgroundColor: '#eef2ff' } },
    { label: 'Pending',     value: applications.filter(a => a.status === 'pending').length,      icon: Clock,         colorStyle: { color: '#d97706', backgroundColor: '#fffbeb' } },
    { label: 'Approved',    value: applications.filter(a => a.status === 'approved').length,     icon: CheckCircle,   colorStyle: { color: '#059669', backgroundColor: '#ecfdf5' } },
    { label: 'Rejected',    value: applications.filter(a => a.status === 'rejected').length,     icon: XCircle,       colorStyle: { color: '#dc2626', backgroundColor: '#fef2f2' } },
  ];

  return (
    <div className="dashboard-container">
      <Navbar />
      
      <main className="dashboard-content">
        <header className="dashboard-header">
          <div className="welcome-text">
            <h1>Good {new Date().getHours() < 12 ? 'morning' : 'afternoon'}, {user?.name?.split(' ')[0]}! 👋</h1>
            <p>Here's an overview of your loan applications.</p>
          </div>
          <Link to="/apply" className="btn-primary">
            <Plus size={18} />
            <span>New Application</span>
          </Link>
        </header>

        <section className="stats-grid">
          {stats.map(({ label, value, icon: Icon, colorStyle }) => (
            <div key={label} className="stat-card">
              <div className="icon-box" style={colorStyle}>
                <Icon size={22} />
              </div>
              <div className="stat-value">{value}</div>
              <div className="stat-label">{label}</div>
            </div>
          ))}
        </section>

        <section className="main-card">
          <h2 className="card-title">Your Applications</h2>
          
          {loading ? (
            <div className="loading-container">
              {[1, 2, 3].map(i => <div key={i} className="skeleton" />)}
            </div>
          ) : applications.length === 0 ? (
            <div className="empty-state">
              <FileText size={48} />
              <h3>No applications yet</h3>
              <p>Apply for your first loan to see it appear here.</p>
              <Link to="/apply" className="btn-primary" style={{ display: 'inline-flex', marginTop: '20px' }}>
                <Plus size={18} /> Apply Now
              </Link>
            </div>
          ) : (
            <div className="app-list">
              {applications.map((app) => {
                const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.pending;
                const Icon = cfg.icon;
                return (
                  <Link key={app.id} to={`/loans/${app.id}`} className="app-item">
                    <div className="app-info">
                      <div className="app-icon-circle">
                        <FileText size={20} />
                      </div>
                      <div className="app-details">
                        <strong>₹{Number(app.loan_amount).toLocaleString('en-IN')}</strong>
                        <span>{app.loan_purpose} · {app.loan_term_months} months</span>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span className={`status-badge ${cfg.cls}`}>
                        <Icon size={14} />
                        {cfg.label}
                      </span>
                      <ChevronRight size={18} className="arrow-icon" style={{ color: '#cbd5e1' }} />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}