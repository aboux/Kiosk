import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateAnswersDto } from "./dto/create-answers.dto";

@Injectable()
export class AnswersService {
  constructor(private prisma: PrismaService) {}

  async createAnswers(createAnswersDto: CreateAnswersDto[]) {
    const answerPromises = createAnswersDto.map(({ questionId, answer }) =>
      this.prisma.answer.create({
        data: {
          questionId,
          value: answer,
        },
      })
    );

    // Cas d'erreur à gérer
    await Promise.all(answerPromises);

    return { message: "Answers saved successfully" };
  }
}
