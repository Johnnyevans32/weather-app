import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import {
  WeatherData,
  WeatherForecast,
} from './interfaces/weather-provider.interface';
import { WeatherProviderType } from './enums/weather-provider.enum';
import { WeatherRegistry } from './weather-registry.service';

@Injectable()
export class WeatherService {
  private readonly popularCities = [
    'London',
    'New York',
    'Tokyo',
    'Paris',
    'Sydney',
    'Dubai',
    'Singapore',
    'Hong Kong',
  ];

  constructor(
    private readonly weatherRegistry: WeatherRegistry,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  private async getCachedOrFetch<T>(
    key: string,
    fetchFn: () => Promise<T>,
  ): Promise<T> {
    const cached = await this.cacheManager.get<string>(key);
    if (cached) {
      return JSON.parse(cached) as T;
    }

    const data = await fetchFn();
    await this.cacheManager.set(key, JSON.stringify(data));
    return data;
  }

  async getWeatherByCity(
    city: string,
    provider?: WeatherProviderType,
  ): Promise<WeatherData> {
    try {
      const weatherProvider = this.weatherRegistry.get(
        provider || this.weatherRegistry.getDefaultProviderType(),
      );
      return await this.getCachedOrFetch(`weather:${provider}:${city}`, () =>
        weatherProvider.getWeatherByCity(city),
      );
    } catch (error) {
      throw new NotFoundException(`Weather data not found for city: ${city}`);
    }
  }

  async getWeatherForecast(
    city: string,
    provider?: WeatherProviderType,
  ): Promise<WeatherForecast> {
    try {
      const weatherProvider = this.weatherRegistry.get(
        provider || this.weatherRegistry.getDefaultProviderType(),
      );
      return await this.getCachedOrFetch(`forecast:${provider}:${city}`, () =>
        weatherProvider.getWeatherForecast(city),
      );
    } catch (error) {
      console.log(error);
      throw new NotFoundException(
        `Weather forecast not found for city: ${city}`,
      );
    }
  }

  async getPopularCitiesWeather(
    provider?: WeatherProviderType,
  ): Promise<WeatherData[]> {
    const weatherPromises = this.popularCities.map((city) =>
      this.getWeatherByCity(city, provider),
    );
    return Promise.all(weatherPromises);
  }

  async getCityWeatherByCountry(
    country: string,
    provider?: WeatherProviderType,
  ): Promise<WeatherData> {
    return this.getWeatherByCity(country, provider);
  }

  async getCityWeatherHistory(
    city: string,
    provider?: WeatherProviderType,
  ): Promise<WeatherForecast> {
    return this.getWeatherForecast(city, provider);
  }

  async getAvailableProviders(): Promise<WeatherProviderType[]> {
    return this.weatherRegistry.getAllProviders();
  }
}
