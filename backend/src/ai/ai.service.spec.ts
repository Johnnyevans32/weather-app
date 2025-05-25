import { Test, TestingModule } from '@nestjs/testing';
import { AiService } from './ai.service';

describe('AiService', () => {
  let service: AiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AiService],
    }).compile();

    service = module.get<AiService>(AiService);
  });

  describe('handleChatQuestion', () => {
    it('should extract city and return weather link for valid weather question', async () => {
      const question = 'What is the weather in London?';
      const result = await service.handleChatQuestion(question);

      expect(result).toEqual({
        message: 'You can get the weather info for London here',
        link: '/weather/London',
      });
    });

    it('should handle question without city', async () => {
      const question = 'What is the weather like?';
      const result = await service.handleChatQuestion(question);

      expect(result).toEqual({
        message:
          "I couldn't determine which city you're asking about. Please specify a city name.",
      });
    });

    it('should handle non-weather related questions', async () => {
      const question = 'What time is it in Paris?';
      const result = await service.handleChatQuestion(question);

      expect(result).toEqual({
        message:
          "I couldn't determine which city you're asking about. Please specify a city name.",
      });
    });
  });

  describe('city extraction', () => {
    it('should extract city after preposition', async () => {
      const questions = [
        'What is the weather in London?',
        'Show me the forecast for Paris',
        'Temperature at Tokyo',
      ];

      for (const question of questions) {
        const result = await service.handleChatQuestion(question);
        expect(result).toHaveProperty('link');
        expect(result.message).toContain('You can get the weather info');
      }
    });

    it('should handle cities with different cases', async () => {
      const questions = [
        'weather in LONDON',
        'weather in london',
        'weather in London',
      ];

      for (const question of questions) {
        const result = await service.handleChatQuestion(question);
        expect(result.link).toBe('/weather/London');
      }
    });
  });
});
