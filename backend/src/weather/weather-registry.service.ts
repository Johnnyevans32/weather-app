import { Injectable } from '@nestjs/common';
import { WeatherProviderType } from './enums/weather-provider.enum';
import { IWeatherProvider } from './interfaces/weather-provider.interface';
import { OpenWeatherMapProvider } from './providers/openweathermap.provider';
import { WeatherAPIProvider } from './providers/weatherapi.provider';
import { MockWeatherProvider } from './providers/mock-weather.provider';

@Injectable()
export class WeatherRegistry {
  private providers: Map<WeatherProviderType, IWeatherProvider> = new Map();

  constructor(
    private readonly openWeatherMapProvider: OpenWeatherMapProvider,
    private readonly weatherAPIProvider: WeatherAPIProvider,
    private readonly mockProvider: MockWeatherProvider,
  ) {
    this.register(WeatherProviderType.OPENWEATHERMAP, openWeatherMapProvider);
    this.register(WeatherProviderType.WEATHERAPI, weatherAPIProvider);
    this.register(WeatherProviderType.MOCK, mockProvider);
  }

  register(provider: WeatherProviderType, service: IWeatherProvider) {
    this.providers.set(provider, service);
  }

  get(provider: WeatherProviderType): IWeatherProvider {
    const service = this.providers.get(provider);
    if (!service) {
      throw new Error(`Weather provider ${provider} not found`);
    }
    return service;
  }

  getDefaultProviderType(): WeatherProviderType {
    return WeatherProviderType.OPENWEATHERMAP;
  }

  getAllProviders(): WeatherProviderType[] {
    return Array.from(this.providers.keys());
  }

  isValidProvider(provider: WeatherProviderType): boolean {
    return this.providers.has(provider);
  }
}
