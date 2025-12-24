import { ApiProperty } from "@nestjs/swagger";

export class EnumValueEntity {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty()
  value: string;

  @ApiProperty({ example: 0 })
  order: number;

  @ApiProperty()
  label: string;
}
