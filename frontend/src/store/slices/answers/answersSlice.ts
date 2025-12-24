import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AnswersState {
  values: Record<string, string | number | null>;
}

const initialState: AnswersState = {
  values: {},
};

const answersSlice = createSlice({
  name: "answers",
  initialState,
  reducers: {
    setAnswer: (
      state,
      action: PayloadAction<{
        questionId: string;
        value: string | number | null;
      }>
    ) => {
      state.values[action.payload.questionId] = action.payload.value;
    },
    clearAnswers: (state) => {
      state.values = {};
    },
  },
});

export const { setAnswer, clearAnswers } = answersSlice.actions;

export default answersSlice.reducer;
