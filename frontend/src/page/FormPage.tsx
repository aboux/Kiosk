import { MainForm } from "@/components/MainForm/MainForm";
import { useQuestions } from "@/store/slices/questions/questionsHooks";
import { useEffect } from "react";

export const FormPage = () => {
  const { loadQuestions } = useQuestions();

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  return <MainForm />;
};
