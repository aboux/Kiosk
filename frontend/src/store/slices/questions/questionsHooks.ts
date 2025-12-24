import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { setLanguage } from "./questionsSlice";
import { LocaleEnum } from "@/types/api-types";
import { useGetQuestionsQuery } from "../../../services/questions.service";

export const useQuestions = () => {
  const language = useAppSelector((state) => state.questions.language);
  const dispatch = useAppDispatch();

  const {
    data: questions,
    isLoading,
    isSuccess,
    isError,
    refetch,
  } = useGetQuestionsQuery(language);

  const loadQuestions = useCallback(() => {
    refetch();
  }, [refetch]);

  const changeLanguage = useCallback(
    (lang: LocaleEnum) => {
      dispatch(setLanguage(lang));
    },
    [dispatch]
  );

  return {
    questions,
    language,
    isLoading,
    isSuccess,
    isFailed: isError,
    loadQuestions,
    changeLanguage,
  };
};

export const useLanguage = () => {
  const dispatch = useAppDispatch();
  const language = useAppSelector((state) => state.questions.language);

  const changeLanguage = useCallback(
    (lang: LocaleEnum) => {
      dispatch(setLanguage(lang));
    },
    [dispatch]
  );

  return {
    language,
    changeLanguage,
  };
};
