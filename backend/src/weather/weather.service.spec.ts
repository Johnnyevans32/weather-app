import { Test, TestingModule } from '@nestjs/testing';
import { WeatherService } from './weather.service';
import { ConfigService } from '@nestjs/config';
import { WeatherRegistry } from './weather-registry.service';
import { WeatherProviderType } from './enums/weather-provider.enum';
import { MockWeatherProvider } from './providers/mock-weather.provider';

describe('WeatherService', () => {
  let service: WeatherService;
  let weatherRegistry: WeatherRegistry;
  let mockProvider: MockWeatherProvider;

  const mockWeatherData = {
    name: 'London',
    temperature: 20,
    description: 'clear sky',
    humidity: 65,
    windSpeed: 4.1,
    timestamp: Date.now(),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      switch (key) {
        case 'WEATHER_PROVIDER':
          return WeatherProviderType.MOCK;
        default:
          return null;
      }
    }),
  };

  beforeEach(async () => {
    mockProvider = new MockWeatherProvider();
    jest.spyOn(mockProvider, 'getWeatherByCity').mockResolvedValue(mockWeatherData);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: WeatherRegistry,
          useValue: {
            get: jest.fn().mockReturnValue(mockProvider),
            getDefaultProviderType: jest.fn().mockReturnValue(WeatherProviderType.MOCK),
          },
        },
      ],
    }).compile();

    service = module.get<WeatherService>(WeatherService);
    weatherRegistry = module.get<WeatherRegistry>(WeatherRegistry);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getWeatherByCity', () => {
    it('should return weather data for a city using mock provider', async () => {
      const result = await service.getWeatherByCity('London');
      expect(result).toEqual(mockWeatherData);
      expect(weatherRegistry.get).toHaveBeenCalledWith(WeatherProviderType.MOCK);
      expect(mockProvider.getWeatherByCity).toHaveBeenCalledWith('London');
    });
  });

  describe('getCityWeatherHistory', () => {
    it('should return weather history for a city', async () => {
      const mockForecastData = {
        city: 'London',
        weather: {
          yesterday: { ...mockWeatherData, timestamp: Date.now() - 86400 },
          today: mockWeatherData,
          tomorrow: { ...mockWeatherData, timestamp: Date.now() + 86400 },
        },
      };

      jest.spyOn(mockProvider, 'getWeatherForecast').mockResolvedValue(mockForecastData);

      const result = await service.getCityWeatherHistory('London');
      expect(result).toBeDefined();
      expect(result.city).toBe('London');
      expect(result.weather).toHaveProperty('yesterday');
      expect(result.weather).toHaveProperty('today');
      expect(result.weather).toHaveProperty('tomorrow');
      expect(weatherRegistry.get).toHaveBeenCalledWith(WeatherProviderType.MOCK);
      expect(mockProvider.getWeatherForecast).toHaveBeenCalledWith('London');
    });
  });
}); 