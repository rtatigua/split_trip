# API Testing & Verification Guide

## Quick Testing Checklist

### 1. Test Home Page Weather API
- [ ] Navigate to home page (`/`)
- [ ] Check "Live Destination Preview" section loads
- [ ] Verify weather icon appears (☀️, ⛅, 🌧️, etc.)
- [ ] Check temperature displays in Celsius
- [ ] Verify humidity % and wind speed km/h appear
- [ ] See "📡 Real-time data from Open-Meteo API" text
- [ ] Click different city buttons (Paris, Tokyo, NYC, Barcelona, Sydney)
- [ ] Verify weather updates for each city
- [ ] Check "About [City]" card shows Wikipedia description

### 2. Test Wikipedia Destination Info API
- [ ] On home page, check destination info card loads
- [ ] Verify city name appears as heading
- [ ] See description text from Wikipedia (not mock text)
- [ ] Click each city button
- [ ] Confirm description updates for each city
- [ ] See "📡 Information from Wikipedia API" text

### 3. Test Currency Exchange Rates API
- [ ] Navigate to trips page (`/my-trips`)
- [ ] Scroll to find currency widget (above trip cards)
- [ ] Verify widget title: "Live Exchange Rates (USD)"
- [ ] Check rates display (EUR, GBP, JPY, AUD, CAD)
- [ ] Each rate shows 2 decimal places (e.g., 0.92)
- [ ] See "📡 Real-time data from exchangerate.host API" text
- [ ] Verify rates are not mock values (they change daily)

### 4. Test Error Handling
To test fallback behavior:
- [ ] Open browser DevTools (F12)
- [ ] Go to Network tab
- [ ] Set network to "Offline" mode
- [ ] Refresh page
- [ ] Verify app still shows mock data gracefully
- [ ] Check that loading states finish
- [ ] Re-enable network and refresh
- [ ] Verify real API data reappears

---

## API Endpoint Testing (Command Line)

### Test Open-Meteo API
```bash
# Basic weather request
curl "https://api.open-meteo.com/v1/forecast?latitude=48.8566&longitude=2.3522&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto"

# Response should include:
# "temperature_2m": 22.5
# "relative_humidity_2m": 65
# "weather_code": 0-85
# "wind_speed_10m": 12.3
```

### Test ExchangeRate.Host API
```bash
# Get current rates
curl "https://api.exchangerate.host/latest?base=USD"

# Response should include:
# "EUR": 0.92
# "GBP": 0.79
# "JPY": 149.50
# etc.
```

### Test Wikipedia API
```bash
# Get city summary
curl -H "Api-User-Agent: SplitTripApp/1.0" \
  "https://en.wikipedia.org/api/rest_v1/page/summary/Paris"

# Response should include:
# "title": "Paris"
# "extract": "Paris is the capital..."
# "thumbnail": { "source": "https://..." }
```

### Test Overpass API
```bash
# Get attractions in Paris
curl "https://overpass-api.de/api/interpreter?data=[bbox=2.3,48.8,2.4,48.9];(node[%22tourism%22=%22attraction%22];);out%20center;"

# Response is XML with nodes
```

---

## Browser Console Testing

### 1. Inject ApiService Directly
```javascript
// In browser console on app page
let apiService = ng.probe(document.querySelector('app-home')).injector.get('ApiService');

// Test weather
apiService.getWeatherByCoordinates(48.8566, 2.3522).subscribe(
  data => console.log('Weather:', data)
);

// Test currency
apiService.getCurrencyRates('USD').subscribe(
  data => console.log('Rates:', data)
);

// Test destination
apiService.getDestinationInfo('Paris').subscribe(
  data => console.log('Destination:', data)
);
```

### 2. Monitor Network Requests
```javascript
// In Network tab of DevTools:
// 1. Filter by XHR
// 2. Trigger API calls (click city buttons, navigate pages)
// 3. Click each request to see:
//    - URL (should be api.open-meteo.com, exchangerate.host, etc.)
//    - Status (200 = success)
//    - Response body (JSON or XML data)
//    - Response time (should be < 500ms usually)
```

