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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  console.error("VITE_API_BASE_URL is not defined");
}

console.log({ API_BASE_URL });

const fetchApi = async <T>(
  endpoint: string,
  method: string = "GET",
  data?: any
): Promise<T> => {
  if (!API_BASE_URL) {
    throw new Error("API Base URL not configured");
  }

  const url = `${API_BASE_URL}${endpoint}`;

  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error("API call error:", error);
    throw error;
  }
};

export const getPopularCities = async (): Promise<WeatherData[]> => {
  console.log("Calling /weather/popular API");
  const data = await fetchApi<WeatherData[]>("/weather/popular");
  return data;
};

export const searchWeatherByCountry = async (
  country: string
): Promise<WeatherData> => {
  console.log(`Calling /weather/search API with country: ${country}`);
  const data = await fetchApi<WeatherData>(
    `/weather/search?country=${encodeURIComponent(country)}`
  );
  return data;
};

export const getWeatherHistory = async (
  city: string
): Promise<WeatherForecast> => {
  console.log(`Calling /weather/{city} API with city: ${city}`);
  const data = await fetchApi<WeatherForecast>(
    `/weather/${encodeURIComponent(city)}`
  );
  return data;
};

export const processAIChat = async (question: string) => {
  console.log(`Calling /ai/chat API with question: ${question}`);
  const data = await fetchApi<{ message: string; link: string | null }>(
    "/ai/chat",
    "POST",
    { question }
  );
  return data;
};
