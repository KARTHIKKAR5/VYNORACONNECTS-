import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Zap,
  Users,
  Briefcase,
  Layers,
  GraduationCap,
  Sparkles,
  BookOpen,
  MessageSquare,
  Activity,
  ArrowRight,
  Menu,
  X,
  Compass,
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

const FEATURES = [
  {
    icon: Users,
    title: 'Student Networking',
    desc: 'Connect with students from different colleges across India. Discover peers with aligned technical interests, shared ambitions, and complementary skills.',
    badge: 'Core Network',
    color: '#6366F1',
  },
  {
    icon: Briefcase,
    title: 'Opportunities Hub',
    desc: 'Discover verified hackathons, internships, open-source grants, case competitions, and research scholarships curated specifically for ambitious students.',
    badge: 'Curated',
    color: '#10B981',
  },
  {
    icon: Layers,
    title: 'Project Collaboration',
    desc: 'Find project teammates, pitch ideas, recruit specialized roles (frontend, AI, backend, UI/UX), and build production-grade projects together.',
    badge: 'Builder Squads',
    color: '#A855F7',
  },
  {
    icon: GraduationCap,
    title: 'Clubs & Events',
    desc: 'Explore college communities, technical symposiums, workshops, webinars, and cultural fests happening across participating campuses.',
    badge: 'Campus Life',
    color: '#F59E0B',
  },
  {
    icon: Sparkles,
    title: 'Mentorship',
    desc: 'Connect with experienced senior students, alumni, and industry professionals for 1-on-1 career guidance, resume reviews, and mock interviews.',
    badge: '1-on-1 Guidance',
    color: '#EC4899',
  },
  {
    icon: BookOpen,
    title: 'Study Resources',
    desc: 'Access structured roadmaps, subject notes, curated repositories, cheat sheets, and interview prep materials shared by top-performing students.',
    badge: 'Knowledge Base',
    color: '#3B82F6',
  },
  {
    icon: MessageSquare,
    title: 'Communication',
    desc: 'Real-time student chats, project squad channels, and campus group messaging to keep collaboration fluid without switching apps.',
    badge: 'Real-time',
    color: '#06B6D4',
  },
  {
    icon: Activity,
    title: 'Vynora Pulse',
    desc: 'A live, personalized campus activity feed spotlighting hackathon wins, published projects, new team openings, and trending discussions.',
    badge: 'Live Feed',
    color: '#E11D48',
  },
];

const JOURNEY_STEPS = [
  {
    step: '01',
    title: 'Discover',
    desc: 'Find students from different colleges, discover trending opportunities, and locate active project squads.',
  },
  {
    step: '02',
    title: 'Connect',
    desc: 'Build meaningful connections with peers who share your passions, tech stack, and career goals.',
  },
  {
    step: '03',
    title: 'Collaborate',
    desc: 'Form multidisciplinary teams, participate in national hackathons, and ship impactful real-world software.',
  },
  {
    step: '04',
    title: 'Communicate',
    desc: 'Coordinate in real-time, exchange knowledge, share project milestones, and learn collaboratively.',
  },
  {
    step: '05',
    title: 'Grow',
    desc: 'Build an indisputable portfolio, earn peer endorsements, get mentored, and accelerate your career.',
  },
];

