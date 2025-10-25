import { createRootRoute, Link, Outlet } from '@tanstack/react-router';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <header>
        <h1>AaronOS v5</h1>
        <nav aria-label="Primary navigation">
          <Link to="/" className="button btn-secondary" activeProps={{ className: 'active' }}>
            Dashboard
          </Link>
          <Link to="/lucy" className="button btn-secondary" activeProps={{ className: 'active' }}>
            Lucy
          </Link>
          <Link to="/ebook-machine" className="button btn-secondary" activeProps={{ className: 'active' }}>
            eBook Machine
          </Link>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>
    </>
  );
}
