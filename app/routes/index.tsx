import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <>
      <header className="header">
        <div className="logo">AaronOS</div>
        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/lucy">Lucy</Link>
          <Link to="/ebook-machine">eBook Machine</Link>
          <Link to="/pricing">Pricing</Link>
          <Link to="/signin" className="btn btn-secondary">
            Sign In
          </Link>
          <Link to="/signup" className="btn btn-primary">
            Get Started
          </Link>
        </nav>
      </header>

      <main className="container">
        <section style={{ textAlign: 'center', padding: '4rem 0' }}>
          <h1>AI-Powered Business Intelligence Platform</h1>
          <p style={{ fontSize: '1.25rem', marginBottom: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            Unlock market insights and create professional content with Lucy AI Research Copilot and eBook Machine
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
            <Link to="/signup" className="btn btn-primary" style={{ fontSize: '1.125rem', padding: '1rem 2rem' }}>
              Start Free Trial
            </Link>
            <Link to="/pricing" className="btn btn-secondary" style={{ fontSize: '1.125rem', padding: '1rem 2rem' }}>
              View Pricing
            </Link>
          </div>
        </section>

        <section style={{ marginTop: '4rem' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>Powerful Modules for Your Business</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
            <div className="card">
              <h3>Lucy - AI Research Copilot</h3>
              <p style={{ marginBottom: '1.5rem' }}>
                Your AI-powered competitive intelligence assistant. Analyze competitors, explore markets, and generate strategic insights in minutes.
              </p>
              <ul style={{ marginBottom: '1.5rem', paddingLeft: '1.5rem', lineHeight: '2' }}>
                <li>Automated competitor analysis</li>
                <li>Market trend identification</li>
                <li>Strategic insight generation</li>
                <li>Real-time data synthesis</li>
              </ul>
              <Link to="/lucy" className="btn btn-primary" style={{ width: '100%', textAlign: 'center' }}>
                Explore Lucy
              </Link>
            </div>

            <div className="card">
              <h3>eBook Machine</h3>
              <p style={{ marginBottom: '1.5rem' }}>
                Transform your ideas into professional eBooks. Automated outline generation, content creation, and formatting for publication-ready documents.
              </p>
              <ul style={{ marginBottom: '1.5rem', paddingLeft: '1.5rem', lineHeight: '2' }}>
                <li>AI-powered outline generation</li>
                <li>Automated content creation</li>
                <li>Professional formatting</li>
                <li>Export to multiple formats</li>
              </ul>
              <Link to="/ebook-machine" className="btn btn-primary" style={{ width: '100%', textAlign: 'center' }}>
                Explore eBook Machine
              </Link>
            </div>
          </div>
        </section>

        <section style={{ marginTop: '4rem', textAlign: 'center', padding: '3rem', background: 'rgba(20, 184, 166, 0.1)', borderRadius: '12px' }}>
          <h2>Ready to Transform Your Business?</h2>
          <p style={{ fontSize: '1.125rem', marginBottom: '2rem' }}>
            Join thousands of businesses using AaronOS to gain competitive advantage
          </p>
          <Link to="/signup" className="btn btn-primary" style={{ fontSize: '1.125rem', padding: '1rem 2rem' }}>
            Start Your Free Trial Today
          </Link>
        </section>
      </main>
    </>
  )
}
