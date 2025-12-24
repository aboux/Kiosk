import { Module } from "@nestjs/common";
import { QuestionsController } from "./questions.controller";
import { QuestionsService } from "./questions.service";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  controllers: [QuestionsController],
  providers: [QuestionsService],
  imports: [PrismaModule],
})
export class QuestionsModule {}
