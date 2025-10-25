import { ReactNode } from 'react'
import { cn } from '../lib/utils'

interface MobileMenuProps {
  children: ReactNode
  isOpen: boolean
  onClose: () => void
}

export function MobileMenu({ children, isOpen, onClose }: MobileMenuProps) {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Menu */}
      <div
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-[var(--color-surface)] border-r border-[var(--color-border)] transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {children}
      </div>
    </>
  )
}