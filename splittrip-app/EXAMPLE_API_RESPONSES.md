/**
 * EXAMPLE API RESPONSES
 * Real responses from integrated free APIs
 */

/**
 * ============================================
 * 1. OPEN-METEO WEATHER API RESPONSE
 * ============================================
 */

// Request:
// GET https://api.open-meteo.com/v1/forecast?latitude=48.8566&longitude=2.3522&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto

// Response:
{
  "latitude": 48.856,
  "longitude": 2.3522,
  "generationtime_ms": 0.45,
  "utc_offset_seconds": 3600,
  "timezone": "Europe/Paris",
  "timezone_abbreviation": "CET",
  "elevation": 35,
  "current_units": {
    "time": "iso8601",
    "interval": "s",
    "temperature_2m": "°C",
    "relative_humidity_2m": "%",
    "weather_code": "wmo code",
    "wind_speed_10m": "km/h"
  },
  "current": {
    "time": "2025-01-30T14:30",
    "interval": 900,
    "temperature_2m": 22.5,
    "relative_humidity_2m": 65,
    "weather_code": 1,
    "wind_speed_10m": 12.3
  }
}

// Processed in SplitTrip:
{
  "city": "Paris",
  "temperature": 22,
  "description": "Mostly clear",
  "icon": "⛅",
  "humidity": 65,
  "windSpeed": 12
}

/**
 * ============================================
 * 2. EXCHANGERATE.HOST API RESPONSE
 * ============================================
 */

// Request:
// GET https://api.exchangerate.host/latest?base=USD

