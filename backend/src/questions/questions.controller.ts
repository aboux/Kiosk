import { Controller, Get, Query } from "@nestjs/common";
import { ApiTags, ApiResponse, ApiQuery } from "@nestjs/swagger";
import { QuestionsService } from "./questions.service";
import { LocaleCode } from "@prisma/client";
import { QuestionEntity } from "./entities/question.entity";

@ApiTags("questions")
@Controller({ path: "questions", version: "1" })
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get()
  @ApiQuery({
    name: "locale",
    required: false,
    enum: LocaleCode,
  })
  @ApiResponse({
    status: 200,
    type: [QuestionEntity],
  })
  findAll(@Query("locale") locale?: LocaleCode) {
    return this.questionsService.getQuestions(locale);
  }
}