### 3. Check Signal Values
```javascript
// In console on home page
let homeComponent = ng.probe(document.querySelector('app-home')).componentInstance;

// Check current values
console.log('Weather:', homeComponent.weatherData());
console.log('Selected City:', homeComponent.selectedCity());
console.log('Destination Info:', homeComponent.destinationInfo());
console.log('Is Loading:', homeComponent.isLoading());
```

---

## What Should Work

### ✅ Home Page (`/`)
- [x] 5 city selector buttons visible
- [x] Default city is "Paris"
- [x] Weather section shows real temp, humidity, wind
- [x] Weather icon matches weather condition
- [x] Destination info shows Wikipedia content
- [x] Loading spinner shows during API calls
- [x] Clicking city buttons triggers API updates
- [x] All 5 cities show different real weather
- [x] "📡 Real-time data from" text appears

### ✅ My Trips Page (`/my-trips`)
- [x] Currency widget appears above trip cards
- [x] Shows 5+ currency rates
- [x] All rates are numbers (not mock "10k+")
- [x] Rates display with 2 decimal places
- [x] "📡 Real-time data from exchangerate.host API" text
- [x] Widget updates on page load
- [x] Rates reflect actual market values

### ✅ Plan Trip Page (`/plan`)
- [x] Form inputs work
- [x] Create button validates
- [x] Success message appears on submit
- [x] Redirects to /my-trips after 2 seconds

---

## Debugging Tips

### API Not Loading?
1. Check browser console for errors (F12 → Console tab)
2. Check Network tab to see if requests are being made
3. Look for CORS errors (should be none, APIs are public)
4. Check if APIs are up: https://status.open-meteo.com
5. Try hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

### Signal Not Updating?
1. Verify subscribe() is called in component
2. Check subscription doesn't have errors
3. Verify signal.set() is called with data
4. Check component implements OnInit
5. Verify ngOnInit() is being called

### Wrong Data Showing?
1. Check if it's mock data vs real data
2. Look for "📡" emoji in UI (indicates real API)
3. Verify API response in Network tab
4. Check timestamp in response (should be recent)

### Performance Issues?
1. APIs usually respond in 100-500ms
2. Check Network tab for slow requests
3. Verify no duplicate subscriptions
4. Check browser extensions aren't blocking APIs

---

## City Coordinates for Manual Testing

If you want to test specific locations:

```typescript
const cities = [
  { name: 'Paris', lat: 48.8566, lon: 2.3522 },
  { name: 'Tokyo', lat: 35.6762, lon: 139.7580 },
  { name: 'New York', lat: 40.7128, lon: -74.0060 },
  { name: 'Barcelona', lat: 41.3851, lon: 2.1734 },
  { name: 'Sydney', lat: -33.8688, lon: 151.2093 },
  { name: 'London', lat: 51.5074, lon: -0.1278 },
  { name: 'Berlin', lat: 52.5200, lon: 13.4050 },
  { name: 'Dubai', lat: 25.2048, lon: 55.2708 }
];
```

---

## Known Limitations

### Open-Meteo Weather
- Only shows current weather (no 7-day forecast yet)
- Needs lat/lon, not city names directly
- Weather code conversion is handled in service

### ExchangeRate.Host
- Rates updated daily (not real-time per second)
- USD to major currencies only (for now)
- Can add more currencies easily

### Wikipedia API
- Summaries may be incomplete
- Some cities may not have detailed pages
- Image URLs may timeout (CDN issue)

### Overpass API
- Response is XML (not JSON)
- Manual parsing required
- Data depends on user contributions
- May return incomplete results for some areas

---

## Success Indicators

You'll know APIs are working when:
- ✅ Weather changes when selecting different cities
- ✅ Currency rates display real values (0.92, 149.50, etc.)
- ✅ City descriptions update on selection
- ✅ Network tab shows requests to api.open-meteo.com, exchangerate.host, wikipedia.org
- ✅ Response times are reasonable (< 1 second)
- ✅ No CORS errors in console
- ✅ "📡 Real-time data from..." text appears
- ✅ App gracefully falls back to mock data if offline

---

## Reporting Issues

If an API doesn't work:
1. Check if API is publicly accessible (test with curl)
2. Verify network connectivity
3. Check browser console for CORS errors
4. Look for console.error() messages
5. Review Network tab for failed requests
6. Check API status pages for outages

All integrated APIs are 100% free and should be reliable. If issues persist, check the API status pages.
