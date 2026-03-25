import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const fields = [
  { key: 'name',                  label: 'Full Name',       type: 'text',     placeholder: 'John Doe',            required: true,  icon: 'user' },
  { key: 'email',                 label: 'Email Address',   type: 'email',    placeholder: 'you@example.com',     required: true,  icon: 'mail' },
  { key: 'phone',                 label: 'Phone Number',    type: 'tel',      placeholder: '+91 98765 43210',     required: false, icon: 'phone' },
  { key: 'password',              label: 'Password',        type: 'password', placeholder: 'Min 8 characters',    required: true,  icon: 'lock' },
  { key: 'password_confirmation', label: 'Confirm Password',type: 'password', placeholder: 'Repeat your password',required: true,  icon: 'lock' },
];

const icons = {
  user: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  mail: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  ),
  phone: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5 19.79 19.79 0 0 1 1.61 5 2 2 0 0 1 3.6 3h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.6a16 16 0 0 0 6 6l.94-.94a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  ),
  lock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  ),
};

export default function RegisterPage() {
  const [form, setForm]       = useState({ name:'', email:'', phone:'', password:'', password_confirmation:'' });
  const [loading, setLoading] = useState(false);
  const { register }          = useAuth();
  const navigate              = useNavigate();

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.password_confirmation) return toast.error('Passwords do not match');
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created! Welcome 🎉');
      navigate('/dashboard');
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors) Object.values(errors).flat().forEach(e => toast.error(e));
      else toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Left panel */}
      <div className="auth-left">
        <div className="auth-brand">
          <div className="auth-brand-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{width:20,height:20}}>
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
            </svg>
          </div>
          <span className="auth-brand-name">FinanceApp</span>
        </div>

        <div className="auth-left-body">
          <h2 className="auth-left-title">
            Start Your<br />
            <span>Loan Journey.</span>
          </h2>
          <p className="auth-left-desc">
            Create your free account in under 2 minutes and check loan eligibility instantly — no credit score impact.
          </p>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {['Instant eligibility check', 'Secure document upload', 'Real-time application tracking', 'Fast admin verification'].map(item => (
              <div key={item} style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:20, height:20, borderRadius:'50%', background:'rgba(52,211,153,.2)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{width:11,height:11}}>
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <span style={{ fontSize:14, color:'rgba(255,255,255,.8)' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="auth-left-footer">© 2025 FinanceApp. All rights reserved.</div>
      </div>

      {/* Right panel */}
      <div className="auth-right">
        <div className="auth-form-wrap">
          <h1 className="auth-title">Create account</h1>
          <p className="auth-sub">Start your loan journey today. It's free.</p>

          <form onSubmit={handleSubmit} className="auth-form">
            {fields.map(({ key, label, type, placeholder, required, icon }) => (
              <div key={key} className="form-group">
                <label className="form-label">
                  {label}
                  {required && <span className="required">*</span>}
                </label>
                <div className="input-wrap">
                  <span className="input-icon">{icons[icon]}</span>
                  <input type={type} className="input-field has-icon" placeholder={placeholder}
                    value={form[key]} onChange={set(key)} required={required} />
                </div>
              </div>
            ))}

            <button type="submit" className="btn btn-primary btn-full" disabled={loading} style={{ marginTop: 4 }}>
              {loading ? <div className="spinner" /> : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{width:16,height:16}}>
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="8.5" cy="7" r="4"/>
                  <line x1="20" y1="8" x2="20" y2="14"/>
                  <line x1="23" y1="11" x2="17" y2="11"/>
                </svg>
              )}
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="auth-switch">
            Already have an account?{' '}
            <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}