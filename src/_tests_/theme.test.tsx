import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { ThemeProvider } from '@/components/theme-provider'

describe('Theme Toggle', () => {
  it('renders theme toggle button', () => {
    render(
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <ThemeToggle />
      </ThemeProvider>
    )
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
  })

  it('shows theme options on click', () => {
    render(
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <ThemeToggle />
      </ThemeProvider>
    )
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(screen.getByText('Light')).toBeInTheDocument()
    expect(screen.getByText('Dark')).toBeInTheDocument()
    expect(screen.getByText('System')).toBeInTheDocument()
  })
})