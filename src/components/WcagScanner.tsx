/**
 * WCAG Scanner React Component
 *
 * Interactive accessibility scanner with wizard interface
 */

import React, { useState, useEffect } from 'react';

interface ScanConfig {
  domains: string[];
  benchmark: string;
}

interface ScanStatus {
  id: string;
  status: 'pending' | 'scanning' | 'completed' | 'failed';
  progress: number;
  error?: string;
}

interface ScanResult {
  overallScore: number;
  pagesScanned: number;
  totalViolations: number;
  criticalIssues: number;
  summary: {
    byImpact: Record<string, number>;
    byWcagLevel: Record<string, number>;
    commonIssues: Array<{
      id: string;
      impact: string;
      description: string;
      help: string;
    }>;
  };
}

const STEPS = [
  { id: 1, label: 'Keywords' },
  { id: 2, label: 'Discovery' },
  { id: 3, label: 'Scanning' },
  { id: 4, label: 'Overview' },
  { id: 5, label: 'Drilldown' },
];

export const WcagScanner: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [config, setConfig] = useState<ScanConfig>({
    domains: [],
    benchmark: 'finance',
  });
  const [scanStatus, setScanStatus] = useState<ScanStatus | null>(null);
  const [results, setResults] = useState<ScanResult | null>(null);
  const [targetDomains, setTargetDomains] = useState('');
  const [discoveredDomains, setDiscoveredDomains] = useState<string[]>([]);

  // Start scan
  const startScan = async () => {
    try {
      const response = await fetch('/api/wcag/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUrl: config.domains[0],
          domains: config.domains,
          benchmark: config.benchmark,
        }),
      });

      const data = await response.json();
      setScanStatus({
        id: data.scanId,
        status: 'scanning',
        progress: 0,
      });

      // Move to scanning step
      setCurrentStep(3);

      // Poll for status
      pollScanStatus(data.scanId);
    } catch (error) {
      console.error('Failed to start scan:', error);
    }
  };

  // Poll scan status
  const pollScanStatus = async (scanId: string) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/wcag/scan/${scanId}`);
        const data = await response.json();

        setScanStatus(data);

        if (data.status === 'completed') {
          clearInterval(interval);
          setResults(data.results);
          setCurrentStep(4);
        } else if (data.status === 'failed') {
          clearInterval(interval);
        }
      } catch (error) {
        console.error('Failed to fetch scan status:', error);
        clearInterval(interval);
      }
    }, 2000);
  };

  // Step 1: Keywords & Settings
  const renderKeywordsStep = () => (
    <div className="wizard-step">
      <h3>Step 1: Keywords & Settings</h3>
      <p>Enter the target domains you want to scan and choose an industry benchmark.</p>

      <label htmlFor="target-domains">Target domains</label>
      <input
        id="target-domains"
        type="text"
        placeholder="e.g., example.com, competitor.com"
        value={targetDomains}
        onChange={(e) => setTargetDomains(e.target.value)}
        className="input"
      />

      <label htmlFor="benchmark">Benchmark</label>
      <select
        id="benchmark"
        value={config.benchmark}
        onChange={(e) => setConfig({ ...config, benchmark: e.target.value })}
        className="select"
      >
        <option value="finance">Finance Accessibility Benchmark</option>
        <option value="retail">Retail Accessibility Benchmark</option>
        <option value="education">Education Accessibility Benchmark</option>
      </select>
    </div>
  );

  // Step 2: Discovery
  const renderDiscoveryStep = () => {
    const domains = targetDomains.split(',').map(d => d.trim()).filter(Boolean);

    return (
      <div className="wizard-step">
        <h3>Step 2: Discovery</h3>
        <p>Select the domains you'd like to include in the scan.</p>

        <div className="discovery-list">
          {domains.map((domain, idx) => (
            <label key={idx} className="checkbox-label">
              <input
                type="checkbox"
                checked={config.domains.includes(domain)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setConfig({ ...config, domains: [...config.domains, domain] });
                  } else {
                    setConfig({
                      ...config,
                      domains: config.domains.filter(d => d !== domain),
                    });
                  }
                }}
              />
              {domain}
            </label>
          ))}
        </div>
      </div>
    );
  };

  // Step 3: Scanning
  const renderScanningStep = () => (
    <div className="wizard-step">
      <h3>Step 3: Scanning</h3>

      <div className="progress-indicator">
        <div className="spinner" />
        <div>
          <p>Scanning in progress…</p>
          <p>Progress: {scanStatus?.progress || 0}%</p>
        </div>
      </div>

      <div className="scanning-summary">
        <div>
          <span>Status</span>
          <span>{scanStatus?.status || 'Initializing'}</span>
        </div>
        <div>
          <span>Progress</span>
          <span>{scanStatus?.progress || 0}%</span>
        </div>
      </div>
    </div>
  );

  // Step 4: Overview
  const renderOverviewStep = () => {
    if (!results) return null;

    return (
      <div className="wizard-step">
        <h3>Step 4: Overview</h3>
        <p>Summary of the scan results compared to your selected benchmark.</p>

        <div className="scanning-summary">
          <div>
            <span>Overall score</span>
            <span className={`score ${getScoreClass(results.overallScore)}`}>
              {results.overallScore}%
            </span>
          </div>
          <div>
            <span>Pages scanned</span>
            <span>{results.pagesScanned}</span>
          </div>
          <div>
            <span>Total violations</span>
            <span>{results.totalViolations}</span>
          </div>
          <div>
            <span>Critical issues</span>
            <span className="critical">{results.criticalIssues}</span>
          </div>
          <div>
            <span>Serious issues</span>
            <span>{results.summary.byImpact.serious || 0}</span>
          </div>
          <div>
            <span>Moderate issues</span>
            <span>{results.summary.byImpact.moderate || 0}</span>
          </div>
        </div>

        <div className="filters">
          <button type="button" className="button btn-secondary">
            By Impact
          </button>
          <button type="button" className="button btn-secondary">
            By WCAG Level
          </button>
          <button type="button" className="button btn-secondary">
            By Page
          </button>
        </div>
      </div>
    );
  };

  // Step 5: Drilldown
  const renderDrilldownStep = () => {
    if (!results) return null;

    return (
      <div className="wizard-step">
        <h3>Step 5: Drilldown & Export</h3>
        <p>Review issues by guideline and select your preferred export format.</p>

        <div className="issues-list">
          {results.summary.commonIssues.slice(0, 10).map((issue, idx) => (
            <div key={idx} className="issue-item">
              <strong className={`impact-${issue.impact}`}>
                {issue.id}
              </strong>
              <p>{issue.help}</p>
              <span className="impact-badge">{issue.impact}</span>
            </div>
          ))}
        </div>

        <div className="export-options">
          <h4>Export Options</h4>
          <label>
            <input type="radio" name="export" value="pdf" defaultChecked />
            PDF report
          </label>
          <label>
            <input type="radio" name="export" value="csv" />
            CSV issue log
          </label>
          <label>
            <input type="radio" name="export" value="json" />
            JSON for integrations
          </label>
        </div>

        <button
          type="button"
          className="button btn-primary"
          onClick={handleExport}
        >
          Export report
        </button>
      </div>
    );
  };

  // Get score class for color coding
  const getScoreClass = (score: number): string => {
    if (score >= 80) return 'good';
    if (score >= 60) return 'moderate';
    return 'poor';
  };

  // Handle export
  const handleExport = async () => {
    if (!scanStatus?.id) return;

    try {
      const response = await fetch(`/api/wcag/scan/${scanStatus.id}/export`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ format: 'pdf' }),
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wcag-report-${scanStatus.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  // Navigation handlers
  const handleNext = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      startScan();
    } else if (currentStep === 4) {
      setCurrentStep(5);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="wcag-scanner">
      <div className="card">
        {/* Stepper */}
        <ol className="stepper">
          {STEPS.map((step) => (
            <li key={step.id}>
              <button
                type="button"
                className={`button ${currentStep === step.id ? 'active' : ''}`}
                onClick={() => currentStep >= step.id && setCurrentStep(step.id)}
                aria-current={currentStep === step.id ? 'step' : undefined}
              >
                <span className="sr-only">Step {step.id}</span>
                <span>{step.label}</span>
              </button>
            </li>
          ))}
        </ol>

        <h2>WCAG Scanner Wizard</h2>
        <p>Configure your accessibility scan, monitor progress, and export actionable reports.</p>

        {/* Current Step Content */}
        <div className="wizard-content">
          {currentStep === 1 && renderKeywordsStep()}
          {currentStep === 2 && renderDiscoveryStep()}
          {currentStep === 3 && renderScanningStep()}
          {currentStep === 4 && renderOverviewStep()}
          {currentStep === 5 && renderDrilldownStep()}
        </div>

        {/* Navigation */}
        <div className="button-group">
          <button
            type="button"
            className="button btn-secondary"
            onClick={handlePrev}
            disabled={currentStep === 1 || currentStep === 3}
          >
            Previous
          </button>
          {currentStep < 5 && currentStep !== 3 && (
            <button
              type="button"
              className="button btn-primary"
              onClick={handleNext}
              disabled={currentStep === 2 && config.domains.length === 0}
            >
              {currentStep === 2 ? 'Start Scan' : 'Next'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WcagScanner;
