import { z } from "zod";

export const answerValueSchema = z.union([z.string(), z.number(), z.null()]);

export const questionFormSchema = z.object({
  answers: z.record(z.string(), answerValueSchema),
});

export type QuestionFormData = z.infer<typeof questionFormSchema>;

export const createQuestionValidationSchema = (_questions: any[]) => {
  return questionFormSchema;
};
