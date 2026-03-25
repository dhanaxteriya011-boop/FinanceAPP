import { Link } from 'react-router-dom';

// SVG Icons (inline — no icon library needed)
const TrendingUp = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
  </svg>
);
const Shield = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const Zap = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);
const FileText = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
  </svg>
);
const CheckCircle = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);
const Clock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const Users = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const ArrowRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

const features = [
  { icon: Zap,       cls: 'feature-icon-purple', title: 'Instant Eligibility Check',  desc: 'Get a real-time eligibility decision in seconds based on your income and loan amount before you even apply.' },
  { icon: Shield,    cls: 'feature-icon-blue',   title: 'Secure Document Upload',     desc: 'Upload your KYC, income, and bank documents securely. Bank-grade encryption protects all your files.' },
  { icon: FileText,  cls: 'feature-icon-green',  title: 'Easy Application Wizard',    desc: 'Our 4-step guided wizard makes the application process simple, clear, and stress-free from start to finish.' },
  { icon: Clock,     cls: 'feature-icon-orange', title: 'Real-Time Status Tracking',  desc: 'Track your application status live. Know when it\'s under review, approved, or if any action is needed.' },
  { icon: CheckCircle, cls: 'feature-icon-pink', title: 'Fast Admin Verification',    desc: 'Dedicated admin team reviews and verifies your documents quickly — decisions within 2–3 business days.' },
  { icon: Users,     cls: 'feature-icon-teal',   title: 'Dedicated Support',          desc: 'Our team is always available to assist you at every step of your loan journey. You\'re never alone.' },
];

const steps = [
  { num: '1', title: 'Check Eligibility', desc: 'Enter your income and desired loan amount for an instant decision.' },
  { num: '2', title: 'Fill Application',  desc: 'Provide your loan details, purpose, and employment information.' },
  { num: '3', title: 'Upload Documents',  desc: 'Upload your ID, income proof, and bank statements securely.' },
  { num: '4', title: 'Get Approved',      desc: 'Admin reviews and notifies you of the decision via your dashboard.' },
];

const loanTypes = [
  { emoji: '🏠', title: 'Home Renovation',  range: '₹1L – ₹20L',  desc: 'Upgrade your living space with flexible repayment terms up to 5 years.' },
  { emoji: '🎓', title: 'Education Loan',   range: '₹50K – ₹15L', desc: 'Fund your studies or your child\'s education with low interest rates.' },
  { emoji: '🚗', title: 'Vehicle Purchase', range: '₹2L – ₹25L',  desc: 'Buy your dream vehicle with quick approval and easy documentation.' },
  { emoji: '💼', title: 'Business Loan',    range: '₹5L – ₹50L',  desc: 'Expand your business, buy inventory, or bridge cash flow gaps.' },
  { emoji: '🏥', title: 'Medical Emergency',range: '₹25K – ₹10L', desc: 'Handle medical expenses quickly with same-day disbursement option.' },
  { emoji: '💍', title: 'Personal / Wedding',range: '₹1L – ₹10L', desc: 'Finance life\'s big moments with our flexible personal loan plans.' },
];

