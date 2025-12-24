import { useAnswers } from "@/store/slices/answers/answersHooks";
import type { QuestionEntity } from "@/types/api-types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { TableCellInput } from "./TableCellInput";

interface Props {
  question: QuestionEntity;
}

export const TableQuestion = ({ question }: Props) => {
  const { updateAnswer } = useAnswers();
  const label = question.label;

  const handleChange = (
    childId: number,
    value: string,
    contentType: string | null
  ) => {
    const val =
      contentType === "NUMBER" ? (value === "" ? null : Number(value)) : value;
    updateAnswer(childId.toString(), val);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {question.children.map((child) => (
                  <TableHead key={child.id}>
                    <div className="flex flex-col gap-1">
                      <span>{child.label}</span>
                      {child.unit && (
                        <Badge variant="outline" className="text-xs w-fit">
                          {child.unit}
                        </Badge>
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                {question.children.map((child) => (
                  <TableCell key={child.id}>
                    <TableCellInput
                      child={child}
                      onValueChange={handleChange}
                    />
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
