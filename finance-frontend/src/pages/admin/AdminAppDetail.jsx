import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../lib/axios';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle, Clock, AlertCircle, FileText, Eye, ArrowLeft, User, IndianRupee } from 'lucide-react';
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
    const load = toast.loading('Fetching secure document...');
    try {
      const res = await api.get(`/admin/documents/${docId}/view`, { responseType: 'blob' });
      const fileURL = URL.createObjectURL(new Blob([res.data], { type: res.headers['content-type'] }));
      window.open(fileURL, '_blank');
      toast.dismiss(load);
    } catch (err) {
      toast.error('File access denied', { id: load });
    }
  };

  const updateStatus = async (status) => {
    setUpdating(true);
    try {
      const res = await api.patch(`/admin/applications/${id}/status`, { 
        status, admin_remarks: remarks, is_eligible: status === 'approved' 
      });
      setApp(res.data.application);
      toast.success(`Application marked as ${status}`);
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

  if (loading) return <div className="loader">Loading Admin Console...</div>;
  if (!app) return null;

  return (
    <div className="admin-detail-wrapper">
      <div className="admin-detail-header">
        <Link to="/admin/applications" className="back-btn-round"><ArrowLeft size={20}/></Link>
        <div>
          <h2>Review Application #{app.id}</h2>
          <p>Applicant: {app.user?.name}</p>
        </div>
      </div>

      <div className="admin-grid">
        <section className="admin-card">
          <div className="card-tag">Loan Profile</div>
          <div className="data-row"><label>Amount</label> <strong>₹{Number(app.loan_amount).toLocaleString()}</strong></div>
          <div className="data-row"><label>Purpose</label> <span>{app.loan_purpose}</span></div>
          <div className="data-row"><label>Income</label> <strong>₹{Number(app.monthly_income).toLocaleString()}</strong></div>
          <div className="data-row"><label>Employment</label> <span>{app.employment_type}</span></div>
        </section>

        <section className="admin-card">
          <div className="card-tag">Decision Center</div>
          <textarea className="admin-remarks" rows={4} value={remarks} 
            onChange={e => setRemarks(e.target.value)} placeholder="Enter internal review notes..." />
          <div className="admin-actions">
            <button className="btn-approve" onClick={() => updateStatus('approved')} disabled={updating}>Approve</button>
            <button className="btn-reject" onClick={() => updateStatus('rejected')} disabled={updating}>Reject</button>
            <button className="btn-review" onClick={() => updateStatus('under_review')} disabled={updating}>Review</button>
          </div>
        </section>
      </div>

      <section className="admin-card full-width">
        <div className="card-tag">Document Verification</div>
        <div className="admin-doc-list">
          {app.documents?.map(doc => (
            <div key={doc.id} className="admin-doc-item">
              <div className="doc-left"><FileText size={18}/> <span>{doc.document_name}</span></div>
              <div className="doc-right">
                <button onClick={() => handleViewDoc(doc.id)} className="doc-view-pill"><Eye size={14}/> View</button>
                {doc.verification_status === 'pending' ? (
                  <>
                    <button onClick={() => verifyDoc(doc.id, 'verified')} className="doc-verify-btn">Verify</button>
                    <button onClick={() => verifyDoc(doc.id, 'rejected')} className="doc-reject-btn">Reject</button>
                  </>
                ) : (
                  <span className={`status-text ${doc.verification_status}`}>{doc.verification_status}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}