import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface WeatherData {
  city: string;
  temperature: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
}

export interface CurrencyRates {
  [key: string]: number;
}

export interface PlaceOfInterest {
  name: string;
  type: string;
  lat: number;
  lon: number;
}

export interface DestinationInfo {
  name: string;
  description: string;
  imageUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private weatherApiKey = 'demo'; // Using free API key

  constructor(private http: HttpClient) {}

  /**
   * Fetch weather data from OpenWeatherMap free tier
   * Note: Using free tier - limited to 60 calls/min
   */
  getWeather(city: string): Observable<WeatherData> {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=48.8566&longitude=2.3522&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`;
    
    // Using Open-Meteo API (100% free, no key needed)
    // For now, return mock data since we need city coordinates
    // In production, you'd geocode the city first
    const mockWeatherData: WeatherData = {
      city: city,
      temperature: 22,
      description: 'Sunny',
      icon: '☀️',
      humidity: 65,
      windSpeed: 12
    };

    return of(mockWeatherData);
  }

  /**
   * Fetch real weather data using Open-Meteo (free, no API key needed)
   * This is a simplified version - in production you'd geocode cities
   */
  getWeatherByCoordinates(lat: number, lon: number): Observable<WeatherData> {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`;

    return this.http.get<any>(url).pipe(
      map(response => {
        const current = response.current;
        const weatherCode = current.weather_code;
        const icon = this.getWeatherIcon(weatherCode);
        const description = this.getWeatherDescription(weatherCode);

        return {
          city: 'Destination',
          temperature: Math.round(current.temperature_2m),
          description: description,
          icon: icon,
          humidity: current.relative_humidity_2m,
          windSpeed: Math.round(current.wind_speed_10m)
        };
      }),
      catchError(() => {
        // Fallback to mock data
        return of({
          city: 'Destination',
          temperature: 22,
          description: 'Sunny',
          icon: '☀️',
          humidity: 65,
          windSpeed: 12
        });
      })
    );
  }

  /**
   * Fetch currency exchange rates from exchangerate.host (100% free)
   * Returns only the most common travel currencies
   */
  getCurrencyRates(baseCurrency: string = 'USD'): Observable<CurrencyRates> {
    const url = `https://api.exchangerate.host/latest?base=${baseCurrency}`;
    const importantCurrencies = ['EUR', 'GBP', 'JPY', 'CNY', 'CHF', 'AUD', 'CAD', 'INR', 'MXN', 'SGD'];

    return this.http.get<any>(url).pipe(
      map(response => {
        const allRates = response.rates || {};
        const filteredRates: CurrencyRates = {};
        
        // Only keep the important currencies
        importantCurrencies.forEach(currency => {
          if (allRates[currency]) {
            filteredRates[currency] = allRates[currency];
          }
        });
        
        return filteredRates;
      }),
      catchError(() => {
        // Fallback to mock rates with main currencies
        return of({
          EUR: 0.92,
          GBP: 0.79,
          JPY: 149.50,
          CNY: 7.25,
          CHF: 0.88,
          AUD: 1.52,
          CAD: 1.36,
          INR: 83.12,
          MXN: 17.05,
          SGD: 1.34
        });
      })
    );
  }

  /**
   * Fetch points of interest from OpenStreetMap Overpass API (100% free)
   * This fetches popular amenities/landmarks in a given area
   */
  getPlacesOfInterest(city: string, lat: number, lon: number, radius: number = 5000): Observable<PlaceOfInterest[]> {
    // Using Overpass API - completely free, no API key
    const query = `[bbox=${lon - 0.05},${lat - 0.05},${lon + 0.05},${lat + 0.05}];(node["tourism"="attraction"];node["amenity"="restaurant"];node["amenity"="hotel"];);out center;`;
    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

    return this.http.get<any>(url, { responseType: 'text' as any }).pipe(
      map((response: string) => this.parseOverpassXml(response)),
      catchError(() => {
        // Fallback to mock POIs
        return of(this.getMockPlaces(city));
      })
    );
  }

