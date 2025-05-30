import dotenv from 'dotenv';
dotenv.config();
// Complete the WeatherService class
class WeatherService {
    constructor() {
        // Define the baseURL, API key, and city name properties
        this.baseGeocodeUrl = 'http://api.openweathermap.org/geo/1.0/direct';
        this.baseForecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';
        this.apiKey = process.env.OPENWEATHER_API_KEY;
        this.city = '';
        if (!this.apiKey) {
            throw new Error('Missing OpenWeather API key');
        }
    }
    // Create fetchLocationData method
    async fetchLocationData(query) {
        const url = this.buildGeocodeQuery(query);
        const res = await fetch(url);
        const data = await res.json();
        if (!data.length)
            throw new Error('City not found');
        return data[0];
    }
    // Create destructureLocationData method
    destructureLocationData(locationData) {
        return {
            lat: locationData.lat,
            lon: locationData.lon
        };
    }
    // Create buildGeocodeQuery method
    buildGeocodeQuery(query) {
        return `${this.baseGeocodeUrl}?q=${encodeURIComponent(query)}&limit=1&appid=${this.apiKey}`;
    }
    // Create buildWeatherQuery method
    buildWeatherQuery({ lat, lon }) {
        return `${this.baseForecastUrl}?lat=${lat}&lon=${lon}&units=metric&appid=${this.apiKey}`;
    }
    // Create fetchAndDestructureLocationData method
    async fetchAndDestructureLocationData() {
        const rawLocation = await this.fetchLocationData(this.city);
        return this.destructureLocationData(rawLocation);
    }
    // Create fetchWeatherData method
    async fetchWeatherData(coordinates) {
        const url = this.buildWeatherQuery(coordinates);
        const res = await fetch(url);
        return await res.json();
    }
    // Build parseCurrentWeather method
    parseCurrentWeather(response) {
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
    buildForecastArray(currentWeather, weatherData) {
        const forecast = [currentWeather];
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
                if (forecast.length === 6)
                    break; // current + 5 days
            }
        }
        return forecast;
    }
    // Complete getWeatherForCity method
    async getWeatherForCity(city) {
        this.city = city;
        const coordinates = await this.fetchAndDestructureLocationData();
        const weatherData = await this.fetchWeatherData(coordinates);
        const currentWeather = this.parseCurrentWeather(weatherData);
        return this.buildForecastArray(currentWeather, weatherData.list);
    }
}
export default new WeatherService();
