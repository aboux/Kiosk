import { describe, it, expect } from 'vitest'
import answersReducer, { setAnswer, clearAnswers } from './answersSlice'

describe('answersSlice', () => {
  it('should return the initial state', () => {
    const initialState = {
      values: {},
    }
    expect(answersReducer(undefined, { type: 'unknown' })).toEqual(initialState)
  })

  it('should handle setAnswer with string value', () => {
    const previousState = {
      values: {},
    }
    const actual = answersReducer(
      previousState,
      setAnswer({ questionId: '1', value: 'test answer' })
    )
    expect(actual.values['1']).toBe('test answer')
  })

  it('should handle setAnswer with number value', () => {
    const previousState = {
      values: {},
    }
    const actual = answersReducer(
      previousState,
      setAnswer({ questionId: '2', value: 42 })
    )
    expect(actual.values['2']).toBe(42)
  })

  it('should handle setAnswer with null value', () => {
    const previousState = {
      values: { '1': 'existing value' },
    }
    const actual = answersReducer(
      previousState,
      setAnswer({ questionId: '1', value: null })
    )
    expect(actual.values['1']).toBeNull()
  })

  it('should handle updating an existing answer', () => {
    const previousState = {
      values: { '1': 'old answer' },
    }
    const actual = answersReducer(
      previousState,
      setAnswer({ questionId: '1', value: 'new answer' })
    )
    expect(actual.values['1']).toBe('new answer')
  })

  it('should handle multiple answers', () => {
    let state = {
      values: {},
    }

    state = answersReducer(state, setAnswer({ questionId: '1', value: 'answer 1' }))
    state = answersReducer(state, setAnswer({ questionId: '2', value: 'answer 2' }))
    state = answersReducer(state, setAnswer({ questionId: '3', value: 42 }))

    expect(state.values).toEqual({
      '1': 'answer 1',
      '2': 'answer 2',
      '3': 42,
    })
  })

  it('should handle clearAnswers', () => {
    const previousState = {
      values: {
        '1': 'answer 1',
        '2': 'answer 2',
        '3': 42,
      },
    }
    const actual = answersReducer(previousState, clearAnswers())
    expect(actual.values).toEqual({})
  })

  it('should handle clearAnswers on empty state', () => {
    const previousState = {
      values: {},
    }
    const actual = answersReducer(previousState, clearAnswers())
    expect(actual.values).toEqual({})
  })
})
