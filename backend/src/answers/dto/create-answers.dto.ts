import { ApiProperty } from "@nestjs/swagger";

export class CreateAnswersDto {
  @ApiProperty({
    type: Number,
  })
  questionId: number;

  @ApiProperty({
    type: String,
  })
  answer: string;
}
