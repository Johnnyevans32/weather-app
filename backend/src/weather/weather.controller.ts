import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { WeatherProviderType } from './enums/weather-provider.enum';

@ApiTags('weather')
@Controller('weather')
@UseGuards(ThrottlerGuard)
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get('popular')
  @ApiOperation({ summary: 'Get weather for popular cities' })
  @ApiQuery({ name: 'provider', enum: WeatherProviderType, required: false })
  async getPopularCitiesWeather(
    @Query('provider') provider?: WeatherProviderType,
  ) {
    return this.weatherService.getPopularCitiesWeather(provider);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search weather by country' })
  @ApiQuery({ name: 'country', required: true })
  @ApiQuery({ name: 'provider', enum: WeatherProviderType, required: false })
  async getCityWeatherByCountry(
    @Query('country') country: string,
    @Query('provider') provider?: WeatherProviderType,
  ) {
    return this.weatherService.getCityWeatherByCountry(country, provider);
  }

  @Get(':city')
  @ApiOperation({ summary: 'Get weather history for a city' })
  @ApiQuery({ name: 'provider', enum: WeatherProviderType, required: false })
  async getCityWeatherHistory(
    @Param('city') city: string,
    @Query('provider') provider?: WeatherProviderType,
  ) {
    return this.weatherService.getCityWeatherHistory(city, provider);
  }
}
