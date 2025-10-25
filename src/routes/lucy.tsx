import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createFileRoute('/lucy')({
  component: LucyPage,
});

function LucyPage() {
  const [query, setQuery] = useState('');
  const [includeCompetitors, setIncludeCompetitors] = useState(true);
  const [includeMarketData, setIncludeMarketData] = useState(true);
  const [depth, setDepth] = useState<'basic' | 'standard' | 'deep'>('standard');
  const [isLoading, setIsLoading] = useState(false);
  const [researchId, setResearchId] = useState<string | null>(null);
  const [status, setStatus] = useState<any>(null);

  const startResearch = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/trpc/lucy.createResearch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'demo-user', // TODO: Get from auth
          query,
          includeCompetitors,
          includeMarketData,
          depth,
        }),
      });
      const data = await response.json();
      setResearchId(data.result.data.researchId);
      pollStatus(data.result.data.researchId);
    } catch (error) {
      console.error('Failed to start research:', error);
      setIsLoading(false);
    }
  };

  const pollStatus = async (id: string) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/trpc/lucy.getResearch?input=${encodeURIComponent(JSON.stringify({ id }))}`);
        const data = await response.json();
        setStatus(data.result.data);

        if (data.result.data.status === 'completed' || data.result.data.status === 'failed') {
          clearInterval(interval);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Failed to fetch status:', error);
        clearInterval(interval);
        setIsLoading(false);
      }
    }, 2000);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>🔍 Lucy AI Research Copilot</h1>
        <p>Autonomous research agent for competitor analysis and market insights</p>
      </div>

      <div className="card">
        <h2>Start New Research</h2>

        <div className="form-group">
          <label htmlFor="query">Research Query</label>
          <textarea
            id="query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="E.g., Voice coaching market analysis for sales professionals"
            rows={4}
            className="input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="depth">Research Depth</label>
          <select
            id="depth"
            value={depth}
            onChange={(e) => setDepth(e.target.value as any)}
            className="select"
          >
            <option value="basic">Basic - Quick overview (5-10 min)</option>
            <option value="standard">Standard - Comprehensive analysis (15-20 min)</option>
            <option value="deep">Deep - Exhaustive research (30+ min)</option>
          </select>
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={includeCompetitors}
              onChange={(e) => setIncludeCompetitors(e.target.checked)}
            />
            Include Competitor Analysis
          </label>
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={includeMarketData}
              onChange={(e) => setIncludeMarketData(e.target.checked)}
            />
            Include Market Data
          </label>
        </div>

        <button
          onClick={startResearch}
          disabled={!query || isLoading}
          className="button btn-primary"
        >
          {isLoading ? 'Researching...' : 'Start Research'}
        </button>
      </div>

      {status && (
        <div className="card">
          <h2>Research Status</h2>
          <div className="status-display">
            <div className={`status-badge ${status.status}`}>
              {status.status}
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${status.progress}%` }} />
            </div>
            <p className="progress-text">{status.progress}% complete</p>
          </div>

          {status.status === 'completed' && status.results && (
            <div className="results">
              <h3>Results</h3>
              <div className="result-summary">
                <h4>Summary</h4>
                <p>{status.results.summary}</p>
              </div>

              {status.results.insights && status.results.insights.length > 0 && (
                <div className="insights">
                  <h4>Key Insights</h4>
                  <ul>
                    {status.results.insights.map((insight: string, i: number) => (
                      <li key={i}>{insight}</li>
                    ))}
                  </ul>
                </div>
              )}

              {status.results.competitors && status.results.competitors.length > 0 && (
                <div className="competitors">
                  <h4>Competitors</h4>
                  {status.results.competitors.map((comp: any, i: number) => (
                    <div key={i} className="competitor-card">
                      <h5>{comp.name}</h5>
                      <p>{comp.description}</p>
                      <div className="competitor-details">
                        <div>
                          <strong>Strengths:</strong>
                          <ul>
                            {comp.strengths.map((s: string, j: number) => (
                              <li key={j}>{s}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <strong>Weaknesses:</strong>
                          <ul>
                            {comp.weaknesses.map((w: string, j: number) => (
                              <li key={j}>{w}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {status.status === 'failed' && (
            <div className="error-message">
              <strong>Error:</strong> {status.error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
