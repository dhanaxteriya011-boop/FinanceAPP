import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../../lib/axios';
import { Clock, CheckCircle, XCircle, AlertCircle, Search, ChevronRight } from 'lucide-react';
import './AdminApplications.css';

const STATUS_CONFIG = {
  pending:      { label: 'Pending',      cls: 'badge-pending',  icon: Clock },
  under_review: { label: 'Review',       cls: 'badge-review',   icon: AlertCircle },
  approved:     { label: 'Approved',     cls: 'badge-approved', icon: CheckCircle },
  rejected:     { label: 'Rejected',     cls: 'badge-rejected', icon: XCircle },
};

export default function AdminApplications() {
  const [searchParams] = useSearchParams();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatus] = useState(searchParams.get('status') || '');
  const [pagination, setPagination] = useState(null);

  const fetchApps = (page = 1) => {
    setLoading(true);
    api.get('/admin/applications', { params: { status: statusFilter, search, page } })
      .then(r => { 
        setApps(r.data.data); 
        setPagination(r.data); 
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchApps(); }, [statusFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchApps();
  };

  return (
    <div className="admin-apps-container">
      <header className="admin-apps-header">
        <h1>Loan Applications</h1>
        <p>Manage and verify incoming loan requests.</p>
      </header>

      {/* Filters Bar */}
      <section className="filters-container">
        <form onSubmit={handleSearch} className="search-wrapper">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search applicant name or email..." 
            className="search-input"
            value={search} 
            onChange={e => setSearch(e.target.value)} 
          />
        </form>

        <div className="status-filter-group">
          {[
            ['', 'All'], 
            ['pending', 'Pending'], 
            ['under_review', 'Review'], 
            ['approved', 'Approved'], 
            ['rejected', 'Rejected']
          ].map(([v, l]) => (
            <button 
              key={v} 
              onClick={() => setStatus(v)}
              className={`filter-pill ${statusFilter === v ? 'active' : ''}`}
            >
              {l}
            </button>
          ))}
        </div>
      </section>

      {/* Table Section */}
      <section className="table-card">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Applicant</th>
                <th>Amount</th>
                <th>Purpose</th>
                <th>Status</th>
                <th>Submitted</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}><td colSpan="7" style={{ padding: '20px', textAlign: 'center', color: '#94a3b8' }}>Loading applications...</td></tr>
                ))
              ) : apps.length === 0 ? (
                <tr><td colSpan="7" style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>No applications matching your criteria.</td></tr>
              ) : (
                apps.map(app => {
                  const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.pending;
                  const Icon = cfg.icon;
                  return (
                    <tr key={app.id}>
                      <td className="id-cell">#{app.id}</td>
                      <td>
                        <div className="user-info">
                          <span className="u-name">{app.user?.name}</span>
                          <span className="u-email">{app.user?.email}</span>
                        </div>
                      </td>
                      <td className="amount-cell">₹{Number(app.loan_amount).toLocaleString('en-IN')}</td>
                      <td style={{ color: '#64748b', fontSize: '0.85rem' }}>{app.loan_purpose}</td>
                      <td>
                        <span className={`status-pill ${cfg.cls}`}>
                          <Icon size={12} />
                          {cfg.label}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                        {new Date(app.created_at).toLocaleDateString('en-GB')}
                      </td>
                      <td>
                        <Link to={`/admin/applications/${app.id}`} className="review-link">
                          Review <ChevronRight size={14} />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Block */}
        {pagination && pagination.last_page > 1 && (
          <footer className="pagination-footer">
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Showing <strong>{pagination.from}</strong> to <strong>{pagination.to}</strong> of {pagination.total}
            </span>
            <div className="page-controls">
              {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map(page => (
                <button 
                  key={page} 
                  onClick={() => fetchApps(page)}
                  className={`page-btn ${pagination.current_page === page ? 'active' : ''}`}
                >
                  {page}
                </button>
              ))}
            </div>
          </footer>
        )}
      </section>
    </div>
  );
}