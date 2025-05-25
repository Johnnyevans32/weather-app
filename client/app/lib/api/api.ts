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

export const getPopularCities = async (): Promise<WeatherData[]> => {
  console.log("Calling mock /weather/popular API");
  return [
    { name: "New York", temperature: 20, description: "Sunny", humidity: 50, windSpeed: 5, timestamp: Date.now() },
    { name: "London", temperature: 15, description: "Cloudy", humidity: 70, windSpeed: 10, timestamp: Date.now() },
    { name: "Tokyo", temperature: 22, description: "Partly Cloudy", humidity: 65, windSpeed: 7, timestamp: Date.now() },
    { name: "Paris", temperature: 18, description: "Rainy", humidity: 80, windSpeed: 15, timestamp: Date.now() },
  ];
};

export const searchWeatherByCountry = async (country: string): Promise<WeatherData[]> => {
  console.log(`Calling mock /weather/search API with country: ${country}`);
  const allCities = await getPopularCities(); 
  const filteredCities = allCities.filter(city => 
    city.name.toLowerCase().includes(country.toLowerCase())
  );
  return filteredCities;
};

export const getWeatherHistory = async (city: string): Promise<WeatherForecast> => {
  console.log(`Calling mock /weather/{city} API with city: ${city}`);
  return {
    city,
    weather: {
      yesterday: { name: city, temperature: 19, description: "Sunny", humidity: 60, windSpeed: 5, timestamp: Date.now() - 86400000 },
      today: { name: city, temperature: 20, description: "Sunny", humidity: 55, windSpeed: 6, timestamp: Date.now() },
      tomorrow: { name: city, temperature: 21, description: "Partly Cloudy", humidity: 50, windSpeed: 7, timestamp: Date.now() + 86400000 },
    }
  };
};

export const processAIChat = async (question: string) => {
  console.log(`Calling mock /ai/chat API with question: ${question}`);
  if (question.toLowerCase().includes("weather in")) {
    const cityMatch = question.toLowerCase().match(/weather in (\w+)/);
    const city = cityMatch ? cityMatch[1] : "a city";
    return {
      response: `You can view ${city}'s weather here.`, 
      link: `/weather/${city}`
    };
  } else {
    return { response: "I can only answer questions about the weather (with mock data!).", link: null };
  }
}; 