import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormProvider, useForm } from 'react-hook-form'
import { renderWithProviders } from '@/test/test-utils'
import { TextInput } from './TextInput'
import { mockTextQuestion } from '@/test/mockData'
import { ReactNode } from 'react'

// Mock du hook useAnswers
vi.mock('@/store/slices/answers/answersHooks', () => ({
  useAnswers: () => ({
    updateAnswer: vi.fn(),
  }),
}))

const FormWrapper = ({ children }: { children: ReactNode }) => {
  const methods = useForm({
    defaultValues: {
      answers: {},
    },
  })

  return <FormProvider {...methods}>{children}</FormProvider>
}

describe('TextInput', () => {
  it('affiche le label de la question', () => {
    renderWithProviders(
      <FormWrapper>
        <TextInput question={mockTextQuestion} />
      </FormWrapper>
    )

    expect(screen.getByText(mockTextQuestion.label)).toBeInTheDocument()
  })

  it('affiche un textarea', () => {
    renderWithProviders(
      <FormWrapper>
        <TextInput question={mockTextQuestion} />
      </FormWrapper>
    )

    const textarea = screen.getByPlaceholderText(/enter text/i)
    expect(textarea.tagName).toBe('TEXTAREA')
  })

  it('permet de saisir du texte', async () => {
    const user = userEvent.setup()

    renderWithProviders(
      <FormWrapper>
        <TextInput question={mockTextQuestion} />
      </FormWrapper>
    )

    const textarea = screen.getByPlaceholderText(/enter text/i)
    const testText = 'This is my feedback'

    await user.type(textarea, testText)

    expect(textarea).toHaveValue(testText)
  })

  it('permet de saisir du texte multiligne', async () => {
    const user = userEvent.setup()

    renderWithProviders(
      <FormWrapper>
        <TextInput question={mockTextQuestion} />
      </FormWrapper>
    )

    const textarea = screen.getByPlaceholderText(/enter text/i)
    const multilineText = 'Line 1\nLine 2\nLine 3'

    await user.type(textarea, multilineText.replace(/\n/g, '{Enter}'))

    expect(textarea).toHaveValue('Line 1\nLine 2\nLine 3')
  })

  it('gère les valeurs vides', async () => {
    const user = userEvent.setup()

    renderWithProviders(
      <FormWrapper>
        <TextInput question={mockTextQuestion} />
      </FormWrapper>
    )

    const textarea = screen.getByPlaceholderText(/enter text/i)

    await user.type(textarea, 'Some text')
    expect(textarea).toHaveValue('Some text')

    await user.clear(textarea)
    expect(textarea).toHaveValue('')
  })
})
