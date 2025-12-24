import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/test-utils'
import App from './App'

// Mock des composants
vi.mock('./components/header/HeaderComponent', () => ({
  HeaderComponent: () => <div>Header Component</div>,
}))

vi.mock('./page/FormPage', () => ({
  FormPage: () => <div>Form Page</div>,
}))

vi.mock('./components/ui/toaster', () => ({
  Toaster: () => <div>Toaster</div>,
}))

describe('App', () => {
  it('renders all main components', () => {
    renderWithProviders(<App />)

    expect(screen.getByText('Header Component')).toBeInTheDocument()
    expect(screen.getByText('Form Page')).toBeInTheDocument()
    expect(screen.getByText('Toaster')).toBeInTheDocument()
  })

  it('has correct container styling', () => {
    const { container } = renderWithProviders(<App />)
    const mainDiv = container.firstChild as HTMLElement

    expect(mainDiv).toHaveClass('min-h-screen', 'bg-background')
  })
})
