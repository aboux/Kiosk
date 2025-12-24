import { useQuestions } from "@/store/slices/questions/questionsHooks";
import { QuestionForm } from "../question/QuestionForm";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Skeleton } from "../ui/skeleton";
import { AlertCircle } from "lucide-react";

export const MainForm = () => {
  const { isLoading, isFailed, isSuccess } = useQuestions();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-5xl">
      {isLoading && (
        <div className="space-y-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      )}

      {isFailed && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load questions. Please refresh the page or try again later.
          </AlertDescription>
        </Alert>
      )}

      {isSuccess && <QuestionForm />}
    </div>
  );
};
