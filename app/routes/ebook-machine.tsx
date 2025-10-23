import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/ebook-machine')({
  component: EbookMachinePage,
})

function EbookMachinePage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'demo'>('overview')
  const [title, setTitle] = useState('')
  const [topic, setTopic] = useState('')
  const [generating, setGenerating] = useState(false)

  const handleGenerate = () => {
    setGenerating(true)
    setTimeout(() => setGenerating(false), 2000)
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
          <h1>eBook Machine</h1>
          <p style={{ fontSize: '1.25rem', color: '#94a3b8' }}>
            Transform your ideas into professional eBooks in minutes
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
                Create publication-ready eBooks without the weeks of writing and formatting. From idea to finished product in hours, not months.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
                <div>
                  <h3 style={{ color: '#06b6d4', marginBottom: '0.5rem' }}>100x Faster Creation</h3>
                  <p>Generate complete eBooks in hours instead of months</p>
                </div>
                <div>
                  <h3 style={{ color: '#06b6d4', marginBottom: '0.5rem' }}>Professional Quality</h3>
                  <p>Publication-ready formatting and structure out of the box</p>
                </div>
                <div>
                  <h3 style={{ color: '#06b6d4', marginBottom: '0.5rem' }}>Multiple Formats</h3>
                  <p>Export to PDF, EPUB, MOBI, and more with one click</p>
                </div>
              </div>
            </div>

            <div className="card" style={{ marginBottom: '2rem' }}>
              <h2>Key Features</h2>
              <div style={{ display: 'grid', gap: '1.5rem', marginTop: '1.5rem' }}>
                <div style={{ padding: '1.5rem', background: 'rgba(6, 182, 212, 0.05)', borderRadius: '8px', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
                  <h3>AI-Powered Outline Generation</h3>
                  <p>Start with a topic and let AI create a comprehensive, well-structured outline for your eBook.</p>
                </div>
                <div style={{ padding: '1.5rem', background: 'rgba(6, 182, 212, 0.05)', borderRadius: '8px', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
                  <h3>Automated Content Creation</h3>
                  <p>Generate engaging, well-researched content for each chapter based on your outline and preferences.</p>
                </div>
                <div style={{ padding: '1.5rem', background: 'rgba(6, 182, 212, 0.05)', borderRadius: '8px', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
                  <h3>Professional Formatting</h3>
                  <p>Automatic formatting with professional templates, table of contents, and citation management.</p>
                </div>
                <div style={{ padding: '1.5rem', background: 'rgba(6, 182, 212, 0.05)', borderRadius: '8px', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
                  <h3>Multi-Format Export</h3>
                  <p>Export your finished eBook to PDF, EPUB, MOBI, DOCX, and other popular formats.</p>
                </div>
              </div>
            </div>

            <div className="card" style={{ background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%)', textAlign: 'center' }}>
              <h2>Start Creating eBooks Today</h2>
              <p style={{ fontSize: '1.125rem', marginBottom: '2rem' }}>
                Free trial includes 1 eBook generation. Upgrade to eBook Pro for unlimited projects and advanced features
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
            <h2>Try eBook Machine Demo</h2>
            <p style={{ marginBottom: '2rem' }}>Enter your eBook idea to see the outline generation</p>

            <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
              <div className="form-group">
                <label htmlFor="title">eBook Title</label>
                <input
                  id="title"
                  type="text"
                  className="input"
                  placeholder="e.g., The Complete Guide to Digital Marketing"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="topic">Topic/Description</label>
                <input
                  id="topic"
                  type="text"
                  className="input"
                  placeholder="e.g., SEO, social media, content marketing strategies"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>
            </div>

            <button
              className="btn btn-primary"
              style={{ width: '100%', marginBottom: '2rem' }}
              onClick={handleGenerate}
              disabled={generating || !title || !topic}
            >
              {generating ? 'Generating Outline...' : 'Generate Outline'}
            </button>

            {generating && (
              <div style={{ textAlign: 'center', padding: '2rem', background: 'rgba(6, 182, 212, 0.05)', borderRadius: '8px' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📚</div>
                <p>Creating outline for "{title}"...</p>
              </div>
            )}

            <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(251, 191, 36, 0.1)', border: '1px solid rgba(251, 191, 36, 0.3)', borderRadius: '8px' }}>
              <h3 style={{ color: '#fbbf24', marginBottom: '0.5rem' }}>Demo Mode</h3>
              <p>Sign up for a free account to generate full eBooks and export to multiple formats.</p>
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