// Response:
{
  "motd": {
    "msg": "If you or your company use this project...",
    "url": "https://exchangerate.host/#/feedback"
  },
  "success": true,
  "base": "USD",
  "date": "2025-01-30",
  "rates": {
    "AED": 3.6725,
    "AFN": 68.15,
    "ALL": 92.45,
    "AMD": 389.1,
    "ANG": 1.79,
    "AOA": 826,
    "ARS": 996,
    "AUD": 1.52,
    "AWG": 1.79,
    "AZN": 1.7,
    "BAM": 1.7896,
    "BBD": 2,
    "BDT": 117.5,
    "BGN": 1.7896,
    "BHD": 0.376,
    "BIF": 3050,
    "BMD": 1,
    "BND": 1.34,
    "BOB": 6.9,
    "BRL": 5.16,
    "BSD": 1,
    "BTC": 0.000018,
    "BTN": 84.75,
    "BWP": 13.8,
    "BYN": 3.27,
    "BZD": 2,
    "CAD": 1.36,
    "CDF": 2700,
    "CHE": 0.937,
    "CHF": 0.86,
    "CHW": 0.937,
    "CLF": 0.0296,
    "CLP": 943,
    "CNH": 7.25,
    "CNY": 7.2,
    "COP": 4100,
    "CRC": 515,
    "CUC": 1,
    "CUP": 25.5,
    "CVE": 101.2,
    "CZK": 24.5,
    "DJF": 177.7,
    "DKK": 6.82,
    "DOP": 59.5,
    "DZD": 133.5,
    "EGP": 49.2,
    "ERN": 15,
    "ETB": 127.5,
    "EUR": 0.92,
    "FJD": 2.2,
    "FKP": 0.79,
    "GBP": 0.79,
    "GEL": 2.85,
    "GHS": 13.2,
    "GIP": 0.79,
    "GMD": 68,
    "GNF": 8600,
    "GTQ": 7.75,
    "GYD": 209,
    "HKD": 7.78,
    "HNL": 24.5,
    "HRK": 6.92,
    "HTG": 130,
    "HUF": 384,
    "IDR": 16250,
    "ILS": 3.5,
    "INR": 84.75,
    "IQD": 1310,
    "IRR": 42000,
    "ISK": 137,
    "JMD": 156,
    "JOD": 0.709,
    "JPY": 149.5,
    "KES": 129,
    "KGS": 85,
    "KHR": 4100,
    "KMF": 450,
    "KRW": 1300,
    "KWD": 0.307,
    "KYD": 0.833,
    "KZT": 530,
    "LAK": 20700,
    "LBP": 150000,
    "LKR": 333,
    "LRD": 189,
    "LSL": 18.5,
    "LYD": 4.75,
    "MAD": 10,
    "MDL": 17.5,
    "MGA": 4450,
    "MKD": 56.5,
    "MMK": 2100,
    "MNT": 3400,
    "MOP": 8,
    "MRU": 39,
    "MUR": 46,
    "MVR": 15.5,
    "MWK": 1650,
    "MXN": 20,
    "MYR": 4.4,
    "MZN": 64,
    "NAD": 18.5,
    "NGN": 1550,
    "NIO": 36.5,
    "NOK": 10.8,
    "NPR": 132,
    "NZD": 1.65,
    "OMR": 0.385,
    "PAB": 1,
    "PEN": 3.6,
    "PGK": 3.6,
    "PHP": 57,
    "PKR": 278,
    "PLN": 4,
    "PYG": 7200,
    "QAR": 3.64,
    "RON": 4.6,
    "RSD": 108,
    "RUB": 103,
    "RWF": 1350,
    "SAR": 3.75,
    "SBD": 8.3,
    "SCR": 13.5,
    "SDG": 600,
    "SEK": 10.8,
    "SGD": 1.34,
    "SHP": 0.79,
    "SLL": 22000,
    "SOS": 585,
    "SRD": 34,
    "SSP": 200,
    "STN": 22.5,
    "SYP": 12600,
    "SZL": 18.5,
    "THB": 34,
    "TJS": 10.5,
    "TMT": 3.5,
    "TND": 3.1,
    "TOP": 2.35,
    "TRY": 34.5,
    "TTD": 6.75,
    "TWD": 32,
    "TZS": 2650,
    "UAH": 42,
    "UGX": 3850,
    "USD": 1,
    "UYU": 42.5,
    "UZS": 13500,
    "VES": 54,
    "VND": 25500,
    "VUV": 119,
    "WST": 2.75,
    "XAF": 602,
    "XAG": 0.0285,
    "XAU": 0.00035,
    "XCD": 2.7,
    "XOF": 602,
    "XPD": 0.000815,
    "XPF": 109,
    "XPT": 0.00104,
    "YER": 250,
    "ZAR": 18.5,
    "ZMW": 26.5,
    "ZWL": 321
  }
}

// Processed in SplitTrip (filtered):
{
  "EUR": 0.92,
  "GBP": 0.79,
  "JPY": 149.5,
  "AUD": 1.52,
  "CAD": 1.36
}

/**
 * ============================================
 * 3. WIKIPEDIA API RESPONSE
 * ============================================
 */

// Request:
// GET https://en.wikipedia.org/api/rest_v1/page/summary/Paris

