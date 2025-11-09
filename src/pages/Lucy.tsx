import { Link } from '@tanstack/react-router';

const discoveryLanes = [
  'Opportunity radar powered by multi-source intel ingestion',
  'Narrative builder for executive-ready briefings',
  'Battlecard composer with automatic win/loss positioning',
];

const analystView = [
  {
    title: 'Signal feed',
    description: 'Benchmark pricing, hiring velocity, and sentiment across competitors in a unified feed.',
  },
  {
    title: 'Insight canvas',
    description: 'Drag annotated findings into reusable canvases for ICP updates or board reports.',
  },
  {
    title: 'Action hub',
    description: 'Commit GTM experiments and assign owners with click-to-sync Slack and HubSpot integrations.',
  },
];

export function LucyPage() {
  return (
    <div className="grid">
      <section className="section-card hero">
        <span className="pill">Lucy module</span>
        <h1>Answer market questions in minutes, not weeks.</h1>
        <p>
          Lucy ingests primary and secondary research streams, distills the signal from the noise, and packages the insight into
          stakeholder-ready narratives. Activate watchlists, synthesize interviews, and publish intelligence in one focused workspace.
        </p>
        <div className="button-row">
          <Link to="/ebook-machine" className="secondary-button">
            Send insights to eBook Machine
          </Link>
        </div>
      </section>

      <section className="section-card">
        <div className="section-heading">
          <h2>Core research lanes</h2>
          <span>Workflow templates to jumpstart discovery</span>
        </div>
        <ul className="feature-grid">
          {discoveryLanes.map((lane) => (
            <li key={lane}>{lane}</li>
          ))}
        </ul>
      </section>

      <section className="section-card">
        <div className="section-heading">
          <h2>Analyst cockpit</h2>
          <span>Stay in flow with context-aware surfaces</span>
        </div>
        <div className="grid grid-2">
          {analystView.map((item) => (
            <article key={item.title} className="section-card">
              <h2>{item.title}</h2>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
