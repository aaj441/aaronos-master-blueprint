import { ReactNode, useState } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { ThemeToggle } from './ThemeToggle'
import { MobileMenu } from './MobileMenu'
import { SearchBar } from './SearchBar'
import { cn } from '../lib/utils'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  const navigation = [
    { name: 'Dashboard', href: '/', icon: '🏠' },
    { name: 'Lucy', href: '/lucy', icon: '🔍' },
    { name: 'eBook Machine', href: '/ebook-machine', icon: '📚' },
    { name: 'WCAG Scanner', href: '/scanner', icon: '♿' },
    { name: 'Voice Coach', href: '/voice-coach', icon: '🎤' },
  ]

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)]"
          aria-label="Open menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-[var(--color-surface)] border-r border-[var(--color-border)] transform transition-transform duration-300 ease-in-out lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-[var(--color-border)]">
          <h1 className="text-xl font-bold text-[var(--color-text)]">AaronOS v5</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md text-[var(--color-muted)] hover:text-[var(--color-text)]"
            aria-label="Close menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="mt-6 px-3">
          <ul className="space-y-1">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    location.pathname === item.href
                      ? "bg-[var(--color-primary)] text-white"
                      : "text-[var(--color-secondary-text)] hover:bg-[var(--color-input-bg)] hover:text-[var(--color-text)]"
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <ThemeToggle />
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-[var(--color-surface)] border-b border-[var(--color-border)]">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold text-[var(--color-text)]">
                {navigation.find(item => item.href === location.pathname)?.name || 'Dashboard'}
              </h2>
            </div>
            
            <div className="flex items-center space-x-4">
              <SearchBar />
              <div className="hidden lg:block">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          <div className="container mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}