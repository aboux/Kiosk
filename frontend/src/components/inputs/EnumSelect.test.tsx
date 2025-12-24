import { describe, it, expect, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormProvider, useForm } from 'react-hook-form'
import { renderWithProviders } from '@/test/test-utils'
import { EnumSelect } from './EnumSelect'
import { mockEnumQuestion } from '@/test/mockData'
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

describe('EnumSelect', () => {
  it('affiche le label de la question', () => {
    renderWithProviders(
      <FormWrapper>
        <EnumSelect question={mockEnumQuestion} />
      </FormWrapper>
    )

    expect(screen.getByText(mockEnumQuestion.label)).toBeInTheDocument()
  })

  it('affiche un select avec placeholder', () => {
    renderWithProviders(
      <FormWrapper>
        <EnumSelect question={mockEnumQuestion} />
      </FormWrapper>
    )

    expect(screen.getByText(/select an option/i)).toBeInTheDocument()
  })

  it('affiche toutes les options disponibles', async () => {
    const user = userEvent.setup()

    renderWithProviders(
      <FormWrapper>
        <EnumSelect question={mockEnumQuestion} />
      </FormWrapper>
    )

    // Ouvre le select
    const trigger = screen.getByRole('combobox')
    await user.click(trigger)

    // Attend que le menu soit ouvert et vérifie que toutes les options sont présentes
    await waitFor(() => {
      mockEnumQuestion.enumValues.forEach((enumValue) => {
        expect(screen.getByText(enumValue.label)).toBeInTheDocument()
      })
    })
  })

  it('permet de sélectionner une option', async () => {
    const user = userEvent.setup()

    renderWithProviders(
      <FormWrapper>
        <EnumSelect question={mockEnumQuestion} />
      </FormWrapper>
    )

    // Ouvre le select
    const trigger = screen.getByRole('combobox')
    await user.click(trigger)

    // Attend que les options soient visibles et sélectionne une option
    await waitFor(() => {
      expect(screen.getByText('Male')).toBeInTheDocument()
    })

    const option = screen.getByText('Male')
    await user.click(option)

    // Vérifie que l'option est sélectionnée
    await waitFor(() => {
      expect(screen.getByText('Male')).toBeInTheDocument()
    })
  })

  it('affiche les options dans le bon ordre', async () => {
    const user = userEvent.setup()

    renderWithProviders(
      <FormWrapper>
        <EnumSelect question={mockEnumQuestion} />
      </FormWrapper>
    )

    // Ouvre le select
    const trigger = screen.getByRole('combobox')
    await user.click(trigger)

    // Attend que les options soient visibles et récupère toutes les options
    await waitFor(() => {
      const options = screen.getAllByRole('option')
      // Vérifie l'ordre
      expect(options[0]).toHaveTextContent('Male')
      expect(options[1]).toHaveTextContent('Female')
      expect(options[2]).toHaveTextContent('Other')
    })
  })

  it('gère le changement de sélection', async () => {
    const user = userEvent.setup()

    renderWithProviders(
      <FormWrapper>
        <EnumSelect question={mockEnumQuestion} />
      </FormWrapper>
    )

    // Ouvre le select et sélectionne Male
    let trigger = screen.getByRole('combobox')
    await user.click(trigger)

    await waitFor(() => {
      expect(screen.getByText('Male')).toBeInTheDocument()
    })

    await user.click(screen.getByText('Male'))

    // Vérifie la première sélection
    await waitFor(() => {
      expect(screen.getByText('Male')).toBeInTheDocument()
    })

    // Change la sélection pour Female
    trigger = screen.getByRole('combobox')
    await user.click(trigger)

    await waitFor(() => {
      expect(screen.getByText('Female')).toBeInTheDocument()
    })

    await user.click(screen.getByText('Female'))

    // Vérifie le changement
    await waitFor(() => {
      expect(screen.getByText('Female')).toBeInTheDocument()
    })
  })
})
