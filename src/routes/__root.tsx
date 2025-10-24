import { createRootRoute, Outlet } from '@tanstack/react-router';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>AaronOS - Unified AI Platform</title>
        <link rel="stylesheet" href="/theme-perplexity.css" />
      </head>
      <body>
        <nav className="main-nav">
          <div className="nav-brand">
            <a href="/">AaronOS</a>
          </div>
          <div className="nav-links">
            <a href="/lucy">Lucy AI</a>
            <a href="/ebook">eBook Machine</a>
            <a href="/wcag">WCAG Scanner</a>
            <a href="/health">System Health</a>
          </div>
        </nav>
        <main>
          <Outlet />
        </main>
      </body>
    </html>
  );
}
