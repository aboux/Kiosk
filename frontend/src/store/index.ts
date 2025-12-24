import { configureStore } from "@reduxjs/toolkit";
import questionsReducer from "./slices/questions/questionsSlice";
import answersReducer from "./slices/answers/answersSlice";
import { baseApi } from "../services/baseApi";

export const store = configureStore({
  reducer: {
    questions: questionsReducer,
    answers: answersReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
