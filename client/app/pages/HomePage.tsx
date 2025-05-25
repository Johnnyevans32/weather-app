import React, { useEffect, useState } from 'react';
import { getPopularCities, searchWeatherByCountry, type WeatherData } from '../lib/api/api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router';
import Navigation from '../components/Navigation';

const HomePage: React.FC = () => {
  const [popularCities, setPopularCities] = useState<WeatherData[]>([]);
  const [searchResults, setSearchResults] = useState<WeatherData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const data = await getPopularCities();
        setPopularCities(data);
      } catch (err) {
        setError("Failed to fetch popular cities.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      setLoading(true);
      setError(null);
      try {
        const results = await searchWeatherByCountry(searchTerm);
        setSearchResults(results);
        setLoading(false);
      } catch (err) {
        setError("Failed to search weather.");
        console.error(err);
        setLoading(false);
      }
    } else {
      setSearchResults([]); // Clear results if search term is empty
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const displayCities = searchTerm.trim() ? searchResults : popularCities;

  if (loading) {
    return <div>Loading weather data...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div>
      <Navigation />
      <div className="container mx-auto p-4">
        <div className="flex mb-4">
          <Input
            type="text"
            placeholder="Search by country..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            className="mr-2"
          />
          <Button onClick={handleSearch}>Search</Button>
        </div>

        {displayCities.length === 0 && searchTerm.trim() && (
          <div className="text-center">No results found for "{searchTerm}".</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayCities.map(city => (
            <Card key={city.name} onClick={() => navigate(`/weather/${city.name}`)} className="cursor-pointer">
              <CardHeader>
                <CardTitle>{city.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Temperature: {city.temperature}°C</p>
                <p>Conditions: {city.description}</p>
                {/* You can add more weather details here */}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage; 