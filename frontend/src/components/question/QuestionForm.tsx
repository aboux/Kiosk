import { useEffect, useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { QuestionNode } from "./QuestionNode";
import { useQuestions } from "@/store/slices/questions/questionsHooks";
import { useAnswers } from "@/store/slices/answers/answersHooks";
import type { QuestionEntity } from "@/types/api-types";
import { Button } from "../ui/button";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { CheckCircle2, XCircle, Loader2, AlertTriangle } from "lucide-react";
import { useToast } from "../ui/use-toast";
import {
  createQuestionValidationSchema,
  type QuestionFormData,
} from "../../schemas/question.schema";

export const QuestionForm = () => {
  const { questions, isLoading } = useQuestions();
  const { answers, save, isSaving, isSaved, isFailed } = useAnswers();
  const { toast } = useToast();

  const validationSchema = useMemo(
    () => createQuestionValidationSchema(questions ?? []),
    [questions]
  );

  const methods = useForm<QuestionFormData>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      answers: answers,
    },
    mode: "onSubmit",
  });

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  useEffect(() => {
    if (isSaved) {
      toast({
        title: "Success!",
        description: "Your answers have been saved successfully.",
        variant: "default",
      });
    }
    if (isFailed) {
      toast({
        title: "Error",
        description: "Failed to save answers. Please try again.",
        variant: "destructive",
      });
    }
  }, [isSaved, isFailed, toast]);

  const onSubmit = async (_data: QuestionFormData) => {
    try {
      await save();
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const hasErrors = Object.keys(errors.answers || {}).length > 0;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-6">
          {questions?.map((question: QuestionEntity) => (
            <QuestionNode key={question.id} question={question} />
          ))}
        </div>

        {hasErrors && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Validation Errors</AlertTitle>
            <AlertDescription>
              Please fix the errors in the form before submitting.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex justify-end gap-4 pt-6 border-t">
          <Button type="submit" disabled={isSaving || isSubmitting} size="lg">
            {(isSaving || isSubmitting) && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isSaving || isSubmitting ? "Saving..." : "Save Answers"}
          </Button>
        </div>

        {isSaved && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Success</AlertTitle>
            <AlertDescription className="text-green-700">
              Your answers have been saved successfully!
            </AlertDescription>
          </Alert>
        )}

        {isFailed && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to save answers. Please try again.
            </AlertDescription>
          </Alert>
        )}
      </form>
    </FormProvider>
  );
};
