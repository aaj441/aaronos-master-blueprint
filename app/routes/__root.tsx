import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import type { ReactNode } from 'react'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>AaronOS - AI-Powered Business Intelligence Platform</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <style>{styles}</style>
      </head>
      <body>
        <div id="root">
          <Outlet />
        </div>
        <TanStackRouterDevtools position="bottom-right" />
      </body>
    </html>
  )
}

const styles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    color: #e2e8f0;
    min-height: 100vh;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 2rem;
    background: rgba(15, 23, 42, 0.8);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(148, 163, 184, 0.2);
  }

  .logo {
    font-size: 1.5rem;
    font-weight: 700;
    background: linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .nav {
    display: flex;
    gap: 2rem;
    align-items: center;
  }

  .nav a {
    color: #cbd5e1;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s;
  }

  .nav a:hover,
  .nav a.active {
    color: #14b8a6;
  }

  .btn {
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    text-decoration: none;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    display: inline-block;
    font-size: 1rem;
  }

  .btn-primary {
    background: linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%);
    color: white;
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(20, 184, 166, 0.3);
  }

  .btn-secondary {
    background: rgba(148, 163, 184, 0.1);
    color: #cbd5e1;
    border: 1px solid rgba(148, 163, 184, 0.2);
  }

  .btn-secondary:hover {
    background: rgba(148, 163, 184, 0.15);
    border-color: rgba(148, 163, 184, 0.3);
  }

  .card {
    background: rgba(30, 41, 59, 0.5);
    border: 1px solid rgba(148, 163, 184, 0.2);
    border-radius: 12px;
    padding: 2rem;
    backdrop-filter: blur(10px);
  }

  .input {
    width: 100%;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    background: rgba(15, 23, 42, 0.6);
    border: 1px solid rgba(148, 163, 184, 0.2);
    color: #e2e8f0;
    font-size: 1rem;
    transition: all 0.2s;
  }

  .input:focus {
    outline: none;
    border-color: #14b8a6;
    box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.1);
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    color: #cbd5e1;
    font-weight: 500;
  }

  h1, h2, h3 {
    color: #f1f5f9;
  }

  h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  h2 {
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  h3 {
    font-size: 1.5rem;
    margin-bottom: 0.75rem;
  }

  p {
    line-height: 1.6;
    color: #cbd5e1;
  }
`
