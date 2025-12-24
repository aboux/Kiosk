import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { LocaleCode } from "@prisma/client";
import { QuestionEntity } from "./entities/question.entity";

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}

  async getQuestions(
    locale: LocaleCode = LocaleCode.en
  ): Promise<QuestionEntity[]> {
    const questions = await this.prisma.question.findMany({
      orderBy: { order: "asc" },
      include: {
        translations: {
          where: { locale },
        },
        enumValues: {
          orderBy: { order: "asc" },
          include: {
            translations: {
              where: { locale },
            },
          },
        },
      },
    });

    const buildTree = (parentId: number | null): QuestionEntity[] => {
      return questions
        .filter((q) => q.parentId === parentId)
        .map((q) => ({
          id: q.id,
          label: q.translations[0]?.value ?? `Question ${q.id}`,
          content: q.content,
          order: q.order,
          unit: q.unit,
          enumValues: q.enumValues.map((ev) => ({
            id: ev.id,
            value: ev.value,
            order: ev.order,
            label: ev.translations[0]?.value ?? ev.value,
          })),
          children: buildTree(q.id),
        }));
    };

    return buildTree(null);
  }
}
