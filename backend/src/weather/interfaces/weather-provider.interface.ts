export interface WeatherData {
  name: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  timestamp: number;
}

export interface WeatherForecast {
  city: string;
  weather: {
    yesterday: WeatherData;
    today: WeatherData;
    tomorrow: WeatherData;
  };
}

export interface IWeatherProvider {
  getWeatherByCity(city: string): Promise<WeatherData>;
  getWeatherForecast(city: string): Promise<WeatherForecast>;
} 