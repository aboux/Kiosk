import { QuestionEntity } from "@/types/api-types";
import { useAnswer } from "@/store/slices/answers/answersHooks";
import { Input } from "../ui/input";

interface Props {
  child: QuestionEntity;
  onValueChange: (
    id: number,
    value: string,
    contentType: string | null
  ) => void;
}

export const TableCellInput = ({ child, onValueChange }: Props) => {
  const { value } = useAnswer(child.id.toString());

  return (
    <Input
      type={child.content === "NUMBER" ? "number" : "text"}
      value={value ?? ""}
      onChange={(e) => onValueChange(child.id, e.target.value, child.content)}
      placeholder={`Enter ${child.content === "NUMBER" ? "number" : "text"}`}
    />
  );
};
