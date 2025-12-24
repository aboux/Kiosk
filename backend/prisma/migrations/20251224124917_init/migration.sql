-- CreateEnum
CREATE TYPE "locale_code" AS ENUM ('en', 'fr');

-- CreateEnum
CREATE TYPE "content_type" AS ENUM ('NUMBER', 'TEXT', 'ENUM', 'TABLE');

-- CreateEnum
CREATE TYPE "unit" AS ENUM ('PERCENTAGE');

-- CreateTable
CREATE TABLE "questions" (
    "id" SERIAL NOT NULL,
    "content" "content_type",
    "order" INTEGER NOT NULL DEFAULT 0,
    "unit" "unit",
    "parent_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enum_values" (
    "id" SERIAL NOT NULL,
    "question_id" INTEGER NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "value" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "enum_values_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "answers" (
    "id" SERIAL NOT NULL,
    "question_id" INTEGER NOT NULL,
    "value" TEXT,
    "row_index" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "translations" (
    "id" SERIAL NOT NULL,
    "locale" "locale_code" NOT NULL,
    "value" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "questionId" INTEGER,
    "enumValueId" INTEGER,

    CONSTRAINT "translations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enum_values" ADD CONSTRAINT "enum_values_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "translations" ADD CONSTRAINT "translations_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "translations" ADD CONSTRAINT "translations_enumValueId_fkey" FOREIGN KEY ("enumValueId") REFERENCES "enum_values"("id") ON DELETE SET NULL ON UPDATE CASCADE;
