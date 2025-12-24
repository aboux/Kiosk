import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { setAnswer, clearAnswers } from "./answersSlice";
import { useSaveAnswersMutation } from "../../../services/answers.service";

export const useAnswers = () => {
  const dispatch = useAppDispatch();
  const answers = useAppSelector((state) => state.answers.values);
  const [saveAnswersMutation, { isLoading, isSuccess, isError }] =
    useSaveAnswersMutation();

  const updateAnswer = useCallback(
    (questionId: string, value: string | number | null) => {
      dispatch(setAnswer({ questionId, value }));
    },
    [dispatch]
  );

  const save = useCallback(async () => {
    try {
      await saveAnswersMutation(answers).unwrap();
    } catch (error) {
      console.error("Failed to save answers:", error);
    }
  }, [saveAnswersMutation, answers]);

  const clear = useCallback(() => {
    dispatch(clearAnswers());
  }, [dispatch]);

  return {
    answers,
    isSaving: isLoading,
    isSaved: isSuccess,
    isFailed: isError,
    updateAnswer,
    save,
    clear,
  };
};

export const useAnswer = (questionId: string) => {
  const dispatch = useAppDispatch();
  const value = useAppSelector((state) => state.answers.values[questionId]);

  const updateValue = useCallback(
    (newValue: string | number | null) => {
      dispatch(setAnswer({ questionId, value: newValue }));
    },
    [dispatch, questionId]
  );

  return {
    value,
    updateValue,
  };
};
