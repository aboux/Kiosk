import { Controller, Post, Body } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from "@nestjs/swagger";
import { AnswersService } from "./answers.service";
import { CreateAnswersDto } from "./dto/create-answers.dto";
import { SaveAnswersResponseDto } from "./dto/save-answers-response.dto";

@ApiTags("answers")
@Controller({ path: "answers", version: "1" })
export class AnswersController {
  constructor(private readonly answersService: AnswersService) {}

  @Post()
  @ApiBody({ type: CreateAnswersDto })
  @ApiResponse({
    status: 201,
    type: SaveAnswersResponseDto,
  })
  create(@Body() createAnswersDto: CreateAnswersDto[]) {
    return this.answersService.createAnswers(createAnswersDto);
  }
}
