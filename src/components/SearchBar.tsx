import { useState, useRef, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { cn } from '../lib/utils'

export function SearchBar() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Array<{ name: string; href: string; icon: string }>>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const searchItems = [
    { name: 'Dashboard', href: '/', icon: '🏠' },
    { name: 'Lucy Research', href: '/lucy', icon: '🔍' },
    { name: 'eBook Machine', href: '/ebook-machine', icon: '📚' },
    { name: 'WCAG Scanner', href: '/scanner', icon: '♿' },
    { name: 'Voice Coach', href: '/voice-coach', icon: '🎤' },
    { name: 'Settings', href: '/settings', icon: '⚙️' },
  ]

  useEffect(() => {
    if (query.trim()) {
      const filtered = searchItems.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase())
      )
      setResults(filtered)
    } else {
      setResults([])
    }
  }, [query])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsOpen(true)
        inputRef.current?.focus()
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
        setQuery('')
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleResultClick = (href: string) => {
    navigate({ to: href })
    setIsOpen(false)
    setQuery('')
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "flex items-center space-x-2 px-3 py-2 rounded-lg",
          "bg-[var(--color-input-bg)] border border-[var(--color-border)]",
          "text-[var(--color-muted)] hover:text-[var(--color-text)]",
          "transition-colors duration-200",
          "focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        )}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="hidden sm:inline">Search...</span>
        <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-xs font-medium text-[var(--color-muted)] bg-[var(--color-surface)] border border-[var(--color-border)] rounded">
          ⌘K
        </kbd>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50">
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg shadow-lg">
            <div className="p-3 border-b border-[var(--color-border)]">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search modules..."
                className="w-full px-3 py-2 bg-[var(--color-input-bg)] border border-[var(--color-border)] rounded-md text-[var(--color-text)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                autoFocus
              />
            </div>
            
            {results.length > 0 && (
              <div className="py-2">
                {results.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => handleResultClick(item.href)}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-[var(--color-input-bg)] transition-colors"
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-[var(--color-text)]">{item.name}</span>
                  </button>
                ))}
              </div>
            )}
            
            {query && results.length === 0 && (
              <div className="px-4 py-3 text-[var(--color-muted)] text-sm">
                No results found for "{query}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}