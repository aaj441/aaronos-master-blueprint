import { useState, useEffect } from 'react'
import { cn } from '../lib/utils'

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'high-contrast'>('dark')

  useEffect(() => {
    const savedTheme = localStorage.getItem('aaronos-theme') as 'light' | 'dark' | 'high-contrast'
    if (savedTheme) {
      setTheme(savedTheme)
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setTheme(prefersDark ? 'dark' : 'light')
    }
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('aaronos-theme', theme)
  }, [theme])

  const cycleTheme = () => {
    setTheme(prev => {
      switch (prev) {
        case 'dark': return 'light'
        case 'light': return 'high-contrast'
        case 'high-contrast': return 'dark'
        default: return 'dark'
      }
    })
  }

  const getThemeIcon = () => {
    switch (theme) {
      case 'light': return '☀️'
      case 'dark': return '🌙'
      case 'high-contrast': return '🔆'
      default: return '🌙'
    }
  }

  const getThemeLabel = () => {
    switch (theme) {
      case 'light': return 'Light theme'
      case 'dark': return 'Dark theme'
      case 'high-contrast': return 'High contrast theme'
      default: return 'Dark theme'
    }
  }

  return (
    <button
      onClick={cycleTheme}
      className={cn(
        "flex items-center justify-center w-10 h-10 rounded-lg",
        "bg-[var(--color-input-bg)] hover:bg-[var(--color-primary)]",
        "border border-[var(--color-border)] hover:border-[var(--color-primary)]",
        "text-[var(--color-text)] hover:text-white",
        "transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2"
      )}
      aria-label={getThemeLabel()}
      title={getThemeLabel()}
    >
      <span className="text-lg">{getThemeIcon()}</span>
    </button>
  )
}