import { Link } from '@tanstack/react-router';

const modules = [
  {
    name: 'Lucy',
    description: 'AI research copilot for accelerated market exploration and strategy sprints.',
    href: '/lucy',
    benefits: ['Competitor heatmaps', 'Voice of customer synthesis', 'Actionable GTM briefs'],
  },
  {
    name: 'eBook Machine',
    description: 'Turn outlines into beautifully formatted e-books with AI narration and layout.',
    href: '/ebook-machine',
    benefits: ['Template-aware drafting', 'Automated editing passes', 'Ready-to-export EPUB/PDF'],
  },
];

export function HomePage() {
  return (
    <>
      <section className="section-card hero">
        <span className="pill">Unified productivity stack</span>
        <h1>AaronOS brings your research and publishing workflows under one roof.</h1>
        <p>
          Launch the Lucy intelligence console to monitor markets in real time, then hand-off approved storylines to the eBook
          Machine to ship polished collateral. Every module shares a single authentication layer, design system, and data model.
        </p>
        <div className="button-row">
          <Link to="/lucy" className="primary-button">
            Explore Lucy
          </Link>
          <Link to="/ebook-machine" className="secondary-button">
            Generate an eBook
          </Link>
        </div>
      </section>

      <section className="section-card">
        <div className="section-heading">
          <h2>Workflows at a glance</h2>
          <span>Pick a module to dive deeper</span>
        </div>
        <div className="grid grid-2">
          {modules.map((module) => (
            <article key={module.name} className="section-card" aria-labelledby={`${module.name}-heading`}>
              <header>
                <h2 id={`${module.name}-heading`}>{module.name}</h2>
                <p>{module.description}</p>
              </header>
              <ul className="feature-grid">
                {module.benefits.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className="button-row">
                <Link to={module.href} className="secondary-button">
                  Open {module.name}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
