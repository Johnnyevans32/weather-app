import { Test, TestingModule } from '@nestjs/testing';
import { AiService } from './ai.service';
import * as natural from 'natural';

describe('AiService', () => {
  let service: AiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AiService],
    }).compile();

    service = module.get<AiService>(AiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('extractCityFromQuestion', () => {
    it('should extract city name from question using NLP', () => {
      const question = 'What\'s the weather like in London?';
      const result = service['extractCityFromQuestion'](question);
      expect(result).toBe('London');
    });

    it('should handle questions with city name in different positions', () => {
      const questions = [
        'How is the weather in Paris today?',
        'Tell me about the weather in Tokyo',
        'Is it raining in New York?',
        'What\'s the temperature in Sydney right now?',
      ];

      questions.forEach(question => {
        const result = service['extractCityFromQuestion'](question);
        expect(result).toBeTruthy();
        expect(typeof result).toBe('string');
      });
    });

    it('should handle questions without city name', () => {
      const question = 'What\'s the weather like?';
      const result = service['extractCityFromQuestion'](question);
      expect(result).toBeNull();
    });

    it('should handle questions with multiple cities', () => {
      const question = 'Compare weather in London and Paris';
      const result = service['extractCityFromQuestion'](question);
      expect(result).toBe('London'); // Should return the first city
    });
  });

  describe('handleChatQuestion', () => {
    it('should return weather link for valid city question', async () => {
      const question = 'What\'s the weather like in London?';
      const result = await service.handleChatQuestion(question);
      expect(result).toEqual({
        message: 'You can get the weather info for London here',
        link: '/weather/London',
      });
    });

    it('should return error message for invalid question', async () => {
      const question = 'What\'s the weather like?';
      const result = await service.handleChatQuestion(question);
      expect(result).toEqual({
        message: "I couldn't determine which city you're asking about. Please specify a city name.",
      });
    });

    it('should handle questions about weather conditions', async () => {
      const question = 'Is it raining in Tokyo?';
      const result = await service.handleChatQuestion(question);
      expect(result).toEqual({
        message: 'You can get the weather info for Tokyo here',
        link: '/weather/Tokyo',
      });
    });

    it('should handle questions about temperature', async () => {
      const question = 'What\'s the temperature in Sydney?';
      const result = await service.handleChatQuestion(question);
      expect(result).toEqual({
        message: 'You can get the weather info for Sydney here',
        link: '/weather/Sydney',
      });
    });
  });
}); 