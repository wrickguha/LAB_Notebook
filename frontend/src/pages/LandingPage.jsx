import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Beaker, BookOpen, Calculator, Check, ClipboardList, FileText, FlaskConical, FolderKanban, Mail, Menu, Moon, Network, NotebookPen, Sun, Users, X } from 'lucide-react';

const features = [
  { icon: NotebookPen, title: 'Electronic Lab Notebook', description: 'Record experiments, observations, protocols, and results in one organized digital workspace.' },
  { icon: FolderKanban, title: 'Research Management', description: 'Create, organize, and manage research projects from planning through results.' },
  { icon: Calculator, title: 'Scientific Tools', description: 'Perform essential laboratory calculations without leaving your research workflow.' },
  { icon: Users, title: 'Resource Sharing', description: 'Collaborate and share research resources with the people who need them.' },
  { icon: BookOpen, title: 'Research Papers', description: 'Keep your literature organized and close to the work it supports.' },
  { icon: Network, title: 'Research Calendar', description: 'Keep experiments, plans, and research activity visible in one place.' },
];

const tools = ['Plan and organize experiments', 'Record observations and research data', 'Perform essential scientific calculations', 'Keep protocols and literature together'];

function ProductPreview() {
  return (
    <div className="product-preview" aria-label="Inveniq Lab workspace preview">
      <div className="preview-toolbar"><div className="preview-dots" aria-hidden="true"><span /><span /><span /></div><div className="preview-address">app.inveniq-lab.com/workspace</div><div className="preview-avatar">IL</div></div>
      <div className="preview-body">
        <aside className="preview-sidebar"><div className="preview-brand"><span>I</span> Inveniq Lab</div><div className="preview-nav active"><NotebookPen size={14} /> Notebook</div><div className="preview-nav"><FolderKanban size={14} /> Projects</div><div className="preview-nav"><Calculator size={14} /> Scientific Tools</div><div className="preview-nav"><BookOpen size={14} /> Literature</div></aside>
        <div className="preview-content"><div className="preview-heading"><div><span className="preview-eyebrow">Research workspace</span><h3>My lab notebook</h3></div><button type="button" className="preview-add"><FileText size={13} /> New entry</button></div><div className="preview-panels"><div className="preview-panel preview-panel-large"><span>Notebook entries</span><strong>Start recording your research</strong><div className="preview-line" /><div className="preview-line short" /><div className="preview-line" /></div><div className="preview-panel"><span>Quick access</span><div className="preview-list"><div><Beaker size={14} /> Experiments</div><div><ClipboardList size={14} /> Protocols</div><div><FlaskConical size={14} /> Calculations</div></div></div></div></div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const [isNight, setIsNight] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  useEffect(() => { document.body.classList.toggle('overflow-hidden-mobile', mobileMenuOpen); return () => document.body.classList.remove('overflow-hidden-mobile'); }, [mobileMenuOpen]);
  const goToAuth = (signup = false) => navigate(signup ? '/auth?signup=true' : '/auth');
  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <div className={`landing-page ${isNight ? 'night-mode' : ''}`}>
      <header className="landing-header"><a className="landing-logo" href="#top" aria-label="Inveniq Lab home"><span>I</span><strong>Inveniq <em>Lab</em></strong></a><nav className="landing-nav" aria-label="Main navigation"><a href="#about">About</a><a href="#features">Features</a><a href="#tools">Scientific Tools</a><a href="#pricing">Pricing</a><a href="#contact">Contact</a></nav><div className="landing-actions"><button type="button" className="theme-toggle" onClick={() => setIsNight(!isNight)} aria-label={isNight ? 'Switch to day mode' : 'Switch to night mode'}>{isNight ? <Sun size={16} /> : <Moon size={16} />}</button><button type="button" className="login-button" onClick={() => goToAuth()}>Log in</button><button type="button" className="primary-button compact" onClick={() => goToAuth(true)}>Get Started Free <ArrowRight size={15} /></button></div><button type="button" className="mobile-menu-button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle navigation">{mobileMenuOpen ? <X /> : <Menu />}</button></header>
      {mobileMenuOpen && <nav className="mobile-nav" aria-label="Mobile navigation"><a href="#about" onClick={closeMenu}>About</a><a href="#features" onClick={closeMenu}>Features</a><a href="#tools" onClick={closeMenu}>Scientific Tools</a><a href="#pricing" onClick={closeMenu}>Pricing</a><a href="#contact" onClick={closeMenu}>Contact</a><button type="button" className="primary-button" onClick={() => { closeMenu(); goToAuth(true); }}>Get Started Free <ArrowRight size={16} /></button></nav>}
      <main id="top">
        <section className="hero-section page-width"><div className="hero-copy"><span className="section-kicker"><span className="kicker-dot" /> Digital research workspace</span><h1>Organize your research.<br /><span>Discover more.</span></h1><p>Inveniq Lab is an all-in-one digital research platform for planning experiments, recording observations, managing data, and performing scientific calculations.</p><div className="hero-buttons"><button type="button" className="primary-button" onClick={() => goToAuth(true)}>Get Started Free <ArrowRight size={17} /></button><a className="secondary-button" href="#features">Explore Features</a></div><div className="hero-note"><Check size={15} /> Built for focused, organized research</div></div><ProductPreview /></section>
        <section id="about" className="about-section page-width"><div className="section-label">01 / About Inveniq Lab</div><div className="about-grid"><h2>Simple tools for<br /><span>better research.</span></h2><div><p>Inveniq Lab is an Electronic Lab Notebook (ELN) and digital research workspace designed to bring essential research activities into one place.</p><p>From recording experiments and managing protocols to performing scientific calculations and organizing research data, Inveniq Lab makes research management easier, more organized, and more accessible.</p></div></div></section>
        <section id="features" className="features-section"><div className="page-width"><div className="section-label">02 / Everything in one place</div><div className="section-heading"><h2>Your research,<br /><span>connected.</span></h2><p>Stop switching between spreadsheets, calculators, and separate websites. Keep the work that matters together.</p></div><div className="feature-grid">{features.map(({ icon: Icon, title, description }) => <article className="feature-card" key={title}><div className="feature-icon"><Icon size={21} /></div><h3>{title}</h3><p>{description}</p><ArrowRight className="card-arrow" size={17} /></article>)}</div></div></section>
        <section id="tools" className="tools-section page-width"><div className="tools-copy"><div className="section-label">03 / Scientific tools</div><h2>Research tools that<br /><span>fit your workflow.</span></h2><p>Scientific calculations are designed to fit naturally into your research workflow, so your focus stays on the work.</p><div className="tool-list">{tools.map((tool) => <div key={tool}><Check size={17} />{tool}</div>)}</div></div><div className="calculator-card"><div className="calculator-top"><Calculator size={19} /><span>Scientific tools</span><span className="status-dot" /></div><div className="calculator-screen"><small>Calculation workspace</small><strong>Ready when your research is</strong><span>Choose a tool to begin</span></div><div className="calculator-buttons"><span>Molarity</span><span>Dilution</span><span>Concentration</span><span>More tools</span></div></div></section>
        <section id="pricing" className="pricing-section"><div className="page-width pricing-inner"><div><div className="section-label">04 / Pricing</div><h2>Choose the plan<br /><span>that fits your lab.</span></h2><p>Start with the plan that suits your research. Upgrade as your work grows.</p></div><div className="pricing-options"><div className="plan-card"><span>Monthly</span><strong>Flexible</strong><p>For researchers getting started.</p><button type="button" onClick={() => goToAuth(true)}>Get Started <ArrowRight size={15} /></button></div><div className="plan-card featured"><span>Long-term</span><strong>Focused</strong><p>For research teams building momentum.</p><button type="button" onClick={() => goToAuth(true)}>Get Started <ArrowRight size={15} /></button></div></div></div></section>
        <section id="contact" className="contact-section page-width"><div className="contact-icon"><Mail size={22} /></div><div><div className="section-label">05 / Get in touch</div><h2>Have a question or want to learn more?</h2><p>We would love to hear from you. Tell us about your laboratory or research team.</p></div><a className="secondary-button" href="mailto:hello@inveniq-lab.com">Contact us <ArrowRight size={16} /></a></section>
        <section className="final-cta"><div className="page-width"><span className="section-kicker"><span className="kicker-dot" /> Make research easier</span><h2>Bring your research<br /><span>into one place.</span></h2><button type="button" className="primary-button" onClick={() => goToAuth(true)}>Get Started Free <ArrowRight size={17} /></button></div></section>
      </main>
      <footer className="landing-footer page-width"><a className="landing-logo" href="#top"><span>I</span><strong>Inveniq <em>Lab</em></strong></a><p>Digital tools for better research.</p><span>© 2026 Inveniq Lab</span></footer>
    </div>
  );
}
