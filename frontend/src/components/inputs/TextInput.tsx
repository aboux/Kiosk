import { useAnswers } from "@/store/slices/answers/answersHooks";
import type { QuestionEntity } from "@/types/api-types";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useFormContext, Controller } from "react-hook-form";

interface Props {
  question: QuestionEntity;
}

export const TextInput = ({ question }: Props) => {
  const { updateAnswer } = useAnswers();
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const label = question.label;
  const questionId = question.id.toString();
  const fieldError = errors?.answers as any;
  const error = fieldError?.[questionId];

  return (
    <div className="space-y-2">
      <Label htmlFor={questionId} className={error ? "text-destructive" : ""}>
        {label}
      </Label>
      <Controller
        name={`answers.${questionId}`}
        control={control}
        render={({ field }) => (
          <Textarea
            {...field}
            id={questionId}
            value={field.value ?? ""}
            onChange={(e) => {
              field.onChange(e.target.value);
              updateAnswer(questionId, e.target.value);
            }}
            rows={3}
            placeholder="Enter text"
            className={error ? "border-destructive" : ""}
          />
        )}
      />
      {error && (
        <p className="text-sm font-medium text-destructive">
          {error.message as string}
        </p>
      )}
    </div>
  );
};
