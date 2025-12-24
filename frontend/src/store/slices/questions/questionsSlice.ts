import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LocaleEnum } from "@/types/api-types";

interface QuestionsState {
  language: LocaleEnum;
}

const initialState: QuestionsState = {
  language: LocaleEnum.En,
};

const questionsSlice = createSlice({
  name: "questions",
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<LocaleEnum>) => {
      state.language = action.payload;
    },
  },
});

export const { setLanguage } = questionsSlice.actions;

export default questionsSlice.reducer;
