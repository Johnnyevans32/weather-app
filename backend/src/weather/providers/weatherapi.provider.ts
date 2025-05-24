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
export class WeatherAPIProvider implements IWeatherProvider {
  private readonly apiKey: string;
  private readonly apiUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('WEATHERAPI_KEY');
    this.apiUrl = this.configService.get<string>('WEATHERAPI_URL');
  }

  async getWeatherByCity(city: string): Promise<WeatherData> {
    const response = await firstValueFrom(
      this.httpService.get(`${this.apiUrl}/current.json`, {
        params: {
          key: this.apiKey,
          q: city,
          aqi: 'yes',
        },
      }),
    );

    const data = response.data;
    return {
      name: data.location.name,
      temperature: data.current.temp_c,
      description: data.current.condition.text,
      humidity: data.current.humidity,
      windSpeed: data.current.wind_kph / 3.6, // Convert km/h to m/s
      timestamp: data.current.last_updated_epoch,
    };
  }

  async getWeatherForecast(city: string): Promise<WeatherForecast> {
    const response = await firstValueFrom(
      this.httpService.get(`${this.apiUrl}/forecast.json`, {
        params: {
          key: this.apiKey,
          q: city,
          days: 3,
          aqi: 'yes',
        },
      }),
    );

    const data = response.data;
    const forecastData = data.forecast.forecastday.map((day) => ({
      name: data.location.name,
      temperature: day.day.avgtemp_c,
      description: day.day.condition.text,
      humidity: day.day.avghumidity,
      windSpeed: day.day.maxwind_kph / 3.6, // Convert km/h to m/s
      timestamp: day.date_epoch,
    }));

    // Get yesterday, today, and tomorrow data
    const now = Date.now() / 1000; // Convert to seconds
    const yesterday = forecastData.find(item => item.timestamp <= now - 86400) || forecastData[0];
    const today = forecastData.find(item => item.timestamp >= now) || forecastData[0];
    const tomorrow = forecastData.find(item => item.timestamp >= now + 86400) || forecastData[0];

    return {
      city: data.location.name,
      weather: {
        yesterday,
        today,
        tomorrow,
      },
    };
  }
}
