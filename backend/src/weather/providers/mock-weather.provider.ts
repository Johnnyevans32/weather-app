import { Injectable } from '@nestjs/common';
import {
  IWeatherProvider,
  WeatherData,
  WeatherForecast,
} from '../interfaces/weather-provider.interface';

@Injectable()
export class MockWeatherProvider implements IWeatherProvider {
  async getWeatherByCity(city: string): Promise<WeatherData> {
    return {
      name: city,
      temperature: 20,
      description: 'clear sky',
      humidity: 65,
      windSpeed: 4.1,
      timestamp: Date.now(),
    };
  }

  async getWeatherForecast(city: string): Promise<WeatherForecast> {
    const baseData = await this.getWeatherByCity(city);
    const yesterday = { ...baseData, timestamp: Date.now() - 86400 };
    const today = { ...baseData };
    const tomorrow = { ...baseData, timestamp: Date.now() + 86400 };

    return {
      city,
      weather: {
        yesterday,
        today,
        tomorrow,
      },
    };
  }
}
