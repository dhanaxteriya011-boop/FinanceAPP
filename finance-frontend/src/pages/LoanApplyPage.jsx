import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../lib/axios';
import toast from 'react-hot-toast';
import { 
  CheckCircle, XCircle, Upload, AlertTriangle, 
  ChevronRight, ChevronLeft, IndianRupee, Briefcase, FileText 
} from 'lucide-react';
import './LoanApply.css';

const STEPS = ['Eligibility', 'Details', 'Documents', 'Review'];

const DOCUMENT_TYPES = [
  { key: 'id_proof',           label: 'Government ID Proof',       desc: 'Aadhaar, PAN, or Passport',   required: true },
  { key: 'income_proof',       label: 'Income Proof',              desc: 'Latest salary slips or ITR',    required: true },
  { key: 'bank_statement',     label: 'Bank Statement',            desc: 'Last 6 months statement',        required: true },
  { key: 'address_proof',      label: 'Address Proof',             desc: 'Utility bill or Rent agreement',      required: false },
];

export default function LoanApplyPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [eligibility, setEligibility] = useState(null);
  const [checking, setChecking] = useState(false);
  const [applicationId, setApplicationId] = useState(null);
  const [uploading, setUploading] = useState({});
  const [uploadedDocs, setUploadedDocs] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const [eligForm, setEligForm] = useState({
    loan_amount: '', monthly_income: '', loan_term_months: '12', employment_type: 'employed',
  });

  const [appForm, setAppForm] = useState({
    loan_amount: '', loan_purpose: '', loan_term_months: '12', monthly_income: '',
    employment_type: 'employed', employer_name: '', additional_notes: '',
  });

  const checkEligibility = async (e) => {
    e.preventDefault();
    setChecking(true);
    try {
      const res = await api.post('/loans/check-eligibility', {
        ...eligForm,
        loan_amount: Number(eligForm.loan_amount),
        monthly_income: Number(eligForm.monthly_income),
        loan_term_months: Number(eligForm.loan_term_months),
      });
      setEligibility(res.data);
      if (res.data.eligible) {
        setAppForm(p => ({ ...p, ...eligForm }));
      }
    } catch {
      toast.error('Eligibility check failed');
    } finally { setChecking(false); }
  };

  const submitApplication = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/loans', { 
        ...appForm, 
        loan_amount: Number(appForm.loan_amount), 
        monthly_income: Number(appForm.monthly_income), 
        loan_term_months: Number(appForm.loan_term_months) 
      });
      setApplicationId(res.data.application.id);
      toast.success('Basic details saved!');
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally { setSubmitting(false); }
  };

  const uploadDoc = async (docType, file) => {
    setUploading(p => ({ ...p, [docType]: true }));
    const fd = new FormData();
    fd.append('document_type', docType);
    fd.append('document', file);
    try {
      const res = await api.post(`/loans/${applicationId}/documents`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUploadedDocs(p => ({ ...p, [docType]: res.data.document }));
      toast.success('Uploaded successfully');
    } catch { toast.error('Upload failed'); }
    finally { setUploading(p => ({ ...p, [docType]: false })); }
  };

  return (
    <div className="apply-container">
      <Navbar />
      
      <main className="apply-content">
        {/* Stepper UI */}
        <div className="stepper">
          <div className="stepper-bar-bg" />
          <div className="stepper-bar-progress" style={{ width: `${(step / (STEPS.length - 1)) * 100}%` }} />
          {STEPS.map((s, i) => (
            <div key={s} className={`step-item ${i === step ? 'active' : ''} ${i < step ? 'completed' : ''}`}>
              <div className="step-number">
                {i < step ? <CheckCircle size={20} /> : i + 1}
              </div>
              <span className="step-label">{s}</span>
            </div>
          ))}
        </div>

        {/* Step 0: Eligibility */}
        {step === 0 && (
          <div className="apply-card">
            <h2 className="title">Eligibility Check</h2>
            <p className="subtitle">Let's see what loan amount you qualify for.</p>

            <form onSubmit={checkEligibility}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Required Loan Amount (₹)</label>
                  <div className="input-wrapper">
                    <IndianRupee size={16} className="input-icon" />
                    <input type="number" required className="form-input has-icon" placeholder="e.g. 500000"
                      value={eligForm.loan_amount} onChange={e => setEligForm({...eligForm, loan_amount: e.target.value})} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Monthly Take-home (₹)</label>
                  <div className="input-wrapper">
                    <IndianRupee size={16} className="input-icon" />
                    <input type="number" required className="form-input has-icon" placeholder="e.g. 60000"
                      value={eligForm.monthly_income} onChange={e => setEligForm({...eligForm, monthly_income: e.target.value})} />
                  </div>
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Tenure (Months)</label>
                  <select className="form-input" value={eligForm.loan_term_months} onChange={e => setEligForm({...eligForm, loan_term_months: e.target.value})}>
                    {[12, 24, 36, 48, 60].map(m => <option key={m} value={m}>{m} Months</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Employment Status</label>
                  <select className="form-input" value={eligForm.employment_type} onChange={e => setEligForm({...eligForm, employment_type: e.target.value})}>
                    <option value="employed">Salaried</option>
                    <option value="self-employed">Self-Employed</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="btn-main" disabled={checking}>
                {checking ? "Processing..." : "Check My Eligibility"}
              </button>
            </form>

            {eligibility && (
              <div className={`eligibility-box ${eligibility.eligible ? 'success' : 'fail'}`}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {eligibility.eligible ? <CheckCircle color="var(--success)" /> : <AlertTriangle color="var(--error)" />}
                  <h3 style={{ margin: 0 }}>{eligibility.eligible ? "You're Eligible!" : "Application Not Possible"}</h3>
                </div>
                
                {eligibility.eligible ? (
                  <>
                    <div className="result-stats">
                      <div className="stat-pill">
                        <span>EMI</span>
                        <div style={{ fontWeight: 800 }}>₹{Number(eligibility.monthly_payment).toLocaleString()}</div>
                      </div>
                      <div className="stat-pill">
                        <span>Rate</span>
                        <div style={{ fontWeight: 800 }}>{eligibility.interest_rate}%</div>
                      </div>
                      <div className="stat-pill">
                        <span>Total</span>
                        <div style={{ fontWeight: 800 }}>₹{Math.round(eligibility.total_payable).toLocaleString()}</div>
                      </div>
                    </div>
                    <button onClick={() => setStep(1)} className="btn-main" style={{ width: 'auto' }}>
                      Continue Application <ChevronRight size={18} />
                    </button>
                  </>
                ) : (
                  <p style={{ marginTop: '12px', fontSize: '0.9rem', color: '#991b1b' }}>
                    {eligibility.reasons?.[0] || "Requirements not met."}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Step 1: Details */}
        {step === 1 && (
          <div className="apply-card">
            <h3>Loan Details</h3>
            <form onSubmit={submitApplication}>
              <div className="form-group">
                <label>Purpose of Loan</label>
                <select required className="form-input" value={appForm.loan_purpose} onChange={e => setAppForm({...appForm, loan_purpose: e.target.value})}>
                  <option value="">Choose a purpose...</option>
                  <option value="Home Renovation">Home Renovation</option>
                  <option value="Education">Education</option>
                  <option value="Medical">Medical</option>
                  <option value="Debt Consolidation">Debt Consolidation</option>
                </select>
              </div>
              <div className="form-group">
                <label>Employer / Company Name</label>
                <div className="input-wrapper">
                  <Briefcase size={16} className="input-icon" />
                  <input type="text" required className="form-input has-icon" value={appForm.employer_name} 
                    onChange={e => setAppForm({...appForm, employer_name: e.target.value})} />
                </div>
              </div>
              <div className="btn-group">
                <button type="button" className="btn-back" onClick={() => setStep(0)}>Back</button>
                <button type="submit" className="btn-main" disabled={submitting}>
                  {submitting ? "Saving..." : "Save & Continue"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 2: Uploads */}
        {step === 2 && (
          <div className="apply-card">
            <h3>Documents</h3>
            <div className="upload-list">
              {DOCUMENT_TYPES.map(doc => (
                <div key={doc.key} className={`upload-slot ${uploadedDocs[doc.key] ? 'completed' : ''}`}>
                  <div className="upload-info">
                    <h4>{doc.label} {doc.required && <span style={{ color: 'red' }}>*</span>}</h4>
                    <p>{doc.desc}</p>
                    {uploadedDocs[doc.key] && <small style={{ color: 'var(--success)' }}>File uploaded</small>}
                  </div>
                  
                  <label className="btn-main" style={{ width: 'auto', padding: '8px 16px', fontSize: '0.85rem' }}>
                    {uploading[doc.key] ? "..." : (uploadedDocs[doc.key] ? "Change" : "Upload")}
                    <input type="file" hidden onChange={e => uploadDoc(doc.key, e.target.files[0])} disabled={uploading[doc.key]} />
                  </label>
                </div>
              ))}
            </div>
            <div className="btn-group">
              <button className="btn-main" onClick={() => setStep(3)}>Finalize Review</button>
            </div>
          </div>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <div className="apply-card" style={{ textAlign: 'center' }}>
            <div style={{ background: 'var(--success-bg)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <CheckCircle size={40} color="var(--success)" />
            </div>
            <h2>Submitted Successfully!</h2>
            <p style={{ color: 'var(--text-muted)' }}>Application ID: #{applicationId}</p>
            <p>Your documents are being verified by our team. This usually takes 24-48 hours.</p>
            <button className="btn-main" style={{ marginTop: '24px' }} onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </button>
          </div>
        )}
      </main>
    </div>
  );
}