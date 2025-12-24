import { ApiProperty } from "@nestjs/swagger";

export class AnswerEntity {
  @ApiProperty({})
  id: string;

  @ApiProperty({})
  questionId: string;

  @ApiProperty({
    nullable: true,
  })
  value: string | null;

  @ApiProperty({
    nullable: true,
  })
  rowIndex: number | null;

  @ApiProperty({})
  createdAt: Date;

  @ApiProperty({})
  updatedAt: Date;
}
