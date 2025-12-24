import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { ReactNode } from 'react'
import { setupStore } from '@/test/test-utils'
import { useQuestions, useLanguage } from './questionsHooks'
import { LocaleEnum } from '@/types/api-types'

// Mock du service
vi.mock('@/services/questions.service', () => ({
  useGetQuestionsQuery: vi.fn(() => ({
    data: [],
    isLoading: false,
    isSuccess: true,
    isError: false,
    refetch: vi.fn(),
  })),
}))

import { useGetQuestionsQuery } from '@/services/questions.service'

describe('useQuestions', () => {
  let store: ReturnType<typeof setupStore>

  beforeEach(() => {
    store = setupStore()
    vi.clearAllMocks()
  })

  const wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  )

  it('returns initial state', () => {
    vi.mocked(useGetQuestionsQuery).mockReturnValue({
      data: undefined,
      isLoading: true,
      isSuccess: false,
      isError: false,
      refetch: vi.fn(),
    } as any)

    const { result } = renderHook(() => useQuestions(), { wrapper })

    expect(result.current.language).toBe(LocaleEnum.En)
    expect(result.current.isLoading).toBe(true)
    expect(result.current.isSuccess).toBe(false)
    expect(result.current.isFailed).toBe(false)
  })

  it('returns questions data when loaded', () => {
    const mockQuestions = [{ id: 1, label: 'Test Question' }]
    vi.mocked(useGetQuestionsQuery).mockReturnValue({
      data: mockQuestions,
      isLoading: false,
      isSuccess: true,
      isError: false,
      refetch: vi.fn(),
    } as any)

    const { result } = renderHook(() => useQuestions(), { wrapper })

    expect(result.current.questions).toEqual(mockQuestions)
    expect(result.current.isSuccess).toBe(true)
  })

  it('handles error state', () => {
    vi.mocked(useGetQuestionsQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      isSuccess: false,
      isError: true,
      refetch: vi.fn(),
    } as any)

    const { result } = renderHook(() => useQuestions(), { wrapper })

    expect(result.current.isFailed).toBe(true)
  })

  it('changes language', async () => {
    const mockRefetch = vi.fn()
    vi.mocked(useGetQuestionsQuery).mockReturnValue({
      data: [],
      isLoading: false,
      isSuccess: true,
      isError: false,
      refetch: mockRefetch,
    } as any)

    const { result } = renderHook(() => useQuestions(), { wrapper })

    expect(result.current.language).toBe(LocaleEnum.En)

    result.current.changeLanguage(LocaleEnum.Fr)

    await waitFor(() => {
      expect(result.current.language).toBe(LocaleEnum.Fr)
    })
  })

  it('calls loadQuestions', () => {
    const mockRefetch = vi.fn()
    vi.mocked(useGetQuestionsQuery).mockReturnValue({
      data: [],
      isLoading: false,
      isSuccess: true,
      isError: false,
      refetch: mockRefetch,
    } as any)

    const { result } = renderHook(() => useQuestions(), { wrapper })

    result.current.loadQuestions()

    expect(mockRefetch).toHaveBeenCalledTimes(1)
  })
})

describe('useLanguage', () => {
  let store: ReturnType<typeof setupStore>

  beforeEach(() => {
    store = setupStore()
    vi.clearAllMocks()
  })

  const wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  )

  it('returns current language', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper })

    expect(result.current.language).toBe(LocaleEnum.En)
  })

  it('changes language', async () => {
    const { result } = renderHook(() => useLanguage(), { wrapper })

    expect(result.current.language).toBe(LocaleEnum.En)

    result.current.changeLanguage(LocaleEnum.Fr)

    await waitFor(() => {
      expect(result.current.language).toBe(LocaleEnum.Fr)
    })
  })
})
