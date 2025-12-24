import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { Provider } from 'react-redux'
import { ReactNode } from 'react'
import { setupStore } from '@/test/test-utils'
import { useAppDispatch, useAppSelector } from './hooks'
import { setLanguage } from './slices/questions/questionsSlice'
import { LocaleEnum } from '@/types/api-types'

describe('Redux hooks', () => {
  const store = setupStore()

  const wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  )

  describe('useAppSelector', () => {
    it('selects state from the store', () => {
      const { result } = renderHook(
        () => useAppSelector((state) => state.questions.language),
        { wrapper }
      )

      expect(result.current).toBe(LocaleEnum.En)
    })

    it('updates when state changes', () => {
      const { result } = renderHook(
        () => useAppSelector((state) => state.questions.language),
        { wrapper }
      )

      expect(result.current).toBe(LocaleEnum.En)

      store.dispatch(setLanguage(LocaleEnum.Fr))

      expect(store.getState().questions.language).toBe(LocaleEnum.Fr)
    })
  })

  describe('useAppDispatch', () => {
    it('returns dispatch function', () => {
      const { result } = renderHook(() => useAppDispatch(), { wrapper })

      expect(typeof result.current).toBe('function')
    })

    it('can dispatch actions', () => {
      const { result: dispatchResult } = renderHook(() => useAppDispatch(), { wrapper })
      const { result: selectorResult } = renderHook(
        () => useAppSelector((state) => state.questions.language),
        { wrapper }
      )

      dispatchResult.current(setLanguage(LocaleEnum.Fr))

      expect(store.getState().questions.language).toBe(LocaleEnum.Fr)
    })
  })
})
