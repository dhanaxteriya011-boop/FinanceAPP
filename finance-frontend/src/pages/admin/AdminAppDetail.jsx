import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../lib/axios';
import toast from 'react-hot-toast';
import { 
  CheckCircle, XCircle, Clock, AlertCircle, FileText, 
  Eye, ArrowLeft, User, IndianRupee, Briefcase, Info, ShieldCheck
} from 'lucide-react';
import './AdminAppDetail.css';

export default function AdminAppDetail() {
  const { id } = useParams();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [remarks, setRemarks] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    api.get(`/admin/applications/${id}`).then(r => {
      setApp(r.data);
      setRemarks(r.data.admin_remarks || '');
    }).finally(() => setLoading(false));
  }, [id]);

  const handleViewDoc = async (docId) => {
    const load = toast.loading('Opening secure document...');
    try {
      const res = await api.get(`/admin/documents/${docId}/view`, { responseType: 'blob' });
      const fileURL = URL.createObjectURL(new Blob([res.data], { type: res.headers['content-type'] }));
      window.open(fileURL, '_blank');
      toast.dismiss(load);
    } catch (err) {
      toast.error('Access denied', { id: load });
    }
  };

  const updateStatus = async (status) => {
    setUpdating(true);
    try {
      const res = await api.patch(`/admin/applications/${id}/status`, { 
        status, admin_remarks: remarks, is_eligible: status === 'approved' 
      });
      setApp(res.data.application);
      toast.success(`Application ${status}`);
    } catch { toast.error('Update failed'); }
    finally { setUpdating(false); }
  };

  const verifyDoc = async (docId, status) => {
    try {
      await api.patch(`/admin/documents/${docId}/verify`, { verification_status: status });
      setApp(prev => ({
        ...prev,
        documents: prev.documents.map(d => d.id === docId ? { ...d, verification_status: status } : d)
      }));
      toast.success(`Document ${status}`);
    } catch { toast.error('Action failed'); }
  };

  if (loading) return <div className="page-loader"><span>Authenticating Data...</span></div>;
  if (!app) return null;

  return (
    <div className="admin-detail-container">
      {/* Header Section */}
      <header className="detail-header">
        <Link to="/admin/applications" className="back-link">
          <ArrowLeft size={18} />
          <span>Back to Applications</span>
        </Link>
        <div className="header-main">
          <div className="title-group">
            <h1>Application #{app.id}</h1>
            <span className={`main-status-pill ${app.status}`}>{app.status}</span>
          </div>
          <div className="applicant-pill">
            <User size={16} />
            <span>{app.user?.name}</span>
          </div>
        </div>
      </header>

      <div className="detail-grid">
        <div className="grid-left">
          {/* Loan Profile Card */}
          <section className="detail-card">
            <div className="card-header">
              <div className="icon-wrap"><IndianRupee size={18} /></div>
              <h3>Loan Information</h3>
            </div>
            <div className="stats-row">
              <div className="stat-item large">
                <label>Requested Amount</label>
                <div className="val">₹{Number(app.loan_amount).toLocaleString('en-IN')}</div>
              </div>
              <div className="stat-item">
                <label>Monthly Income</label>
                <div className="val secondary">₹{Number(app.monthly_income).toLocaleString('en-IN')}</div>
              </div>
            </div>
            <div className="info-list">
              <div className="info-item">
                <Briefcase size={16} />
                <div>
                  <label>Employment</label>
                  <p>{app.employment_type}</p>
                </div>
              </div>
              <div className="info-item">
                <Info size={16} />
                <div>
                  <label>Purpose</label>
                  <p>{app.loan_purpose}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Documents Card */}
          <section className="detail-card">
            <div className="card-header">
              <div className="icon-wrap"><ShieldCheck size={18} /></div>
              <h3>Document Verification</h3>
            </div>
            <div className="doc-stack">
              {app.documents?.map(doc => (
                <div key={doc.id} className="doc-row">
                  <div className="doc-info">
                    <FileText size={20} className="doc-icon" />
                    <div>
                      <span className="doc-name">{doc.document_name}</span>
                      <span className={`doc-tag ${doc.verification_status}`}>{doc.verification_status}</span>
                    </div>
                  </div>
                  <div className="doc-btns">
                    <button onClick={() => handleViewDoc(doc.id)} className="btn-icon-text">
                      <Eye size={14} /> View
                    </button>
                    {doc.verification_status === 'pending' && (
                      <div className="verify-actions">
                        <button onClick={() => verifyDoc(doc.id, 'verified')} className="btn-check"><CheckCircle size={16}/></button>
                        <button onClick={() => verifyDoc(doc.id, 'rejected')} className="btn-cross"><XCircle size={16}/></button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="grid-right">
          {/* Action Center */}
          <section className="detail-card action-card">
            <div className="card-header">
              <h3>Review Decision</h3>
            </div>
            <p className="hint">Add internal remarks before changing status.</p>
            <textarea 
              className="remarks-area" 
              placeholder="e.g. Credit score looks good, income verified..."
              value={remarks}
              onChange={e => setRemarks(e.target.value)}
            />
            <div className="status-buttons">
              <button className="btn-approve-big" onClick={() => updateStatus('approved')} disabled={updating}>
                Confirm Approval
              </button>
              <div className="sub-buttons">
                <button className="btn-review-lite" onClick={() => updateStatus('under_review')} disabled={updating}>
                  Put on Review
                </button>
                <button className="btn-reject-lite" onClick={() => updateStatus('rejected')} disabled={updating}>
                  Reject
                </button>
              </div>
            </div>
          </section>

          {/* User Meta Card */}
          <section className="meta-card">
            <label>Submission Date</label>
            <p>{new Date(app.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <label>Last Updated</label>
            <p>{new Date(app.updated_at).toLocaleTimeString()}</p>
          </section>
        </div>
      </div>
    </div>
  );
}