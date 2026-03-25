import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../lib/axios';
import toast from 'react-hot-toast';
import { CheckCircle, Clock, XCircle, AlertCircle, FileText, Eye, ArrowLeft, IndianRupee } from 'lucide-react';
import './LoanDetail.css';

const STATUS_CONFIG = {
  pending:      { label: 'Pending',      icon: Clock,       color: '#d97706' },
  under_review: { label: 'Under Review', icon: AlertCircle,   color: '#2563eb' },
  approved:     { label: 'Approved',     icon: CheckCircle,   color: '#059669' },
  rejected:     { label: 'Rejected',     icon: XCircle,       color: '#dc2626' },
};

export default function LoanDetailPage() {
  const { id } = useParams();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/loans/${id}`).then(r => setApp(r.data)).finally(() => setLoading(false));
  }, [id]);

  const viewMyDocument = async (docId) => {
    const load = toast.loading('Opening document...');
    try {
      // Securely fetch using axios to include Auth Headers
      const res = await api.get(`/loans/${id}/documents/${docId}/view`, { responseType: 'blob' });
      const fileURL = URL.createObjectURL(new Blob([res.data], { type: res.headers['content-type'] }));
      window.open(fileURL, '_blank');
      toast.dismiss(load);
    } catch (err) {
      toast.error('Could not open file', { id: load });
    }
  };

  if (loading) return <div className="loader">Loading...</div>;
  if (!app) return <div className="detail-content">Loan not found.</div>;

  const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.pending;
  const StatusIcon = cfg.icon;

  return (
    <div className="loan-detail-wrapper">
      <Navbar />
      <div className="detail-content">
        <Link to="/dashboard" className="back-link"><ArrowLeft size={16}/> Back to Dashboard</Link>

        <div className={`status-hero ${app.status}`}>
          <div className="hero-info">
            <span className="app-id">Application ID: #{app.id}</span>
            <h1>₹{Number(app.loan_amount).toLocaleString('en-IN')}</h1>
            <p className="purpose-text">{app.loan_purpose} · {app.loan_term_months} Months</p>
            {app.admin_remarks && (
              <div className="remarks-box">
                <label>Lender Remarks</label>
                <p>{app.admin_remarks}</p>
              </div>
            )}
          </div>
          <div className="hero-badge">
            <StatusIcon size={20} /> <span>{cfg.label}</span>
          </div>
        </div>

        <div className="detail-grid">
          <div className="info-card"><label>Monthly Income</label><p>₹{Number(app.monthly_income).toLocaleString('en-IN')}</p></div>
          <div className="info-card"><label>Employment</label><p>{app.employment_type}</p></div>
          <div className="info-card"><label>Employer</label><p>{app.employer_name || 'N/A'}</p></div>
          <div className="info-card"><label>Applied On</label><p>{new Date(app.created_at).toLocaleDateString()}</p></div>
        </div>

        <div className="docs-section">
          <h3>Your Documents</h3>
          <div className="doc-list">
            {app.documents?.map(doc => (
              <div key={doc.id} className="doc-item">
                <div className="doc-lead">
                  <div className="doc-icon"><FileText size={20}/></div>
                  <div className="doc-meta">
                    <strong>{doc.document_name}</strong>
                    <span>{doc.document_type.replace('_', ' ')}</span>
                  </div>
                </div>
                <div className="doc-actions">
                  <span className={`doc-status ds-${doc.verification_status}`}>{doc.verification_status}</span>
                  <button onClick={() => viewMyDocument(doc.id)} className="view-btn"><Eye size={14}/> View</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}