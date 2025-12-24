import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/test-utils'
import { MainForm } from './MainForm'

// Mock du hook useQuestions
vi.mock('@/store/slices/questions/questionsHooks', () => ({
  useQuestions: vi.fn(),
}))

// Mock du composant QuestionForm
vi.mock('../question/QuestionForm', () => ({
  QuestionForm: () => <div>Question Form</div>,
}))

import { useQuestions } from '@/store/slices/questions/questionsHooks'

describe('MainForm', () => {
  it('displays loading skeleton when loading', () => {
    vi.mocked(useQuestions).mockReturnValue({
      isLoading: true,
      isFailed: false,
      isSuccess: false,
      questions: undefined,
      language: 'fr' as any,
      loadQuestions: vi.fn(),
      changeLanguage: vi.fn(),
    })

    renderWithProviders(<MainForm />)

    // Vérifie que les skeletons sont affichés
    const skeletons = document.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('displays error alert when failed', () => {
    vi.mocked(useQuestions).mockReturnValue({
      isLoading: false,
      isFailed: true,
      isSuccess: false,
      questions: undefined,
      language: 'fr' as any,
      loadQuestions: vi.fn(),
      changeLanguage: vi.fn(),
    })

    renderWithProviders(<MainForm />)

    expect(screen.getByText('Error')).toBeInTheDocument()
    expect(
      screen.getByText(/Failed to load questions/i)
    ).toBeInTheDocument()
  })

  it('displays QuestionForm when successful', () => {
    vi.mocked(useQuestions).mockReturnValue({
      isLoading: false,
      isFailed: false,
      isSuccess: true,
      questions: [],
      language: 'fr' as any,
      loadQuestions: vi.fn(),
      changeLanguage: vi.fn(),
    })

    renderWithProviders(<MainForm />)

    expect(screen.getByText('Question Form')).toBeInTheDocument()
  })

  it('does not display content when still loading', () => {
    vi.mocked(useQuestions).mockReturnValue({
      isLoading: true,
      isFailed: false,
      isSuccess: false,
      questions: undefined,
      language: 'fr' as any,
      loadQuestions: vi.fn(),
      changeLanguage: vi.fn(),
    })

    renderWithProviders(<MainForm />)

    expect(screen.queryByText('Question Form')).not.toBeInTheDocument()
    expect(screen.queryByText('Error')).not.toBeInTheDocument()
  })
})
