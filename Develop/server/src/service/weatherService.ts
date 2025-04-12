import dotenv from 'dotenv';
dotenv.config();

// Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// Define a class for the Weather object
interface Weather {
  city: string;
  date: string;
  icon: string;
  description: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
}

// Complete the WeatherService class
class WeatherService {
  // Define the baseURL, API key, and city name properties
  private baseGeocodeUrl = 'http://api.openweathermap.org/geo/1.0/direct';
  private baseForecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';
  private apiKey = process.env.OPENWEATHER_API_KEY as string;
  private city = '';

  constructor() {
    if (!this.apiKey) {
      throw new Error('Missing OpenWeather API key');
    }
  }

  // Create fetchLocationData method
  private async fetchLocationData(query: string) {
    const url = this.buildGeocodeQuery(query);
    const res = await fetch(url);
    const data = await res.json();

    if (!data.length) throw new Error('City not found');
    return data[0];
  }

  // Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    return {
      lat: locationData.lat,
      lon: locationData.lon
    };
  }

  // Create buildGeocodeQuery method
  private buildGeocodeQuery(query: string): string {
    return `${this.baseGeocodeUrl}?q=${encodeURIComponent(query)}&limit=1&appid=${this.apiKey}`;
  }

  // Create buildWeatherQuery method
  private buildWeatherQuery({ lat, lon }: Coordinates): string {
    return `${this.baseForecastUrl}?lat=${lat}&lon=${lon}&units=metric&appid=${this.apiKey}`;
  }

  // Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
    const rawLocation = await this.fetchLocationData(this.city);

    return this.destructureLocationData(rawLocation);
  }

  // Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    const url = this.buildWeatherQuery(coordinates);
    const res = await fetch(url);
    return await res.json();
  }

  // Build parseCurrentWeather method
  private parseCurrentWeather(response: any): Weather {
    const current = response.list[0];

    return {
      city: response.city.name,
      date: current.dt_txt,
      icon: current.weather[0].icon,
      description: current.weather[0].description,
      temperature: current.main.temp,
      humidity: current.main.humidity,
      windSpeed: current.wind.speed,
    };
  }

  // Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]): Weather[] {
    const forecast: Weather[] = [currentWeather];
    const dailySet = new Set();

    for (const item of weatherData) {
      const date = item.dt_txt.split(' ')[0];
      if (!dailySet.has(date)) {
        dailySet.add(date);

        forecast.push({
          city: '',
          date: item.dt_txt,
          icon: item.weather[0].icon,
          description: item.weather[0].description,
          temperature: item.main.temp,
          humidity: item.main.humidity,
          windSpeed: item.wind.speed,
        });

        if (forecast.length === 6) break; // current + 5 days
      }
    }

    return forecast;
  }

  // Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    this.city = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    const weatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherData);
    
    return this.buildForecastArray(currentWeather, weatherData.list);
  }
}

export default new WeatherService();
