import { Injectable } from '@nestjs/common';
import * as natural from 'natural';

@Injectable()
export class AiService {
  private readonly tokenizer: natural.WordTokenizer;
  private readonly stopWords: Set<string>;
  private readonly cityIndicators: Set<string>;
  private readonly weatherKeywords: Set<string>;

  constructor() {
    this.tokenizer = new natural.WordTokenizer();
    this.stopWords = new Set(natural.stopwords);
    this.cityIndicators = new Set([
      'in',
      'at',
      'for',
      'around',
      'near',
      'around',
      'about',
      'inside',
      'within',
    ]);
    this.weatherKeywords = new Set([
      'weather',
      'temperature',
      'forecast',
      'climate',
      'conditions',
      'rain',
      'sunny',
      'cloudy',
      'snow',
      'wind',
      'humidity',
    ]);
  }

  private preprocessText(text: string): string[] {
    // Convert to lowercase and tokenize
    const tokens = this.tokenizer.tokenize(text.toLowerCase());

    // Remove stop words and non-alphabetic tokens
    return tokens.filter(
      (token) => !this.stopWords.has(token) && /^[a-z]+$/.test(token),
    );
  }

  private isWeatherQuestion(tokens: string[]): boolean {
    return tokens.some((token) => this.weatherKeywords.has(token));
  }

  private findCityInTokens(tokens: string[]): string | null {
    for (let i = 0; i < tokens.length - 1; i++) {
      if (this.cityIndicators.has(tokens[i])) {
        const potentialCity = tokens[i + 1];
        if (
          potentialCity.length >= 2 &&
          /^[a-z]+$/.test(potentialCity) &&
          !this.weatherKeywords.has(potentialCity)
        ) {
          return potentialCity.charAt(0).toUpperCase() + potentialCity.slice(1);
        }
      }
    }

    const lastToken = tokens[tokens.length - 1];
    if (
      lastToken &&
      lastToken.length >= 2 &&
      /^[a-z]+$/.test(lastToken) &&
      !this.weatherKeywords.has(lastToken)
    ) {
      return lastToken.charAt(0).toUpperCase() + lastToken.slice(1);
    }

    return null;
  }

  private extractCityFromQuestion(question: string): string | null {
    const tokens = this.preprocessText(question);

    if (!this.isWeatherQuestion(tokens)) {
      return null;
    }

    return this.findCityInTokens(tokens);
  }

  async handleChatQuestion(
    question: string,
  ): Promise<{ message: string; link?: string }> {
    const city = this.extractCityFromQuestion(question);

    if (!city) {
      return {
        message:
          "I couldn't determine which city you're asking about. Please specify a city name.",
      };
    }

    try {
      return {
        message: `You can get the weather info for ${city} here`,
        link: `/weather/${city}`,
      };
    } catch (error) {
      return {
        message: `I couldn't find weather data for ${city}. Please check the city name and try again.`,
      };
    }
  }
}
