/**
 * API INTEGRATIONS GUIDE
 * SplitTrip - Angular 21 Travel Planning App
 * 
 * This document explains all free APIs integrated into the application
 * and how to use them.
 */

/**
 * ============================================
 * 1. OPEN-METEO WEATHER API
 * ============================================
 * 
 * URL: https://api.open-meteo.com
 * 
 * Features:
 * - 100% FREE - No API key required
 * - Real-time weather data
 * - Historical and forecast data
 * - Unlimited requests
 * 
 * Usage in SplitTrip:
 * - Component: Home page
 * - Displays current weather for selected city
 * - Shows temperature, humidity, wind speed
 * - Live weather icon based on weather code
 * 
 * Endpoint:
 * GET /v1/forecast?latitude={lat}&longitude={lon}&current={fields}&timezone=auto
 * 
 * Response includes:
 * {
 *   "current": {
 *     "temperature_2m": 22.5,
 *     "relative_humidity_2m": 65,
 *     "weather_code": 0,
 *     "wind_speed_10m": 12.3
 *   }
 * }
 * 
 * Implementation:
 * - Located in: ApiService.getWeatherByCoordinates()
 * - Used in: Home component ngOnInit()
 * - Triggers when user selects a city
 * - Fallback: Mock data if API fails
 * 
 * Limitations:
 * - Requires lat/lon coordinates (not city names)
 * - No restriction on calls
 */

/**
 * ============================================
 * 2. EXCHANGERATE.HOST API
 * ============================================
 * 
 * URL: https://api.exchangerate.host
 * 
 * Features:
 * - 100% FREE - No API key required
 * - Real-time currency exchange rates
 * - 160+ currencies supported
 * - No rate limiting
 * 
 * Usage in SplitTrip:
 * - Component: Trips page
 * - Shows live USD to other currency conversion
 * - Displays EUR, GBP, JPY, AUD, CAD rates
 * - Helps users understand trip budget costs
 * 
 * Endpoint:
 * GET /latest?base={CURRENCY}
 * 
 * Response includes:
 * {
 *   "base": "USD",
 *   "date": "2025-01-30",
 *   "rates": {
 *     "EUR": 0.92,
 *     "GBP": 0.79,
 *     "JPY": 149.50,
 *     "AUD": 1.52,
 *     "CAD": 1.36
 *   }
 * }
 * 
 * Implementation:
 * - Located in: ApiService.getCurrencyRates()
 * - Used in: Trips component ngOnInit()
 * - Displays in currency widget
 * - Fallback: Mock rates if API fails
 * 
 * Supported Currencies:
 * EUR, GBP, JPY, CNY, INR, AUD, CAD, CHF, SGD, HKD, and 150+ more
 */

/**
 * ============================================
 * 3. OPENSTREETMAP OVERPASS API
 * ============================================
 * 
 * URL: https://overpass-api.de
 * 
 * Features:
 * - 100% FREE - No API key required
 * - Query OpenStreetMap data
 * - Find points of interest (attractions, restaurants, etc)
 * - Geospatial queries
 * 
 * Usage in SplitTrip:
 * - Component: Trip details (future enhancement)
 * - Find attractions, restaurants, hotels near destination
 * - Display landmarks and POIs on map
 * 
 * Query Format (OverpassQL):
 * [bbox=lon_min,lat_min,lon_max,lat_max];
 * (
 *   node["tourism"="attraction"];
 *   node["amenity"="restaurant"];
 *   node["amenity"="hotel"];
 * );
 * out center;
 * 
 * Implementation:
 * - Located in: ApiService.getPlacesOfInterest()
 * - Parses XML response from Overpass
 * - Returns array of PlaceOfInterest objects
 * - Fallback: Mock POIs if API fails
 * 
 * Supported Queries:
 * - tourism=attraction (landmarks)
 * - amenity=restaurant (dining)
 * - amenity=hotel (accommodation)
 * - amenity=cafe (cafes)
 * - leisure=park (parks)
 * - historic=monument (monuments)
 * 
 * Limitations:
 * - Rate limit: ~40 queries/sec per IP
 * - XML response parsing required
 * - No authentication needed
 */

/**
 * ============================================
 * 4. WIKIPEDIA API
 * ============================================
 * 
 * URL: https://en.wikipedia.org/api/rest_v1
 * 
 * Features:
 * - 100% FREE - No API key required
 * - Get article summaries and descriptions
 * - Fetch destination information
 * - Image URLs included
 * 
 * Usage in SplitTrip:
 * - Component: Home page destination info card
 * - Displays city description from Wikipedia
 * - Shows relevant travel information
 * - Provides context before trip planning
 * 
 * Endpoint:
 * GET /page/summary/{TITLE}
 * 
 * Response includes:
 * {
 *   "title": "Paris",
 *   "extract": "Paris is the capital of France...",
 *   "thumbnail": {
 *     "source": "https://...",
 *     "width": 320,
 *     "height": 239
 *   }
 * }
 * 
 * Implementation:
 * - Located in: ApiService.getDestinationInfo()
 * - Used in: Home component when city selected
 * - Displays first 300 characters of extract
 * - Fallback: Generic description if API fails
 * 
 * Note:
 * - Must include User-Agent header:
 *   'Api-User-Agent': 'SplitTripApp/1.0'
 * - Works with city names, countries, landmarks
 */

