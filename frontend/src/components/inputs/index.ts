import { NumberInput } from "./NumberInput";
import { TextInput } from "./TextInput";
import { EnumSelect } from "./EnumSelect";
import { QuestionEntity, QuestionEntityContentEnum } from "@/types/api-types";

type InputComponent = React.FC<{ question: QuestionEntity }>;

const inputStrategies: Record<string, InputComponent> = {
  [QuestionEntityContentEnum.NUMBER]: NumberInput,
  [QuestionEntityContentEnum.TEXT]: TextInput,
  [QuestionEntityContentEnum.ENUM]: EnumSelect,
};

export const getInputComponent = (
  type: string | null
): InputComponent | null => {
  if (!type) return null;
  return inputStrategies[type] ?? null;
};
