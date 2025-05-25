import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { getWeatherHistory, type WeatherForecast } from '../lib/api/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import Navigation from '../components/Navigation';

const WeatherDetailPage: React.FC = () => {
  const { city } = useParams<{ city: string }>();
  const navigate = useNavigate();


  const [data, setData] = useState<WeatherForecast | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if(city){
          const result = await getWeatherHistory(city);
          setData(result);
        }
      } catch (err) {
        setError("Failed to fetch data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading weather details...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!data) {
    return <div>No weather data available for {city}.</div>;
  }

  const { weather } = data;

  return (
    <div>
      <Navigation />
      <div className="container mx-auto p-4">
        <div className="flex items-center mb-4">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mr-4">
            ← Back
          </Button>
          <h2 className="text-2xl font-bold">Weather History for {city}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Yesterday's Weather */}
          <Card>
            <CardHeader>
              <CardTitle>Yesterday</CardTitle>
              <CardDescription>{weather.yesterday.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Temperature: {weather.yesterday.temperature}°C</p>
              <p>Humidity: {weather.yesterday.humidity}%</p>
              <p>Wind Speed: {weather.yesterday.windSpeed} m/s</p>
            </CardContent>
          </Card>

          {/* Today's Weather */}
          <Card>
            <CardHeader>
              <CardTitle>Today</CardTitle>
              <CardDescription>{weather.today.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Temperature: {weather.today.temperature}°C</p>
              <p>Humidity: {weather.today.humidity}%</p>
              <p>Wind Speed: {weather.today.windSpeed} m/s</p>
            </CardContent>
          </Card>

          {/* Tomorrow's Weather */}
          <Card>
            <CardHeader>
              <CardTitle>Tomorrow</CardTitle>
              <CardDescription>{weather.tomorrow.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Temperature: {weather.tomorrow.temperature}°C</p>
              <p>Humidity: {weather.tomorrow.humidity}%</p>
              <p>Wind Speed: {weather.tomorrow.windSpeed} m/s</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WeatherDetailPage; 