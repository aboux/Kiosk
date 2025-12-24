import { QuestionEntity } from "@/types/api-types";
import { useAnswers } from "@/store/slices/answers/answersHooks";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useFormContext, Controller } from "react-hook-form";

interface Props {
  question: QuestionEntity;
}

export const EnumSelect = ({ question }: Props) => {
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
          <Select
            value={field.value?.toString() || ""}
            onValueChange={(newValue) => {
              field.onChange(newValue);
              updateAnswer(questionId, newValue);
            }}
          >
            <SelectTrigger
              id={questionId}
              className={error ? "border-destructive" : ""}
            >
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {question.enumValues.map((enumValue) => (
                <SelectItem key={enumValue.id} value={enumValue.value}>
                  {enumValue.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
