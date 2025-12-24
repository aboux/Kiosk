import { PrismaClient, LocaleCode, ContentType, Unit } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";
import { parse } from "csv-parse/sync";

const prisma = new PrismaClient();

async function createTranslation(data: {
  locale: LocaleCode;
  value: string;
  enumValueId?: number;
  questionId?: number;
}) {
  return prisma.translation.create({
    data,
  });
}

const questionIdMap = new Map<string, number>();

async function main() {
  await prisma.translation.deleteMany({});
  await prisma.answer.deleteMany({});
  await prisma.enumValue.deleteMany({});
  await prisma.question.deleteMany({});

  const csvPath = path.join(__dirname, "../data/questions.csv");

  if (!fs.existsSync(csvPath)) {
    return;
  }

  const content = fs.readFileSync(csvPath, "utf-8");

  const records = parse(content, {
    delimiter: ";",
    columns: true,
    skip_empty_lines: true,
    trim: true,
    quote: '"',
    escape: '"',
    relax_column_count: true,
  });

  for (const row of records) {
    const contentType = row["content"]?.toLowerCase();
    let contentTypeEnum: ContentType | null = null;

    if (contentType === "number") contentTypeEnum = ContentType.NUMBER;
    else if (contentType === "text") contentTypeEnum = ContentType.TEXT;
    else if (contentType === "enum") contentTypeEnum = ContentType.ENUM;
    else if (contentType === "table") contentTypeEnum = ContentType.TABLE;

    let unit: Unit | null = null;
    if (row["unit"] === "%") {
      unit = Unit.PERCENTAGE;
    }

    const question = await prisma.question.create({
      data: {
        content: contentTypeEnum,
        order: parseInt(row["order"]) || 0,
        unit,
      },
    });

    questionIdMap.set(row["ID"], question.id);

    await createTranslation({
      questionId: question.id,
      locale: LocaleCode.en,
      value: row["question label en"],
    });

    await createTranslation({
      questionId: question.id,
      locale: LocaleCode.fr,
      value: row["question label fr"],
    });

    if (contentTypeEnum === ContentType.ENUM) {
      const enumValuesEn = row["enum en"]
        ? row["enum en"].split(",").map((s: string) => s.trim())
        : [];
      const enumValuesFr = row["enum fr"]
        ? row["enum fr"].split(",").map((s: string) => s.trim())
        : [];

      for (let i = 0; i < enumValuesEn.length; i++) {
        const enumValue = await prisma.enumValue.create({
          data: {
            questionId: question.id,
            order: i,
            value: enumValuesEn[i],
          },
        });

        await createTranslation({
          enumValueId: enumValue.id,
          locale: LocaleCode.en,
          value: enumValuesEn[i],
        });

        if (enumValuesFr[i]) {
          await createTranslation({
            enumValueId: enumValue.id,
            locale: LocaleCode.fr,
            value: enumValuesFr[i],
          });
        }
      }
    }
  }

  for (const row of records) {
    const relatedQuestionId = row["relatedQuestion ID"];
    if (relatedQuestionId) {
      const questionId = questionIdMap.get(row["ID"]);
      const parentId = questionIdMap.get(relatedQuestionId);

      if (questionId && parentId) {
        await prisma.question.update({
          where: { id: questionId },
          data: { parentId },
        });
      }
    }
  }
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
