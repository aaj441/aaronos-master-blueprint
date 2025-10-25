import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <section className="card">
      <h2>Welcome to AaronOS</h2>
      <p>
        AaronOS is the unified codebase that powers the <strong>Lucy</strong> and{' '}
        <strong>eBook Machine</strong> modules.
      </p>

      <div style={{ marginTop: '2rem' }}>
        <h3>Available Modules</h3>
        <ul style={{ lineHeight: '1.8' }}>
          <li>
            <strong>Lucy</strong> – an AI research copilot for competitor analysis, market
            exploration, and strategy formulation.
          </li>
          <li>
            <strong>eBook Machine</strong> – an automated e‑book generator that turns outlines
            into polished documents.
          </li>
        </ul>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <p>Select a module from the navigation above to get started.</p>
      </div>
    </section>
  );
}
