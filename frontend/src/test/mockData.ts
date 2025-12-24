import { QuestionEntity, QuestionEntityContentEnum, LocaleEnum } from '@/types/api-types'

export const mockQuestion: QuestionEntity = {
  id: 1,
  label: 'What is your age?',
  content: QuestionEntityContentEnum.NUMBER,
  order: 0,
  unit: null as any,
  enumValues: [],
  children: [],
}

export const mockEnumQuestion: QuestionEntity = {
  id: 2,
  label: 'Select your gender',
  content: QuestionEntityContentEnum.ENUM,
  order: 1,
  unit: null as any,
  enumValues: [
    { id: 1, value: 'male', order: 0, label: 'Male' },
    { id: 2, value: 'female', order: 1, label: 'Female' },
    { id: 3, value: 'other', order: 2, label: 'Other' },
  ],
  children: [],
}

export const mockTextQuestion: QuestionEntity = {
  id: 3,
  label: 'Please provide your feedback',
  content: QuestionEntityContentEnum.TEXT,
  order: 2,
  unit: null as any,
  enumValues: [],
  children: [],
}

export const mockTableQuestion: QuestionEntity = {
  id: 4,
  label: 'Family Information',
  content: QuestionEntityContentEnum.TABLE,
  order: 3,
  unit: null as any,
  enumValues: [],
  children: [
    {
      id: 5,
      label: 'Name',
      content: QuestionEntityContentEnum.TEXT,
      order: 0,
      unit: null as any,
      enumValues: [],
      children: [],
    },
    {
      id: 6,
      label: 'Age',
      content: QuestionEntityContentEnum.NUMBER,
      order: 1,
      unit: null as any,
      enumValues: [],
      children: [],
    },
  ],
}

export const mockQuestions: QuestionEntity[] = [
  mockQuestion,
  mockEnumQuestion,
  mockTextQuestion,
  mockTableQuestion,
]

export const mockInitialQuestionsState = {
  language: LocaleEnum.FR,
}

export const mockInitialAnswersState = {
  answers: {},
}
