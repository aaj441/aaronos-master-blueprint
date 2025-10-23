import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/lucy')({
  component: LucyPage,
})

function LucyPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'demo'>('overview')
  const [competitor, setCompetitor] = useState('')
  const [industry, setIndustry] = useState('')
  const [analyzing, setAnalyzing] = useState(false)

  const handleAnalyze = () => {
    setAnalyzing(true)
    // Simulate analysis
    setTimeout(() => setAnalyzing(false), 2000)
  }

  return (
    <>
      <header className="header">
        <Link to="/" className="logo">
          AaronOS
        </Link>
        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/lucy">Lucy</Link>
          <Link to="/ebook-machine">eBook Machine</Link>
          <Link to="/pricing">Pricing</Link>
          <Link to="/signin" className="btn btn-secondary">
            Sign In
          </Link>
        </nav>
      </header>

      <main className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem', marginTop: '2rem' }}>
          <h1>Lucy - AI Research Copilot</h1>
          <p style={{ fontSize: '1.25rem', color: '#94a3b8' }}>
            Your intelligent assistant for competitive analysis and market research
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', justifyContent: 'center' }}>
          <button
            className={`btn ${activeTab === 'overview' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`btn ${activeTab === 'demo' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('demo')}
          >
            Try Demo
          </button>
        </div>

        {activeTab === 'overview' && (
          <>
            <div className="card" style={{ marginBottom: '2rem' }}>
              <h2>Value Proposition</h2>
              <p style={{ fontSize: '1.125rem', marginBottom: '2rem' }}>
                Lucy transforms hours of manual research into minutes of AI-powered insights. Make data-driven decisions faster and stay ahead of your competition.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
                <div>
                  <h3 style={{ color: '#14b8a6', marginBottom: '0.5rem' }}>10x Faster Research</h3>
                  <p>Complete competitive analysis in minutes instead of days</p>
                </div>
                <div>
                  <h3 style={{ color: '#14b8a6', marginBottom: '0.5rem' }}>Real-Time Insights</h3>
                  <p>Stay updated with the latest market trends and competitor moves</p>
                </div>
                <div>
                  <h3 style={{ color: '#14b8a6', marginBottom: '0.5rem' }}>Strategic Advantage</h3>
                  <p>Identify opportunities and threats before your competitors do</p>
                </div>
              </div>
            </div>

            <div className="card" style={{ marginBottom: '2rem' }}>
              <h2>Key Features</h2>
              <div style={{ display: 'grid', gap: '1.5rem', marginTop: '1.5rem' }}>
                <div style={{ padding: '1.5rem', background: 'rgba(20, 184, 166, 0.05)', borderRadius: '8px', border: '1px solid rgba(20, 184, 166, 0.2)' }}>
                  <h3>Automated Competitor Analysis</h3>
                  <p>Lucy automatically gathers and analyzes competitor data from multiple sources, identifying strengths, weaknesses, and market positioning.</p>
                </div>
                <div style={{ padding: '1.5rem', background: 'rgba(20, 184, 166, 0.05)', borderRadius: '8px', border: '1px solid rgba(20, 184, 166, 0.2)' }}>
                  <h3>Market Trend Identification</h3>
                  <p>Discover emerging trends, consumer preferences, and industry shifts before they become mainstream.</p>
                </div>
                <div style={{ padding: '1.5rem', background: 'rgba(20, 184, 166, 0.05)', borderRadius: '8px', border: '1px solid rgba(20, 184, 166, 0.2)' }}>
                  <h3>Strategic Insight Generation</h3>
                  <p>Transform raw data into actionable strategies with AI-powered recommendations and opportunity identification.</p>
                </div>
                <div style={{ padding: '1.5rem', background: 'rgba(20, 184, 166, 0.05)', borderRadius: '8px', border: '1px solid rgba(20, 184, 166, 0.2)' }}>
                  <h3>Customizable Reports</h3>
                  <p>Generate professional reports tailored to your industry and specific research objectives.</p>
                </div>
              </div>
            </div>

            <div className="card" style={{ background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)', textAlign: 'center' }}>
              <h2>Unlock Lucy's Full Potential</h2>
              <p style={{ fontSize: '1.125rem', marginBottom: '2rem' }}>
                Start with a free trial, then upgrade to Lucy Pro for unlimited research and advanced features
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/signup" className="btn btn-primary" style={{ fontSize: '1.125rem', padding: '1rem 2rem' }}>
                  Start Free Trial
                </Link>
                <Link to="/pricing" className="btn btn-secondary" style={{ fontSize: '1.125rem', padding: '1rem 2rem' }}>
                  View Pricing
                </Link>
              </div>
            </div>
          </>
        )}

        {activeTab === 'demo' && (
          <div className="card">
            <h2>Try Lucy Demo</h2>
            <p style={{ marginBottom: '2rem' }}>Enter a competitor or industry to see Lucy in action</p>

            <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
              <div className="form-group">
                <label htmlFor="competitor">Competitor Name</label>
                <input
                  id="competitor"
                  type="text"
                  className="input"
                  placeholder="e.g., Salesforce, HubSpot"
                  value={competitor}
                  onChange={(e) => setCompetitor(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="industry">Industry</label>
                <input
                  id="industry"
                  type="text"
                  className="input"
                  placeholder="e.g., SaaS, E-commerce"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                />
              </div>
            </div>

            <button
              className="btn btn-primary"
              style={{ width: '100%', marginBottom: '2rem' }}
              onClick={handleAnalyze}
              disabled={analyzing || !competitor || !industry}
            >
              {analyzing ? 'Analyzing...' : 'Analyze Now'}
            </button>

            {analyzing && (
              <div style={{ textAlign: 'center', padding: '2rem', background: 'rgba(20, 184, 166, 0.05)', borderRadius: '8px' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔍</div>
                <p>Lucy is analyzing {competitor} in the {industry} industry...</p>
              </div>
            )}

            <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(251, 191, 36, 0.1)', border: '1px solid rgba(251, 191, 36, 0.3)', borderRadius: '8px' }}>
              <h3 style={{ color: '#fbbf24', marginBottom: '0.5rem' }}>Demo Mode</h3>
              <p>Sign up for a free account to save your research and access full analysis capabilities.</p>
              <Link to="/signup" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                Create Free Account
              </Link>
            </div>
          </div>
        )}
      </main>
    </>
  )
}
