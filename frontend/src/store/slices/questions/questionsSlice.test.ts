import { describe, it, expect } from 'vitest'
import questionsReducer, { setLanguage } from './questionsSlice'
import { LocaleEnum } from '@/types/api-types'

describe('questionsSlice', () => {
  it('should return the initial state', () => {
    const initialState = {
      language: LocaleEnum.En,
    }
    expect(questionsReducer(undefined, { type: 'unknown' })).toEqual(initialState)
  })

  it('should handle setLanguage to French', () => {
    const previousState = {
      language: LocaleEnum.En,
    }
    const actual = questionsReducer(previousState, setLanguage(LocaleEnum.Fr))
    expect(actual.language).toBe(LocaleEnum.Fr)
  })

  it('should handle setLanguage to English', () => {
    const previousState = {
      language: LocaleEnum.Fr,
    }
    const actual = questionsReducer(previousState, setLanguage(LocaleEnum.En))
    expect(actual.language).toBe(LocaleEnum.En)
  })

  it('should handle multiple language changes', () => {
    let state = {
      language: LocaleEnum.En,
    }

    state = questionsReducer(state, setLanguage(LocaleEnum.Fr))
    expect(state.language).toBe(LocaleEnum.Fr)

    state = questionsReducer(state, setLanguage(LocaleEnum.En))
    expect(state.language).toBe(LocaleEnum.En)

    state = questionsReducer(state, setLanguage(LocaleEnum.Fr))
    expect(state.language).toBe(LocaleEnum.Fr)
  })
})
