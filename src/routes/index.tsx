import { createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';

const getHealthStatus = createServerFn('GET', async () => {
  return {
    status: 'healthy',
    timestamp: new Date().toISOString(),
  };
});

export const Route = createFileRoute('/')({
  component: Home,
  loader: async () => {
    const health = await getHealthStatus();
    return { health };
  },
});

function Home() {
  const { health } = Route.useLoaderData();

  return (
    <div className="home-container">
      <header className="hero">
        <h1>AaronOS</h1>
        <p className="tagline">
          Unified AI Platform for Research, Content Creation & Accessibility
        </p>
      </header>

      <div className="modules-grid">
        <ModuleCard
          title="Lucy AI Research"
          description="Autonomous research agent for competitor analysis and market insights"
          href="/lucy"
          icon="🔍"
          status={health.status}
        />

        <ModuleCard
          title="eBook Machine"
          description="AI-powered eBook generation from outlines to finished documents"
          href="/ebook"
          icon="📚"
          status={health.status}
        />

        <ModuleCard
          title="WCAG Scanner"
          description="Automated accessibility compliance scanning and reporting"
          href="/wcag"
          icon="♿"
          status={health.status}
        />
      </div>

      <div className="features">
        <h2>Platform Features</h2>
        <div className="features-grid">
          <Feature icon="🤖" title="Autonomous Agents" desc="Self-running AI agents with progress tracking" />
          <Feature icon="💳" title="Subscriptions" desc="Integrated billing with Stripe" />
          <Feature icon="🔐" title="Authentication" desc="Secure user management" />
          <Feature icon="📊" title="Health Monitoring" desc="Real-time system status" />
          <Feature icon="⏰" title="Job Scheduler" desc="Automated tasks and backups" />
          <Feature icon="🔒" title="Security" desc="Suspicious activity detection" />
        </div>
      </div>

      <div className="system-status">
        <h3>System Status</h3>
        <div className={`status-badge ${health.status}`}>
          {health.status === 'healthy' ? '✓' : '⚠'} {health.status}
        </div>
        <p className="status-time">Last checked: {new Date(health.timestamp).toLocaleString()}</p>
      </div>
    </div>
  );
}

interface ModuleCardProps {
  title: string;
  description: string;
  href: string;
  icon: string;
  status: string;
}

function ModuleCard({ title, description, href, icon, status }: ModuleCardProps) {
  return (
    <a href={href} className="module-card">
      <div className="module-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
      <div className={`module-status ${status}`}>
        <span>●</span> {status}
      </div>
    </a>
  );
}

interface FeatureProps {
  icon: string;
  title: string;
  desc: string;
}

function Feature({ icon, title, desc }: FeatureProps) {
  return (
    <div className="feature-item">
      <div className="feature-icon">{icon}</div>
      <h4>{title}</h4>
      <p>{desc}</p>
    </div>
  );
}
