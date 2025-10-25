import { Link } from '@tanstack/react-router';

const productionFlow = [
  {
    title: 'Blueprint',
    details: 'Ingest briefs, podcasts, or outlines to auto-generate a structured chapter system.',
  },
  {
    title: 'Draft',
    details: 'Layer on AI-assisted prose, visual placeholders, and reference callouts with one click.',
  },
  {
    title: 'Polish',
    details: 'Run editorial passes for tone, grammar, and narrative pacing tuned to your brand voice.',
  },
  {
    title: 'Publish',
    details: 'Export responsive EPUB, print-ready PDF, or push directly to Ghost and Webflow.',
  },
];

const exportOptions = ['Ghost CMS', 'Webflow', 'Airtable knowledge base', 'Google Drive', 'Notion', 'Direct download'];

export function EbookMachinePage() {
  return (
    <div className="grid">
      <section className="section-card hero">
        <span className="pill">eBook Machine module</span>
        <h1>Ship publish-ready assets without leaving AaronOS.</h1>
        <p>
          The eBook Machine transforms your validated research into immersive reading experiences. Generate visuals, manage
          revision history, and collect stakeholder approvals from a single, guided production flow.
        </p>
        <div className="button-row">
          <Link to="/lucy" className="secondary-button">
            Back to Lucy insights
          </Link>
        </div>
      </section>

      <section className="section-card">
        <div className="section-heading">
          <h2>Production pipeline</h2>
          <span>Four orchestrated phases keep your team aligned</span>
        </div>
        <div className="grid grid-2">
          {productionFlow.map((step) => (
            <article key={step.title} className="section-card">
              <h2>{step.title}</h2>
              <p>{step.details}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-card">
        <div className="section-heading">
          <h2>Distribution integrations</h2>
          <span>Deliver content where your audience already lives</span>
        </div>
        <ul className="chip-list">
          {exportOptions.map((option) => (
            <li key={option}>{option}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
