import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/ebook-machine')({
  component: EbookMachineComponent,
});

function EbookMachineComponent() {
  return (
    <section className="card">
      <h2>eBook Machine</h2>
      <p>
        The eBook Machine is an automated e‑book generator that turns outlines into polished
        documents.
      </p>

      <div style={{ marginTop: '2rem' }}>
        <h3>Features</h3>
        <ul style={{ lineHeight: '1.8' }}>
          <li>Automated e-book generation from outlines</li>
          <li>Professional formatting and styling</li>
          <li>Multiple export formats (PDF, EPUB, etc.)</li>
          <li>AI-powered content enhancement</li>
        </ul>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <p style={{ color: '#94a3b8' }}>
          eBook Machine interface coming soon. This is a placeholder for the full eBook Machine
          functionality.
        </p>
      </div>
    </section>
  );
}
