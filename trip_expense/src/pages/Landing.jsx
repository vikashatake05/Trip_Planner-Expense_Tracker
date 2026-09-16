import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, ArrowRight, ShieldCheck, PieChart, Users, Wallet, Calendar, CheckCircle } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FFFFFF', color: 'var(--text-main)' }}>
      
      {/* Landing Header */}
      <header style={{ borderBottom: '1px solid var(--border-light)', backgroundColor: '#FFFFFF', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="brand-logo">
              <Compass size={22} />
            </div>
            <span className="brand-title" style={{ color: 'var(--text-main)' }}>TripLedger</span>
          </div>

          <nav style={{ display: 'flex', gap: '2rem', fontWeight: 500, color: 'var(--text-muted)' }}>
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#about">About</a>
          </nav>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/login" className="btn-secondary">Login</Link>
            <Link to="/signup" className="btn-primary" style={{ width: 'auto' }}>Get Started</Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ backgroundColor: 'var(--bg-app)', padding: '5rem 2rem', textAlign: 'center', borderBottom: '1px solid var(--border-light)' }}>
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
          <span style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            backgroundColor: 'var(--primary-light)', 
            color: 'var(--primary)', 
            padding: '0.4rem 1rem', 
            borderRadius: 'var(--radius-full)', 
            fontWeight: 600, 
            fontSize: '0.875rem',
            marginBottom: '1.5rem' 
          }}>
            <ShieldCheck size={16} />
            Smart Travel Expense & Budget Platform
          </span>

          <h1 style={{ fontSize: '3.2rem', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '1.25rem' }}>
            Plan Trips. Track Expenses. <span style={{ color: 'var(--primary)' }}>Split Fairly.</span>
          </h1>

          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '2.5rem' }}>
            Plan your journey, manage your budget, track shared expenses, and settle payments with your travel group — all in one place.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/signup" className="btn-primary" style={{ width: 'auto', padding: '1rem 2rem', fontSize: '1.05rem' }}>
              <span>Create Your Trip</span>
              <ArrowRight size={18} />
            </Link>
            <a href="#how-it-works" className="btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.05rem' }}>
              See How It Works
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ padding: '5rem 2rem', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 700 }}>Everything You Need for Group & Solo Travel</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginTop: '0.5rem' }}>
            Designed for seamless travel finance tracking and debt simplification.
          </p>
        </div>

        <div className="grid-cols-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
          <div className="card" style={{ padding: '2rem' }}>
            <div className="summary-icon-box" style={{ marginBottom: '1.25rem' }}><Calendar size={24} /></div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>1. Plan Your Trip</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Set destinations, dates, duration, daily itineraries, and total budget caps.</p>
          </div>

          <div className="card" style={{ padding: '2rem' }}>
            <div className="summary-icon-box" style={{ marginBottom: '1.25rem', backgroundColor: '#ECFDF5', color: '#10B981' }}><Wallet size={24} /></div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>2. Track Every Expense</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Categorize stay, food, transport, and activities with automated budget progress.</p>
          </div>

          <div className="card" style={{ padding: '2rem' }}>
            <div className="summary-icon-box" style={{ marginBottom: '1.25rem', backgroundColor: '#FEF3C7', color: '#F59E0B' }}><PieChart size={24} /></div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>3. Split Expenses Easily</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Support equal, custom amount, or percentage splits among selected members.</p>
          </div>

          <div className="card" style={{ padding: '2rem' }}>
            <div className="summary-icon-box" style={{ marginBottom: '1.25rem', backgroundColor: '#F3E8FF', color: '#8B5CF6' }}><Users size={24} /></div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>4. Settle Fairly</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Debt minimization algorithm calculates minimum transfers to settle all balances.</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" style={{ backgroundColor: 'var(--bg-app)', padding: '5rem 2rem', borderTop: '1px solid var(--border-light)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 700, marginBottom: '3rem' }}>How It Works in 5 Easy Steps</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem' }}>
            {[
              { step: '01', title: 'Create Trip', desc: 'Set destination & budget' },
              { step: '02', title: 'Invite Friends', desc: 'Send email invitations' },
              { step: '03', title: 'Plan Activities', desc: 'Build shared itinerary' },
              { step: '04', title: 'Track Expenses', desc: 'Log payments on the go' },
              { step: '05', title: 'Settle Balances', desc: 'Clear balances effortlessly' }
            ].map((s) => (
              <div key={s.step} className="card" style={{ padding: '1.5rem 1rem', textAlign: 'center' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>{s.step}</span>
                <h4 style={{ fontWeight: 700, marginTop: '0.5rem' }}>{s.title}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: 'var(--bg-sidebar)', color: '#94A3B8', padding: '3rem 2rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#FFFFFF', marginBottom: '0.75rem' }}>
              <Compass size={24} style={{ color: 'var(--primary)' }} />
              <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>TripLedger</span>
            </div>
            <p style={{ fontSize: '0.9rem' }}>Plan Trips. Track Expenses. Split Fairly.</p>
          </div>

          <div style={{ display: 'flex', gap: '3rem', fontSize: '0.9rem' }}>
            <Link to="/login">Login</Link>
            <Link to="/signup">Register</Link>
            <Link to="/dashboard">Dashboard Prototype</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
