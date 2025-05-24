import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import {
  IWeatherProvider,
  WeatherData,
  WeatherForecast,
} from '../interfaces/weather-provider.interface';

@Injectable()
export class OpenWeatherMapProvider implements IWeatherProvider {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('OPENWEATHER_API_KEY');
    this.baseUrl = this.configService.get<string>('OPENWEATHER_BASE_URL');
  }

  async getWeatherByCity(city: string): Promise<WeatherData> {
    const response = await firstValueFrom(
      this.httpService.get(`${this.baseUrl}/weather`, {
        params: {
          q: city,
          appid: this.apiKey,
          units: 'metric',
        },
      }),
    );

    return {
      name: response.data.name,
      temperature: response.data.main.temp,
      description: response.data.weather[0].description,
      humidity: response.data.main.humidity,
      windSpeed: response.data.wind.speed,
      timestamp: response.data.dt,
    };
  }

  async getWeatherForecast(city: string): Promise<WeatherForecast> {
    const response = await firstValueFrom(
      this.httpService.get(`${this.baseUrl}/forecast`, {
        params: {
          q: city,
          appid: this.apiKey,
          units: 'metric',
        },
      }),
    );

    const forecastData = response.data.list.map((item) => ({
      name: item.name || response.data.city.name,
      temperature: item.main.temp,
      description: item.weather[0].description,
      humidity: item.main.humidity,
      windSpeed: item.wind.speed,
      timestamp: item.dt,
    }));

    // Get yesterday, today, and tomorrow data
    const now = Date.now() / 1000; // Convert to seconds
    const yesterday =
      forecastData.find((item) => item.timestamp <= now - 86400) ||
      forecastData[0];
    const today =
      forecastData.find((item) => item.timestamp >= now) || forecastData[0];
    const tomorrow =
      forecastData.find((item) => item.timestamp >= now + 86400) ||
      forecastData[0];

    return {
      city: response.data.city.name,
      weather: {
        yesterday,
        today,
        tomorrow,
      },
    };
  }
}
