import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';

class ChatQuestionDto {
  question: string;
}

@ApiTags('ai')
@Controller('ai')
@UseGuards(ThrottlerGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('chat')
  @ApiOperation({ summary: 'Process a weather-related question' })
  @ApiResponse({
    status: 200,
    description: 'Returns a response with weather information link',
  })
  async handleChatQuestion(@Body() chatQuestionDto: ChatQuestionDto) {
    return this.aiService.handleChatQuestion(chatQuestionDto.question);
  }
}
