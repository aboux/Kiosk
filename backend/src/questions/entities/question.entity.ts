import { ApiProperty } from "@nestjs/swagger";
import { EnumValueEntity } from "./enum-value.entity";
import { ContentType, Unit } from "@prisma/client";

export class QuestionEntity {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty()
  label: string;

  @ApiProperty({
    enum: ContentType,
    nullable: true,
  })
  content: ContentType | null;

  @ApiProperty({ example: 0 })
  order: number;

  @ApiProperty({
    enum: Unit,
    nullable: true,
  })
  unit: Unit | null;

  @ApiProperty({
    type: () => [EnumValueEntity],
  })
  enumValues: EnumValueEntity[];

  @ApiProperty({
    type: () => [QuestionEntity],
  })
  children: QuestionEntity[];
}
