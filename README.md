# Weather App

A full-stack weather application built with React and NestJS that provides weather information for cities worldwide.

## Deployment Links

- Frontend: [https://weather-app-eight-livid-56.vercel.app/](https://weather-app-eight-livid-56.vercel.app/)
- Backend: [https://weather-app-ye9g.onrender.com](https://weather-app-ye9g.onrender.com)

## Features

- View weather data for popular cities
- Search weather by country
- View detailed weather history (yesterday, today, tomorrow)
- AI-powered chat interface for weather queries
- Responsive design
- Real-time weather updates

## Tech Stack

### Frontend
- React
- TypeScript
- React Router
- TailwindCSS
- shadcn/ui components
- Vite

### Backend
- NestJS
- TypeScript
- Redis for caching
- Multiple weather providers (OpenWeatherMap, WeatherAPI)
- Docker support
- Swagger API documentation

## Local Development

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

### Backend Setup

```bash
cd backend
npm install
npm run start:dev
```

## Environment Variables

### Frontend (.env)
```
VITE_API_BASE_URL=your_backend_url
```

### Backend (.env)
```
OPENWEATHER_API_KEY=your_openweathermap_api_key
OPENWEATHER_BASE_URL=https://api.openweathermap.org/data/2.5
WEATHERAPI_KEY=your_weatherapi_key
WEATHERAPI_URL=http://api.weatherapi.com/v1
REDIS_URL=your_redis_url
```

## API Documentation

API documentation is available at `/api` when running the backend server.

## License

[MIT](LICENSE)