import { getInputComponent } from "../inputs";
import { TableQuestion } from "./TableQuestion";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { QuestionEntity, QuestionEntityContentEnum } from "@/types/api-types";

interface Props {
  question: QuestionEntity;
  depth?: number;
}

export const QuestionNode = ({ question, depth = 0 }: Props) => {
  const label = question.label;

  if (question.content === QuestionEntityContentEnum.TABLE) {
    return <TableQuestion question={question} />;
  }

  if (!question.content) {
    return (
      <div className="space-y-4">
        {depth === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{label}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {question.children.map((child, index) => (
                <div key={child.id}>
                  {index > 0 && <Separator className="my-6" />}
                  <QuestionNode question={child} depth={depth + 1} />
                </div>
              ))}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">{label}</h3>
            <div className="space-y-4 pl-4 border-l-2 border-border">
              {question.children.map((child) => (
                <QuestionNode
                  key={child.id}
                  question={child}
                  depth={depth + 1}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  const InputComponent = getInputComponent(question.content);

  return (
    <div className="space-y-4">
      {InputComponent && <InputComponent question={question} />}
      {question.children.length > 0 && (
        <div className="ml-6 space-y-4">
          {question.children.map((child) => (
            <QuestionNode key={child.id} question={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};
