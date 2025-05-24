import { Module } from '@nestjs/common';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { OpenWeatherMapProvider } from './providers/openweathermap.provider';
import { MockWeatherProvider } from './providers/mock-weather.provider';
import { WeatherAPIProvider } from './providers/weatherapi.provider';
import { WeatherRegistry } from './weather-registry.service';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [WeatherController],
  providers: [
    WeatherService,
    WeatherRegistry,
    OpenWeatherMapProvider,
    WeatherAPIProvider,
    MockWeatherProvider,
  ],
})
export class WeatherModule {}