export function LandingPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const scrollTo = (id) => {
    setMobileNavOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="landing-page-wrapper">
      {/* Top Navigation */}
      <header className="landing-header">
        <div className="landing-nav-container">
          <Link to="/" className="landing-brand">
            <div className="landing-brand-icon">
              <Zap size={20} />
            </div>
            <div className="landing-brand-text">
              <span className="landing-brand-name">VYNORA</span>
              <span className="landing-brand-badge">CONNECT</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="landing-nav-links">
            <button type="button" onClick={() => scrollTo('hero')} className="landing-nav-link">Home</button>
            <button type="button" onClick={() => scrollTo('what-we-offer')} className="landing-nav-link">What We Offer</button>
            <button type="button" onClick={() => scrollTo('about-connect')} className="landing-nav-link">About Vynora Connect</button>
            <button type="button" onClick={() => scrollTo('journey')} className="landing-nav-link">Student Journey</button>
          </nav>

          {/* Action CTAs */}
          <div className="landing-nav-actions">
            <Link to="/login" className="btn btn-outline btn-sm">Sign In</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="landing-mobile-toggle"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            aria-label="Toggle Navigation"
          >
            {mobileNavOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Nav Drawer */}
        {mobileNavOpen && (
          <div className="landing-mobile-menu">
            <button type="button" onClick={() => scrollTo('hero')} className="mobile-menu-item">Home</button>
            <button type="button" onClick={() => scrollTo('what-we-offer')} className="mobile-menu-item">What We Offer</button>
            <button type="button" onClick={() => scrollTo('about-connect')} className="mobile-menu-item">About Vynora Connect</button>
            <button type="button" onClick={() => scrollTo('journey')} className="mobile-menu-item">Student Journey</button>
            <div className="mobile-menu-actions">
              <Link to="/login" className="btn btn-outline btn-full">Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-full">Get Started</Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="hero" className="landing-hero-section">
        <div className="landing-hero-glow" />
        <div className="landing-container landing-hero-content">
          <div className="landing-hero-eyebrow">
            <span className="hero-eyebrow-dot" />
            <span className="hero-eyebrow-text">CONNECT STUDENTS BEYOND CAMPUS</span>
          </div>

          <h1 className="landing-hero-title">
            Your Campus Is <br />
            <span className="hero-title-highlight">Just the Beginning.</span>
          </h1>

          <p className="landing-hero-subtitle">
            Discover opportunities, connect with ambitious students across colleges, build meaningful projects, and grow beyond your campus boundaries with Vynora Connect.
          </p>

          <div className="landing-hero-ctas">
            <Link to="/register" className="btn btn-primary btn-lg hero-cta-btn">
              <span>Get Started Free</span>
              <ArrowRight size={18} />
            </Link>
            <button
              type="button"
              onClick={() => scrollTo('what-we-offer')}
              className="btn btn-outline btn-lg"
            >
              <Compass size={18} />
              <span>Explore Platform</span>
            </button>
          </div>

          {/* Proof / KPI Metrics Banner */}
          <div className="landing-metrics-strip">
            <div className="metric-item">
              <span className="metric-number">10,000+</span>
              <span className="metric-label">Active Students</span>
            </div>
            <div className="metric-divider" />
            <div className="metric-item">
              <span className="metric-number">200+</span>
              <span className="metric-label">Campuses Connected</span>
            </div>
            <div className="metric-divider" />
            <div className="metric-item">
              <span className="metric-number">1,500+</span>
              <span className="metric-label">Collaborative Projects</span>
            </div>
            <div className="metric-divider" />
            <div className="metric-item">
              <span className="metric-number">850+</span>
              <span className="metric-label">Live Opportunities</span>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section id="what-we-offer" className="landing-section">
        <div className="landing-container">
          <div className="section-header-center">
            <div className="section-pill">Ecosystem Features</div>
            <h2 className="section-title">What Vynora Offers</h2>
            <p className="section-desc">
              A comprehensive student technology and collaboration platform designed to elevate your collegiate journey.
            </p>
          </div>

          <div className="features-grid">
            {FEATURES.map((feat) => {
              const Icon = feat.icon;
              return (
                <div key={feat.title} className="feature-card">
                  <div className="feature-card-header">
                    <div
                      className="feature-icon-wrapper"
                      style={{
                        backgroundColor: `${feat.color}15`,
                        color: feat.color,
                        borderColor: `${feat.color}35`,
                      }}
                    >
                      <Icon size={24} />
                    </div>
                    <span className="feature-badge">{feat.badge}</span>
                  </div>
                  <h3 className="feature-card-title">{feat.title}</h3>
                  <p className="feature-card-desc">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Vynora Connect Section */}
      <section id="about-connect" className="landing-section landing-about-section">
        <div className="landing-container">
          <div className="about-split-layout">
            <div className="about-text-column">
              <div className="section-pill">The Platform</div>
              <h2 className="section-title">What is Vynora Connect?</h2>
              <p className="about-paragraph">
                <strong>Vynora Connect</strong> is the central student networking platform within the Vynora ecosystem. We believe that exceptional student talent shouldn't be confined to the walls of a single college campus.
              </p>
              <p className="about-paragraph">
                Whether you are looking for an AI engineer from another university to join your hackathon squad, seeking senior mentorship for product design, or hunting for off-campus internships, Vynora Connect brings India's student builders together into one cohesive digital ecosystem.
              </p>

              <div className="about-highlights-list">
                <div className="highlight-item">
                  <CheckCircle2 size={18} className="highlight-icon" />
                  <span>Verified college student identity with institution credentials</span>
                </div>
                <div className="highlight-item">
                  <CheckCircle2 size={18} className="highlight-icon" />
                  <span>Inter-college project matchmaking and hackathon recruitment</span>
                </div>
                <div className="highlight-item">
                  <CheckCircle2 size={18} className="highlight-icon" />
                  <span>Real-time activity feed highlighting cross-campus achievements</span>
                </div>
              </div>

              <div className="about-cta-row">
                <Link to="/register" className="btn btn-primary">
                  <span>Join Vynora Connect</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            <div className="about-card-column">
              <div className="about-preview-card">
                <div className="preview-card-topbar">
                  <div className="preview-dots">
                    <span className="dot red" />
                    <span className="dot yellow" />
                    <span className="dot green" />
                  </div>
                  <span className="preview-url">vynora.connect/hub</span>
                </div>
                <div className="preview-card-body">
                  <div className="preview-stat-card">
                    <div className="preview-stat-icon">
                      <TrendingUp size={20} color="#10B981" />
                    </div>
                    <div>
                      <div className="preview-stat-num">94% of members</div>
                      <div className="preview-stat-text">find project teammates within 48 hours</div>
                    </div>
                  </div>

                  <div className="preview-stat-card">
                    <div className="preview-stat-icon">
                      <ShieldCheck size={20} color="#6366F1" />
                    </div>
                    <div>
                      <div className="preview-stat-num">Verified Campus Directory</div>
                      <div className="preview-stat-text">Authentic student identities across engineering &amp; design</div>
                    </div>
                  </div>

                  <div className="preview-stat-card">
                    <div className="preview-stat-icon">
                      <Zap size={20} color="#F59E0B" />
                    </div>
                    <div>
                      <div className="preview-stat-num">Zero Spam, High Signal</div>
                      <div className="preview-stat-text">Built specifically for students building real tech</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Student Journey Section */}
      <section id="journey" className="landing-section">
        <div className="landing-container">
          <div className="section-header-center">
            <div className="section-pill">Your Growth Pathway</div>
            <h2 className="section-title">The Student Journey</h2>
            <p className="section-desc">
              From discovering opportunities to shipping products and launching your career.
            </p>
          </div>

          <div className="journey-timeline">
            {JOURNEY_STEPS.map((step) => (
              <div key={step.step} className="journey-card">
                <div className="journey-number">{step.step}</div>
                <h3 className="journey-title">{step.title}</h3>
                <p className="journey-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="landing-cta-section">
        <div className="landing-container">
          <div className="cta-banner-card">
            <div className="cta-banner-content">
              <h2 className="cta-banner-title">
                Ready to connect beyond your campus?
              </h2>
              <p className="cta-banner-subtitle">
                Join thousands of students across the country building, learning, and competing together on Vynora Connect.
              </p>
              <div className="cta-banner-buttons">
                <Link to="/register" className="btn btn-primary btn-lg">
                  <span>Create Your Student Profile</span>
                  <ArrowRight size={18} />
                </Link>
                <Link to="/login" className="btn btn-outline btn-lg">
                  <span>Sign In</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-container">
          <div className="footer-top">
            <div className="footer-brand-col">
              <div className="landing-brand">
                <div className="landing-brand-icon">
                  <Zap size={18} />
                </div>
                <span className="landing-brand-name">VYNORA CONNECT</span>
              </div>
              <p className="footer-tagline">
                CONNECT STUDENTS BEYOND CAMPUS.
              </p>
              <p className="footer-subtext">
                The modern student technology and professional collaboration ecosystem.
              </p>
            </div>

            <div className="footer-links-col">
              <span className="footer-col-title">Platform</span>
              <button type="button" onClick={() => scrollTo('what-we-offer')} className="footer-link">Features</button>
              <button type="button" onClick={() => scrollTo('about-connect')} className="footer-link">About Connect</button>
              <button type="button" onClick={() => scrollTo('journey')} className="footer-link">Student Journey</button>
            </div>

            <div className="footer-links-col">
              <span className="footer-col-title">Modules</span>
              <Link to="/login" className="footer-link">Campus Network</Link>
              <Link to="/login" className="footer-link">Opportunities</Link>
              <Link to="/login" className="footer-link">Project Squads</Link>
              <Link to="/login" className="footer-link">Study Resources</Link>
            </div>

            <div className="footer-links-col">
              <span className="footer-col-title">Access</span>
              <Link to="/login" className="footer-link">Student Login</Link>
              <Link to="/register" className="footer-link">Create Account</Link>
              <Link to="/forgot-password" className="footer-link">Forgot Password</Link>
            </div>
          </div>

          <div className="footer-bottom">
            <span>&copy; {new Date().getFullYear()} Vynora Connect. All rights reserved.</span>
            <span className="footer-motto">Built for ambitious students across campuses.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
