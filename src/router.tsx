import { useEffect } from 'react';
import {
  Link,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  useRouterState,
} from '@tanstack/react-router';
import { HomePage } from './pages/Home';
import { LucyPage } from './pages/Lucy';
import { EbookMachinePage } from './pages/EbookMachine';

const navigation = [
  { to: '/', label: 'Overview' },
  { to: '/lucy', label: 'Lucy' },
  { to: '/ebook-machine', label: 'eBook Machine' },
];

const RootComponent = () => {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  useEffect(() => {
    const label = navigation.find((item) => item.to === pathname)?.label ?? 'Overview';
    document.title = `AaronOS – ${label}`;
  }, [pathname]);

  return (
    <>
      <header className="navbar" role="banner">
        <Link to="/" className="brand">
          AaronOS
        </Link>
        <nav aria-label="Primary">
          <div className="nav-links">
            {navigation.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="nav-link"
                activeProps={{ className: 'nav-link active' }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        <span>
          Currently viewing <strong>{pathname}</strong>. Built with Vite, React, and TanStack Router.
        </span>{' '}
        <a href="https://github.com/aaronos" target="_blank" rel="noreferrer">
          View GitHub profile
        </a>
      </footer>
    </>
  );
};

const rootRoute = createRootRoute({ component: RootComponent });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const lucyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'lucy',
  component: LucyPage,
});

const ebookRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'ebook-machine',
  component: EbookMachinePage,
});

const routeTree = rootRoute.addChildren([indexRoute, lucyRoute, ebookRoute]);

export const router = createRouter({ routeTree });

export function AppRouter() {
  return <RouterProvider router={router} />;
}

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
