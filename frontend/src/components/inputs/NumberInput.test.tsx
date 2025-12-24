import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormProvider, useForm } from 'react-hook-form'
import { renderWithProviders } from '@/test/test-utils'
import { NumberInput } from './NumberInput'
import { mockQuestion } from '@/test/mockData'
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

describe('NumberInput', () => {
  it('affiche le label de la question', () => {
    renderWithProviders(
      <FormWrapper>
        <NumberInput question={mockQuestion} />
      </FormWrapper>
    )

    expect(screen.getByText(mockQuestion.label)).toBeInTheDocument()
  })

  it("affiche un input de type number", () => {
    renderWithProviders(
      <FormWrapper>
        <NumberInput question={mockQuestion} />
      </FormWrapper>
    )

    const input = screen.getByPlaceholderText(/enter a number/i)
    expect(input).toHaveAttribute('type', 'number')
  })

  it('permet de saisir un nombre', async () => {
    const user = userEvent.setup()

    renderWithProviders(
      <FormWrapper>
        <NumberInput question={mockQuestion} />
      </FormWrapper>
    )

    const input = screen.getByPlaceholderText(/enter a number/i)
    await user.type(input, '42')

    expect(input).toHaveValue(42)
  })

  it('affiche le badge de l\'unité si présent', () => {
    const questionWithUnit = {
      ...mockQuestion,
      unit: 'kg',
    }

    renderWithProviders(
      <FormWrapper>
        <NumberInput question={questionWithUnit} />
      </FormWrapper>
    )

    expect(screen.getByText('kg')).toBeInTheDocument()
  })

  it('gère les valeurs vides (null)', async () => {
    const user = userEvent.setup()

    renderWithProviders(
      <FormWrapper>
        <NumberInput question={mockQuestion} />
      </FormWrapper>
    )

    const input = screen.getByPlaceholderText(/enter a number/i) as HTMLInputElement
    await user.type(input, '42')
    expect(input).toHaveValue(42)

    await user.clear(input)
    expect(input).toHaveValue(null)
  })
})
