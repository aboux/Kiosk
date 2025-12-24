import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { ReactNode } from 'react'
import { useAnswers, useAnswer } from './answersHooks'
import answersReducer from './answersSlice'
import { baseApi } from '../../../services/baseApi'

// Mock du service API
vi.mock('../../../services/answers.service', () => ({
  useSaveAnswersMutation: () => {
    const saveAnswers = vi.fn().mockResolvedValue({ data: { message: 'Success' } })
    return [
      saveAnswers,
      {
        isLoading: false,
        isSuccess: false,
        isError: false,
      },
    ]
  },
}))

describe('useAnswers', () => {
  let store: ReturnType<typeof configureStore>

  beforeEach(() => {
    store = configureStore({
      reducer: {
        answers: answersReducer,
        [baseApi.reducerPath]: baseApi.reducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(baseApi.middleware),
    })
  })

  const wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  )

  it('should return initial empty answers', () => {
    const { result } = renderHook(() => useAnswers(), { wrapper })

    expect(result.current.answers).toEqual({})
    expect(result.current.isSaving).toBe(false)
    expect(result.current.isSaved).toBe(false)
    expect(result.current.isFailed).toBe(false)
  })

  it('should update answer when updateAnswer is called', () => {
    const { result } = renderHook(() => useAnswers(), { wrapper })

    act(() => {
      result.current.updateAnswer('1', 'Test Answer')
    })

    expect(result.current.answers['1']).toBe('Test Answer')
  })

  it('should update multiple answers', () => {
    const { result } = renderHook(() => useAnswers(), { wrapper })

    act(() => {
      result.current.updateAnswer('1', 'Answer 1')
      result.current.updateAnswer('2', 'Answer 2')
      result.current.updateAnswer('3', 42)
    })

    expect(result.current.answers).toEqual({
      '1': 'Answer 1',
      '2': 'Answer 2',
      '3': 42,
    })
  })

  it('should clear all answers when clear is called', () => {
    const { result } = renderHook(() => useAnswers(), { wrapper })

    act(() => {
      result.current.updateAnswer('1', 'Answer 1')
      result.current.updateAnswer('2', 'Answer 2')
    })

    expect(result.current.answers).toEqual({
      '1': 'Answer 1',
      '2': 'Answer 2',
    })

    act(() => {
      result.current.clear()
    })

    expect(result.current.answers).toEqual({})
  })

  it('should handle null values', () => {
    const { result } = renderHook(() => useAnswers(), { wrapper })

    act(() => {
      result.current.updateAnswer('1', 'Initial Value')
      result.current.updateAnswer('1', null)
    })

    expect(result.current.answers['1']).toBeNull()
  })

  it('should update existing answer', () => {
    const { result } = renderHook(() => useAnswers(), { wrapper })

    act(() => {
      result.current.updateAnswer('1', 'Old Answer')
    })

    expect(result.current.answers['1']).toBe('Old Answer')

    act(() => {
      result.current.updateAnswer('1', 'New Answer')
    })

    expect(result.current.answers['1']).toBe('New Answer')
  })
})

describe('useAnswer', () => {
  let store: ReturnType<typeof configureStore>

  beforeEach(() => {
    store = configureStore({
      reducer: {
        answers: answersReducer,
      },
    })
  })

  const wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  )

  it('should return undefined for non-existent answer', () => {
    const { result } = renderHook(() => useAnswer('1'), { wrapper })

    expect(result.current.value).toBeUndefined()
  })

  it('should update specific answer value', () => {
    const { result } = renderHook(() => useAnswer('1'), { wrapper })

    act(() => {
      result.current.updateValue('Test Value')
    })

    expect(result.current.value).toBe('Test Value')
  })

  it('should update to number value', () => {
    const { result } = renderHook(() => useAnswer('2'), { wrapper })

    act(() => {
      result.current.updateValue(42)
    })

    expect(result.current.value).toBe(42)
  })

  it('should update to null value', () => {
    const { result } = renderHook(() => useAnswer('3'), { wrapper })

    act(() => {
      result.current.updateValue('Initial')
      result.current.updateValue(null)
    })

    expect(result.current.value).toBeNull()
  })

  it('should only update the specific question', () => {
    const { result: result1 } = renderHook(() => useAnswer('1'), { wrapper })
    const { result: result2 } = renderHook(() => useAnswer('2'), { wrapper })

    act(() => {
      result1.current.updateValue('Answer 1')
      result2.current.updateValue('Answer 2')
    })

    expect(result1.current.value).toBe('Answer 1')
    expect(result2.current.value).toBe('Answer 2')
  })

  it('should reflect updates from other hooks', () => {
    const { result: answerResult } = renderHook(() => useAnswer('1'), { wrapper })
    const { result: answersResult } = renderHook(() => useAnswers(), { wrapper })

    act(() => {
      answersResult.current.updateAnswer('1', 'Shared Value')
    })

    expect(answerResult.current.value).toBe('Shared Value')
  })

  it('should be cleared when clearAnswers is called', () => {
    const { result: answerResult } = renderHook(() => useAnswer('1'), { wrapper })
    const { result: answersResult } = renderHook(() => useAnswers(), { wrapper })

    act(() => {
      answerResult.current.updateValue('Test')
    })

    expect(answerResult.current.value).toBe('Test')

    act(() => {
      answersResult.current.clear()
    })

    expect(answerResult.current.value).toBeUndefined()
  })
})
