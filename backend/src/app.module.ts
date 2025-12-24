import { Module } from "@nestjs/common";
import { QuestionsModule } from "./questions/questions.module";
import { AnswersModule } from "./answers/answers.module";
import { PrismaModule } from "./prisma/prisma.module";

@Module({
  imports: [PrismaModule, QuestionsModule, AnswersModule],
})
export class AppModule {}
