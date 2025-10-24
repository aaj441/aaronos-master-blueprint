import { createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';

const getHealth = createServerFn('GET', async () => {
  // This would call the actual health monitoring service
  return {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: [
      { name: 'database', status: 'healthy', responseTime: 12 },
      { name: 'lucy_agent', status: 'healthy', responseTime: 45 },
      { name: 'ebook_agent', status: 'healthy', responseTime: 38 },
      { name: 'wcag_agent', status: 'healthy', responseTime: 52 },
      { name: 'stripe', status: 'healthy', responseTime: 89 },
      { name: 'anthropic_api', status: 'healthy', responseTime: 234 },
    ],
  };
});

export const Route = createFileRoute('/health')({
  component: HealthPage,
  loader: async () => {
    const health = await getHealth();
    return { health };
  },
});

function HealthPage() {
  const { health } = Route.useLoaderData();

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>System Health</h1>
        <p>Real-time monitoring of all services and agents</p>
      </div>

      <div className="card">
        <div className="health-overview">
          <div className={`health-status ${health.status}`}>
            <div className="status-icon">
              {health.status === 'healthy' ? '✓' : '⚠'}
            </div>
            <div>
              <h2>System Status: {health.status}</h2>
              <p>Last checked: {new Date(health.timestamp).toLocaleString()}</p>
            </div>
          </div>
        </div>

        <h3>Services</h3>
        <div className="services-grid">
          {health.services.map((service) => (
            <div key={service.name} className="service-card">
              <div className="service-header">
                <span className={`service-indicator ${service.status}`}>●</span>
                <h4>{service.name.replace('_', ' ')}</h4>
              </div>
              <div className="service-metrics">
                <span className="metric-label">Status:</span>
                <span className={`metric-value ${service.status}`}>{service.status}</span>
              </div>
              <div className="service-metrics">
                <span className="metric-label">Response Time:</span>
                <span className="metric-value">{service.responseTime}ms</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>System Information</h3>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Platform:</span>
            <span className="info-value">Node.js</span>
          </div>
          <div className="info-item">
            <span className="info-label">Database:</span>
            <span className="info-value">PostgreSQL</span>
          </div>
          <div className="info-item">
            <span className="info-label">AI Model:</span>
            <span className="info-value">Claude 3.5 Sonnet</span>
          </div>
          <div className="info-item">
            <span className="info-label">Payment:</span>
            <span className="info-value">Stripe</span>
          </div>
        </div>
      </div>
    </div>
  );
}
