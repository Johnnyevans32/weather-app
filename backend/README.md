# Weather API

A NestJS-based weather API that provides weather information for cities around the world.

## Features

- Get weather data for popular cities
- Search weather by country
- Get weather history (yesterday, today, tomorrow) for any city
- AI-powered chat interface for weather queries
- Rate limiting and caching with Redis
- Swagger API documentation
- Docker support
- Multiple weather provider support (OpenWeatherMap and WeatherAPI)

## Prerequisites

- Node.js (v18 or higher)
- Yarn package manager
- Docker and Docker Compose (optional)
- OpenWeatherMap API key or WeatherAPI key
- Redis instance (for caching)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=3000
WEATHER_API_KEY=your_openweathermap_api_key
WEATHER_API_URL=https://api.openweathermap.org/data/2.5
WEATHERAPI_KEY=your_weatherapi_key
WEATHER_PROVIDER=openweathermap # or 'weatherapi'
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100
REDIS_URL=your_redis_url
```

## Installation

### Using Docker

1. Build and start the containers:
```bash
docker-compose up --build
```

### Manual Installation

1. Install dependencies:
```bash
yarn install
```

2. Start the development server:
```bash
yarn start:dev
```

## API Documentation

The API documentation is available at `/api` when the server is running.

### Endpoints

#### GET /weather/popular
Returns weather data for popular cities.

Response:
```json
[
  {
    "name": "London",
    "temperature": 20,
    "description": "clear sky",
    "humidity": 65,
    "windSpeed": 4.1,
    "timestamp": 1234567890
  },
  // ... more cities
]
```

#### GET /weather/search?country=xyz
Returns weather data for a country's capital or major city.

Response:
```json
{
  "name": "London",
  "temperature": 20,
  "description": "clear sky",
  "humidity": 65,
  "windSpeed": 4.1,
  "timestamp": 1234567890
}
```

#### GET /weather/:city
Returns weather data for yesterday, today, and tomorrow.

Response:
```json
{
  "city": "London",
  "weather": {
    "yesterday": {
      "temperature": 19,
      "description": "clear sky",
      "humidity": 65,
      "windSpeed": 4.1,
      "timestamp": 1234567890
    },
    "today": {
      "temperature": 20,
      "description": "clear sky",
      "humidity": 65,
      "windSpeed": 4.1,
      "timestamp": 1234567890
    },
    "tomorrow": {
      "temperature": 21,
      "description": "clear sky",
      "humidity": 65,
      "windSpeed": 4.1,
      "timestamp": 1234567890
    }
  }
}
```

#### POST /ai/chat
Processes a weather-related question.

Request:
```json
{
  "question": "What's the weather like in London?"
}
```

Response:
```json
{
  "message": "You can get the weather info for London here",
  "link": "/weather/London"
}
```

## Testing

Run the test suite:
```bash
# Unit tests
yarn test

# e2e tests
yarn test:e2e

# Test coverage
yarn test:cov
```

## Assumptions and Decisions

1. Multiple weather provider support (OpenWeatherMap and WeatherAPI)
2. Rate limiting set to 100 requests per minute
3. Temperature in Celsius
4. Natural language processing for chat interface
5. Popular cities list includes major global cities
6. Using class-validator for input validation
7. Swagger for API documentation
8. Docker for containerization
9. Redis for caching and rate limiting
10. Environment-based configuration

## License

MIT