// Response (truncated):
{
  "type": "standard",
  "title": "Paris",
  "displaytitle": "<span class=\"mw-page-title-main\">Paris</span>",
  "namespace": {
    "id": 0,
    "case": "first-letter",
    "*": "Main"
  },
  "wikibase_item": "Q90",
  "titles": {
    "canonical": "Paris",
    "normalized": "Paris",
    "display": "<span class=\"mw-page-title-main\">Paris</span>"
  },
  "lastmodified": "2025-01-29T10:15:32Z",
  "lastmodifier": {
    "user": "Editor123",
    "gender": "unknown"
  },
  "description": "capital city of France",
  "description_source": "local",
  "extract": "Paris is the capital and most populous city of France...",
  "extract_html": "<p>Paris is the capital and most populous city of France...",
  "thumbnail": {
    "source": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/La_Tour_Eiffel_vue_de_la_Trocad%C3%A9ro_%28cropped%29.jpg/320px-La_Tour_Eiffel_vue_de_la_Trocad%C3%A9ro_%28cropped%29.jpg",
    "width": 320,
    "height": 241
  },
  "originalimage": {
    "source": "https://upload.wikimedia.org/wikipedia/commons/4/4b/La_Tour_Eiffel_vue_de_la_Trocad%C3%A9ro_%28cropped%29.jpg",
    "width": 1280,
    "height": 964
  },
  "lang": "en",
  "dir": "ltr",
  "revision": "1265478902",
  "tid": "f8d3e6a0-ab12-11ea-9a59-2a4138f7c6d9",
  "timestamp": "2025-01-29T10:15:32Z",
  "content_urls": {
    "desktop": {
      "page": "https://en.wikipedia.org/wiki/Paris",
      "revisions": "https://en.wikipedia.org/w/index.php?title=Paris&action=history",
      "edit": "https://en.wikipedia.org/w/index.php?title=Paris&action=edit",
      "talk": "https://en.wikipedia.org/wiki/Talk:Paris"
    }
  }
}

// Processed in SplitTrip:
{
  "name": "Paris",
  "description": "Paris is the capital and most populous city of France...",
  "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/.../320px-...jpg"
}

/**
 * ============================================
 * 4. OPENSTREETMAP OVERPASS API RESPONSE
 * ============================================
 */

// Request (OverpassQL):
// [bbox=2.3,48.8,2.4,48.9];
// (node["tourism"="attraction"]; node["amenity"="restaurant"];);
// out center;

// Response (XML):
<?xml version="1.0" encoding="UTF-8"?>
<osm version="0.6" generator="Overpass API">
  <note>The data included in this document is from www.openstreetmap.org. The data is made available under ODbL.</note>
  <meta osm_base="2025-01-30T14:30:02Z"/>

  <node id="123456" lat="48.8584" lon="2.2945">
    <center lat="48.8584" lon="2.2945"/>
    <tag k="name" v="Eiffel Tower"/>
    <tag k="tourism" v="attraction"/>
    <tag k="description" v="Iron lattice tower"/>
  </node>

  <node id="234567" lat="48.8606" lon="2.3352">
    <center lat="48.8606" lon="2.3352"/>
    <tag k="name" v="Louvre Museum"/>
    <tag k="tourism" v="museum"/>
    <tag k="description" v="Art museum"/>
  </node>

  <node id="345678" lat="48.8694" lon="2.3412">
    <center lat="48.8694" lon="2.3412"/>
    <tag k="name" v="L'Ami Jean"/>
    <tag k="amenity" v="restaurant"/>
    <tag k="cuisine" v="french"/>
  </node>

</osm>

// Processed in SplitTrip:
[
  {
    "name": "Eiffel Tower",
    "type": "attraction",
    "lat": 48.8584,
    "lon": 2.2945
  },
  {
    "name": "Louvre Museum",
    "type": "museum",
    "lat": 48.8606,
    "lon": 2.3352
  },
  {
    "name": "L'Ami Jean",
    "type": "restaurant",
    "lat": 48.8694,
    "lon": 2.3412
  }
]

/**
 * ============================================
 * ERROR RESPONSES & HANDLING
 * ============================================
 */

// If API fails, SplitTrip returns mock data instead:

// Mock Weather (if Open-Meteo down):
{
  "city": "Paris",
  "temperature": 22,
  "description": "Sunny",
  "icon": "☀️",
  "humidity": 65,
  "windSpeed": 12
}

// Mock Currency (if ExchangeRate.Host down):
{
  "EUR": 0.92,
  "GBP": 0.79,
  "JPY": 149.50,
  "AUD": 1.52,
  "CAD": 1.36
}

// Mock Destination (if Wikipedia down):
{
  "name": "Paris",
  "description": "Paris is a wonderful travel destination with rich culture, amazing food, and unforgettable experiences for every traveler.",
  "imageUrl": ""
}