/**
 * ============================================
 * API SERVICE ARCHITECTURE
 * ============================================
 * 
 * File: src/app/api.service.ts
 * 
 * Exported Interfaces:
 * - WeatherData: { city, temperature, description, icon, humidity, windSpeed }
 * - CurrencyRates: { [key: string]: number }
 * - PlaceOfInterest: { name, type, lat, lon }
 * - DestinationInfo: { name, description, imageUrl }
 * 
 * Methods:
 * 
 * 1. getWeather(city: string): Observable<WeatherData>
 *    - Get weather for city name
 *    - Returns mock data (geocoding not implemented)
 * 
 * 2. getWeatherByCoordinates(lat, lon): Observable<WeatherData>
 *    - Get weather using coordinates
 *    - Real API call to Open-Meteo
 *    - Converts weather codes to emoji icons
 * 
 * 3. getCurrencyRates(baseCurrency): Observable<CurrencyRates>
 *    - Get exchange rates from base currency
 *    - Real API call to exchangerate.host
 *    - Default base currency: USD
 * 
 * 4. getPlacesOfInterest(city, lat, lon, radius): Observable<PlaceOfInterest[]>
 *    - Get POIs in geographic area
 *    - Real API call to Overpass
 *    - Parses XML response
 * 
 * 5. getDestinationInfo(city): Observable<DestinationInfo>
 *    - Get city description and image
 *    - Real API call to Wikipedia
 *    - Returns article summary
 * 
 * Error Handling:
 * - All methods use RxJS catchError operator
 * - Falls back to mock data on failure
 * - Provides graceful degradation
 */

/**
 * ============================================
 * HOW TO EXTEND APIS
 * ============================================
 * 
 * Adding a New API:
 * 
 * 1. Create interface for response:
 *    export interface MyData {
 *      field1: string;
 *      field2: number;
 *    }
 * 
 * 2. Add method to ApiService:
 *    myApiCall(param: string): Observable<MyData> {
 *      return this.http.get<any>(url).pipe(
 *        map(response => transformResponse(response)),
 *        catchError(() => of(mockData))
 *      );
 *    }
 * 
 * 3. Inject in component:
 *    constructor(private apiService: ApiService) {}
 * 
 * 4. Call in ngOnInit or event handler:
 *    this.apiService.myApiCall(param).subscribe(
 *      data => this.mySignal.set(data)
 *    );
 * 
 * Best Practices:
 * - Always provide fallback/mock data
 * - Use RxJS operators (map, catchError)
 * - Type responses with interfaces
 * - Handle errors gracefully
 * - Show loading states with signals
 */

/**
 * ============================================
 * TESTING APIS LOCALLY
 * ============================================
 * 
 * 1. Weather API Test:
 *    curl "https://api.open-meteo.com/v1/forecast?latitude=48.8566&longitude=2.3522&current=temperature_2m,relative_humidity_2m"
 * 
 * 2. Exchange Rates Test:
 *    curl "https://api.exchangerate.host/latest?base=USD"
 * 
 * 3. Overpass API Test:
 *    curl "https://overpass-api.de/api/interpreter?data=[bbox=2.3,48.8,2.4,48.9];(node[%22tourism%22=%22attraction%22];);out;"
 * 
 * 4. Wikipedia API Test:
 *    curl -H "Api-User-Agent: SplitTripApp/1.0" "https://en.wikipedia.org/api/rest_v1/page/summary/Paris"
 * 
 * Browser Console Testing:
 * 1. Open browser DevTools (F12)
 * 2. Go to Network tab
 * 3. Navigate to home page
 * 4. Watch API requests in Network tab
 * 5. Check responses in Preview/Response tabs
 */

/**
 * ============================================
 * FUTURE ENHANCEMENTS
 * ============================================
 * 
 * 1. Google Places API (if budget available)
 *    - Better POI searching
 *    - Photos and ratings
 * 
 * 2. OpenWeatherMap (free tier)
 *    - More detailed weather
 *    - Air quality data
 * 
 * 3. Geoapify (free tier)
 *    - Geocoding (city name to lat/lon)
 *    - Reverse geocoding
 * 
 * 4. TomTom Maps (limited free tier)
 *    - Interactive maps
 *    - Route planning
 * 
 * 5. NewsAPI (free tier)
 *    - Travel news by destination
 *    - Local events
 */