export default function HomePage() {
  return (
    <div className="home-page">

      {/* ── NAV ── */}
      <nav className="home-nav">
        <div className="home-nav-inner">
          <div className="home-logo">
            <div className="home-logo-icon">
              <TrendingUp />
            </div>
            <span className="home-logo-text">Finance<span>App</span></span>
          </div>

          <div className="home-nav-links">
            <a href="#features" className="nav-link">Features</a>
            <a href="#how"      className="nav-link">How It Works</a>
            <a href="#loans"    className="nav-link">Loan Types</a>
            <Link to="/login"    className="nav-link">Sign In</Link>
            <Link to="/register" className="btn btn-primary btn-sm btn-icon">
              Get Started <ArrowRight />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="home-hero">
        <div className="hero-inner">
          <div className="hero-left">
            <div className="hero-tag">
              <span className="hero-tag-dot" />
              Trusted by 12,000+ customers across India
            </div>
            <h1 className="hero-title">
              Smart Loans,<br />
              <span>Simpler Life.</span>
            </h1>
            <p className="hero-desc">
              Apply for personal, home, or business loans in minutes.
              Get instant eligibility results, upload documents securely,
              and track your application in real time.
            </p>
            <div className="hero-actions">
              <Link to="/register" className="btn btn-hero-primary btn-icon">
                Apply Now — It's Free <ArrowRight />
              </Link>
              <Link to="/login" className="btn btn-hero-secondary">
                Sign In
              </Link>
            </div>

            <div className="hero-stats">
              <div className="hero-stat">
                <div className="hero-stat-value">₹50Cr+</div>
                <div className="hero-stat-label">Loans Disbursed</div>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <div className="hero-stat-value">12K+</div>
                <div className="hero-stat-label">Happy Customers</div>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <div className="hero-stat-value">98%</div>
                <div className="hero-stat-label">Approval Rate</div>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <div className="hero-stat-value">2 Days</div>
                <div className="hero-stat-label">Avg. Disbursal</div>
              </div>
            </div>
          </div>

          {/* Floating Card */}
          <div className="hero-visual">
            <div className="hero-card">
              <div className="hero-card-header">
                <span className="hero-card-title">Loan Application</span>
                <span className="hero-card-badge">✓ Approved</span>
              </div>
              <div className="hero-card-amount">₹5,00,000</div>
              <div className="hero-card-sub">Home Renovation · 36 months</div>
              <div className="hero-progress">
                <div className="hero-progress-bar" />
              </div>
              <div className="hero-progress-label">
                <span>Processing</span><span>68%</span>
              </div>
              <div className="hero-card-items">
                <div className="hero-card-item">
                  <span className="hero-card-item-label">Monthly EMI</span>
                  <span className="hero-card-item-value">₹16,607</span>
                </div>
                <div className="hero-card-item">
                  <span className="hero-card-item-label">Interest Rate</span>
                  <span className="hero-card-item-value">12% p.a.</span>
                </div>
                <div className="hero-card-item">
                  <span className="hero-card-item-label">Documents</span>
                  <span className="hero-card-item-value">3 / 3 Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="home-features" id="features">
        <div className="section-header">
          <span className="section-tag">Why FinanceApp?</span>
          <h2 className="section-title">Everything you need to get your loan approved</h2>
          <p className="section-desc">From instant eligibility checks to document verification — we've built a seamless, secure, and transparent loan experience.</p>
        </div>
        <div className="features-grid">
          {features.map(({ icon: Icon, cls, title, desc }) => (
            <div key={title} className="feature-card">
              <div className={`feature-icon ${cls}`}><Icon /></div>
              <div className="feature-title">{title}</div>
              <div className="feature-desc">{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="home-how" id="how">
        <div className="section-header">
          <span className="section-tag">How It Works</span>
          <h2 className="section-title">Get your loan in 4 simple steps</h2>
          <p className="section-desc">Our streamlined process ensures you spend less time on paperwork and more time on what matters.</p>
        </div>
        <div className="steps-grid">
          {steps.map(({ num, title, desc }) => (
            <div key={num} className="step-card">
              <div className="step-num">{num}</div>
              <div className="step-title">{title}</div>
              <div className="step-desc">{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── LOAN TYPES ── */}
      <section className="home-loans" id="loans">
        <div className="section-header">
          <span className="section-tag">Loan Products</span>
          <h2 className="section-title">A loan for every need</h2>
          <p className="section-desc">Whatever your goal, we have a loan product designed for it — with competitive rates and flexible repayment.</p>
        </div>
        <div className="loans-grid">
          {loanTypes.map(({ emoji, title, range, desc }) => (
            <div key={title} className="loan-card">
              <div className="loan-card-emoji">{emoji}</div>
              <div className="loan-card-title">{title}</div>
              <div className="loan-card-range">{range}</div>
              <div className="loan-card-desc">{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="home-cta">
        <div className="cta-inner">
          <h2 className="cta-title">Ready to apply for your loan?</h2>
          <p className="cta-desc">Join thousands of happy customers. Create your account in under 2 minutes and check your eligibility instantly — no credit score impact.</p>
          <div className="cta-actions">
            <Link to="/register" className="btn btn-hero-primary btn-lg btn-icon">
              Create Free Account <ArrowRight />
            </Link>
            <Link to="/login" className="btn btn-hero-secondary btn-lg">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="home-footer">
        <div className="footer-inner">
          <div className="footer-logo">
            <div className="footer-logo-icon"><TrendingUp /></div>
            <span className="footer-logo-text">FinanceApp</span>
          </div>
          <span className="footer-copy">© 2025 FinanceApp. All rights reserved.</span>
          <div className="footer-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </footer>

    </div>
  );
}