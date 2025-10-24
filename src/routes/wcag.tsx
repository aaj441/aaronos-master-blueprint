import { createFileRoute } from '@tanstack/react-router';
import WcagScanner from '../components/WcagScanner';

export const Route = createFileRoute('/wcag')({
  component: WcagPage,
});

function WcagPage() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>♿ WCAG Scanner</h1>
        <p>Automated accessibility compliance scanning and reporting</p>
      </div>
      <WcagScanner />
    </div>
  );
}
