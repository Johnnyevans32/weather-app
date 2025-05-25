import { Injectable, Inject } from '@nestjs/common';
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
    'Lagos',
    'Abuja',
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
    provider: WeatherProviderType = this.weatherRegistry.getDefaultProviderType(),
  ): Promise<WeatherData> {
    const weatherProvider = this.weatherRegistry.get(provider);
    return await this.getCachedOrFetch(`weather:${provider}:${city}`, () =>
      weatherProvider.getWeatherByCity(city),
    );
  }

  async getWeatherForecast(
    city: string,
    provider: WeatherProviderType = this.weatherRegistry.getDefaultProviderType(),
  ): Promise<WeatherForecast> {
    const weatherProvider = this.weatherRegistry.get(provider);
    return await this.getCachedOrFetch(`forecast:${provider}:${city}`, () =>
      weatherProvider.getWeatherForecast(city),
    );
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
