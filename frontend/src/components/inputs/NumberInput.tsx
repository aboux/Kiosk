import { useAnswers } from "@/store/slices/answers/answersHooks";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { useFormContext, Controller } from "react-hook-form";
import { QuestionEntity } from "@/types/api-types";

interface Props {
  question: QuestionEntity;
}

export const NumberInput = ({ question }: Props) => {
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
      <div className="flex items-center gap-2">
        <Label htmlFor={questionId} className={error ? "text-destructive" : ""}>
          {label}
        </Label>
        {question.unit && (
          <Badge variant="secondary" className="text-xs">
            {question.unit}
          </Badge>
        )}
      </div>
      <Controller
        name={`answers.${questionId}`}
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            id={questionId}
            type="number"
            value={field.value ?? ""}
            onChange={(e) => {
              const val = e.target.value === "" ? null : Number(e.target.value);
              field.onChange(val);
              updateAnswer(questionId, val);
            }}
            placeholder="Enter a number"
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
