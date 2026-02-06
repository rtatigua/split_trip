import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService, WeatherData, DestinationInfo, CurrencyRates } from '../api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {
  // User state
  currentUser = signal({ name: 'Alex Morgan', avatar: '👤' });
  
  // Real API data
  selectedCity = signal('Paris');
  weatherData = signal<WeatherData>({
    city: 'Paris',
    temperature: 0,
    description: 'Loading...',
    icon: '⏳',
    humidity: 0,
    windSpeed: 0
  });
  destinationInfo = signal<DestinationInfo>({
    name: 'Paris',
    description: 'Loading destination info...',
    imageUrl: ''
  });
  isLoading = signal(false);
  currencyRates = signal<CurrencyRates>({});
  isLoadingRates = signal(false);

  // Popular cities for demo
  cities = signal([
    { name: 'Paris', lat: 48.8566, lon: 2.3522 },
    { name: 'Tokyo', lat: 35.6762, lon: 139.7580 },
    { name: 'New York', lat: 40.7128, lon: -74.0060 },
    { name: 'Barcelona', lat: 41.3851, lon: 2.1734 },
    { name: 'Sydney', lat: -33.8688, lon: 151.2093 }
  ]);

  // Currency helpers
  cityCurrencyMap: { [city: string]: string } = {
    Paris: 'EUR',
    Tokyo: 'JPY',
    'New York': 'USD',
    Barcelona: 'EUR',
    Sydney: 'AUD'
  };

  baseCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD'];
  selectedBaseCurrency = signal('USD');
  selectedTargetCurrency = signal('EUR');
  amount = signal(1);
  
  // Return a deduplicated list of currencies available for selection
  availableCurrencies() {
    const rates = this.currencyRates() || {};
    const keys = Object.keys(rates);
    const mapped = this.cityCurrencyMap[this.selectedCity()] || 'USD';
    const union = Array.from(new Set([...this.baseCurrencies, ...keys, mapped]));
    return union;
  }

  // Stats for highlights section
  stats = signal([
    { number: '10k+', label: 'Active Travelers', icon: '✈️' },
    { number: '500+', label: 'Destinations', icon: '🌍' },
    { number: 'AI', label: 'Smart Planning', icon: '🤖' }
  ]);

  constructor(
    private http: HttpClient,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    // Load initial data for default city (Paris)
    this.loadCityData('Paris');
    this.loadCurrencyRates();
  }

  loadCityData(cityName: string) {
    const city = this.cities().find(c => c.name === cityName);
    if (!city) return;

    this.isLoading.set(true);
    this.selectedCity.set(cityName);

    // Set target currency based on selected city
    const mapped = this.cityCurrencyMap[cityName] || 'USD';
    this.selectedTargetCurrency.set(mapped);
    // refresh rates for current base
    this.loadCurrencyRates(this.selectedBaseCurrency());

    // Fetch weather data
    this.apiService.getWeatherByCoordinates(city.lat, city.lon).subscribe(
      weather => {
        weather.city = cityName;
        this.weatherData.set(weather);
      },
      error => console.error('Error fetching weather:', error),
      () => this.isLoading.set(false)
    );

    // Fetch destination info from Wikipedia
    this.apiService.getDestinationInfo(cityName).subscribe(
      info => {
        this.destinationInfo.set(info);
      },
      error => console.error('Error fetching destination info:', error)
    );
  }

  explorePlans() {
    this.router.navigate(['/my-trips']);
  }

  startPlanning() {
    this.router.navigate(['/plan']);
  }

  loadCurrencyRates(baseCurrency?: string) {
    const base = baseCurrency || this.selectedBaseCurrency();
    this.isLoadingRates.set(true);
    this.apiService.getCurrencyRates(base).subscribe({
      next: (data) => {
        this.currencyRates.set(data);
        this.isLoadingRates.set(false);
      },
      error: () => {
        this.currencyRates.set({
          EUR: 0.92,
          GBP: 0.79,
          JPY: 149.50,
          AUD: 1.53,
          CAD: 1.36,
          CHF: 0.88,
          INR: 83.12,
          MXN: 17.05,
          SGD: 1.34,
          HKD: 7.81
        });
        this.isLoadingRates.set(false);
      }
    });
  }

  changeBaseCurrency(newBase: string) {
    this.selectedBaseCurrency.set(newBase);
    this.loadCurrencyRates(newBase);
  }

  getConvertedAmount(): number | null {
    const rates = this.currencyRates();
    const target = this.selectedTargetCurrency();
    const rate = rates ? (rates as any)[target] : undefined;
    const base = this.selectedBaseCurrency();
    // If target is same as base, return amount directly
    if (target === base) {
      return Number(Number(this.amount()).toFixed(2));
    }
    if (!rate) return null;
    return Number((Number(this.amount()) * rate).toFixed(2));
  }

  navigateTo(section: string) {
    if (section === 'explore') {
      this.router.navigate(['/my-trips']);
    } else if (section === 'my-trips') {
      this.router.navigate(['/my-trips']);
    }
  }

  logout() {
    console.log('Logout clicked');
    // In a real app, handle logout logic here
  }
}