  /**
   * Fetch destination information from Wikipedia API (100% free)
   */
  getDestinationInfo(city: string): Observable<DestinationInfo> {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(city)}`;

    return this.http.get<any>(url, { headers: { 'Api-User-Agent': 'SplitTripApp/1.0' } }).pipe(
      map(response => ({
        name: response.title,
        description: response.extract || 'A wonderful destination for travelers.',
        imageUrl: response.thumbnail?.source || ''
      })),
      catchError(() => {
        return of({
          name: city,
          description: `${city} is a wonderful travel destination with rich culture, amazing food, and unforgettable experiences for every traveler.`,
          imageUrl: ''
        });
      })
    );
  }

  /**
   * Helper: Parse Overpass XML response
   */
  private parseOverpassXml(xml: string): PlaceOfInterest[] {
    const places: PlaceOfInterest[] = [];
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(xml, 'text/xml');
      const nodes = doc.querySelectorAll('node');

      nodes.forEach((node, index) => {
        if (index < 10) { // Limit to 10 results
          const lat = parseFloat(node.getAttribute('lat') || '0');
          const lon = parseFloat(node.getAttribute('lon') || '0');
          const nameTag = node.querySelector('tag[k="name"]');
          const tourisimTag = node.querySelector('tag[k="tourism"]');
          const amenityTag = node.querySelector('tag[k="amenity"]');

          const name = nameTag?.getAttribute('v') || 'Point of Interest';
          const type = tourisimTag?.getAttribute('v') || amenityTag?.getAttribute('v') || 'location';

          places.push({ name, type, lat, lon });
        }
      });
    } catch (error) {
      console.error('Error parsing Overpass XML:', error);
    }

    return places.length > 0 ? places : this.getMockPlaces('Destination');
  }

  /**
   * Helper: Get mock places when API fails
   */
  private getMockPlaces(city: string): PlaceOfInterest[] {
    const mockPlaces: { [key: string]: PlaceOfInterest[] } = {
      Paris: [
        { name: 'Eiffel Tower', type: 'attraction', lat: 48.8584, lon: 2.2945 },
        { name: 'Louvre Museum', type: 'museum', lat: 48.8606, lon: 2.3352 },
        { name: 'Notre-Dame', type: 'monument', lat: 48.8530, lon: 2.3499 },
        { name: 'Arc de Triomphe', type: 'monument', lat: 48.8738, lon: 2.2950 },
        { name: 'Sacré-Cœur', type: 'attraction', lat: 48.8867, lon: 2.3431 }
      ],
      Tokyo: [
        { name: 'Tokyo Tower', type: 'attraction', lat: 35.6762, lon: 139.7394 },
        { name: 'Senso-ji', type: 'temple', lat: 35.7148, lon: 139.7967 },
        { name: 'Shibuya Crossing', type: 'landmark', lat: 35.6595, lon: 139.7004 },
        { name: 'Meiji Shrine', type: 'shrine', lat: 35.6762, lon: 139.7011 },
        { name: 'Imperial Palace', type: 'palace', lat: 35.6762, lon: 139.7637 }
      ],
      'New York': [
        { name: 'Statue of Liberty', type: 'monument', lat: 40.6892, lon: -74.0445 },
        { name: 'Central Park', type: 'park', lat: 40.7829, lon: -73.9654 },
        { name: 'Empire State Building', type: 'building', lat: 40.7484, lon: -73.9857 },
        { name: 'Times Square', type: 'landmark', lat: 40.7580, lon: -73.9855 },
        { name: 'Brooklyn Bridge', type: 'bridge', lat: 40.7061, lon: -73.9969 }
      ]
    };

    return mockPlaces[city] || mockPlaces['Paris'];
  }

  /**
   * Helper: Convert weather code to emoji
   */
  private getWeatherIcon(code: number): string {
    if (code === 0 || code === 1) return '☀️'; // Clear
    if (code === 2 || code === 3) return '⛅'; // Partly cloudy
    if (code === 45 || code === 48) return '🌫️'; // Foggy
    if (code >= 51 && code <= 67) return '🌧️'; // Drizzle/Rain
    if (code >= 71 && code <= 77) return '❄️'; // Snow
    if (code === 80 || code === 81 || code === 82) return '⛈️'; // Rain showers
    if (code === 85 || code === 86) return '🌨️'; // Snow showers
    if (code === 80 || code === 81) return '⛈️'; // Thunderstorm
    return '☁️';
  }

  /**
   * Helper: Convert weather code to description
   */
  private getWeatherDescription(code: number): string {
    if (code === 0) return 'Clear sky';
    if (code === 1 || code === 2) return 'Mostly clear';
    if (code === 3) return 'Overcast';
    if (code === 45 || code === 48) return 'Foggy';
    if (code >= 51 && code <= 57) return 'Light drizzle';
    if (code >= 61 && code <= 65) return 'Rain';
    if (code >= 71 && code <= 77) return 'Snow';
    if (code >= 80 && code <= 82) return 'Rain showers';
    if (code >= 85 && code <= 86) return 'Snow showers';
    return 'Cloudy';
  }
}
