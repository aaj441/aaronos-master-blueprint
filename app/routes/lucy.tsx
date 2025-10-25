import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/lucy')({
  component: LucyComponent,
});

function LucyComponent() {
  return (
    <section className="card">
      <h2>Lucy – AI Research Copilot</h2>
      <p>
        Lucy is your AI research copilot for competitor analysis, market exploration, and
        strategy formulation.
      </p>

      <div style={{ marginTop: '2rem' }}>
        <h3>Features</h3>
        <ul style={{ lineHeight: '1.8' }}>
          <li>Competitor analysis and market research</li>
          <li>Strategic insights generation</li>
          <li>Market exploration and opportunity identification</li>
          <li>Data-driven decision support</li>
        </ul>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <p style={{ color: '#94a3b8' }}>
          Lucy module interface coming soon. This is a placeholder for the full Lucy functionality.
        </p>
      </div>
    </section>
  );
}
