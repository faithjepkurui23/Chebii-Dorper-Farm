/**
 * Free APIs Service for Chebii Family Dorper Sheep Farm
 * 
 * 100% Zero-Cost / Free Public APIs - No Paid Subscriptions Required:
 * 1. Open-Meteo Weather API: Completely free open weather for Iten, Kenya (2,400m altitude).
 *    No API key required, no billing, no credit card.
 * 2. Open Exchange Rates API (open.er-api.com): Completely free public exchange rates.
 *    No API key required, live KES/USD/EUR currency conversions.
 * 3. Google AI Studio Gemini Free Tier: Zero-cost AI tier with built-in offline
 *    livestock intelligence engine if no API key is provided.
 */

export interface ItenWeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  condition: string;
  altitude: number;
  elevation: string;
  livestockAdvice: string;
  source: string;
  isLive: boolean;
  updatedAt: string;
}

export interface FreeExchangeRates {
  base: string;
  rates: {
    KES: number;
    USD: number;
    EUR: number;
    GBP: number;
  };
  source: string;
  isLive: boolean;
  lastUpdated: string;
}

function getWeatherConditionAndAdvice(code: number, temp: number): { condition: string; advice: string } {
  if (code === 0) {
    return {
      condition: 'Sunny & Clear Skies',
      advice: 'Optimal dry highland pasture grazing. Good sunlight for lamb bone mineralization.'
    };
  } else if (code <= 3) {
    return {
      condition: 'Partly Cloudy Highland',
      advice: 'Comfortable grazing conditions for Dorper sheep at 2,400m. Keep fresh water accessible.'
    };
  } else if (code === 45 || code === 48) {
    return {
      condition: 'Highland Morning Mist / Fog',
      advice: 'Cold damp air in Iten. Ensure slatted barn ventilation is draft-free to prevent pneumonia.'
    };
  } else if (code >= 51 && code <= 67) {
    return {
      condition: 'Highland Rain / Drizzle',
      advice: 'Keep sheep sheltered during heavy downpours; inspect hooves to prevent foot rot in wet conditions.'
    };
  } else if (code >= 80 && code <= 82) {
    return {
      condition: 'Highland Showers',
      advice: 'Provide dry Rhodes hay in racks inside the shelter to maintain dry matter intake.'
    };
  } else if (code >= 95) {
    return {
      condition: 'Thunderstorm',
      advice: 'Keep all 4 Dorpers inside covered shelter; ensure lightning protection around perimeter.'
    };
  }

  return {
    condition: temp < 15 ? 'Cool Highland Weather' : 'Mild Highland Climate',
    advice: 'Provide Rhodes grass hay supplement and mineral licks.'
  };
}

/**
 * Fetches real-time weather in Iten, Elgeyo-Marakwet using Open-Meteo.
 * Free Open-Source API with NO API KEY required.
 */
export async function fetchItenWeather(): Promise<ItenWeatherData> {
  const fallback: ItenWeatherData = {
    temperature: 18.2,
    humidity: 65,
    windSpeed: 11.4,
    weatherCode: 2,
    condition: 'Pleasant Highland Climate',
    altitude: 2400,
    elevation: '2,400m ASL',
    livestockAdvice: 'Ideal Dorper fleece and body conditioning temperature in Iten. Good grazing conditions.',
    source: 'Highland Sensor Simulation',
    isLive: false,
    updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  try {
    const itenLat = 0.6738;
    const itenLng = 35.5082;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${itenLat}&longitude=${itenLng}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=Africa%2FNairobi`;

    const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);

    const data = await res.json();
    const current = data.current;
    const temp = Math.round(current.temperature_2m * 10) / 10;
    const humidity = Math.round(current.relative_humidity_2m);
    const windSpeed = Math.round(current.wind_speed_10m * 10) / 10;
    const code = current.weather_code ?? 1;

    const { condition, advice } = getWeatherConditionAndAdvice(code, temp);

    return {
      temperature: temp,
      humidity,
      windSpeed,
      weatherCode: code,
      condition,
      altitude: Math.round(data.elevation || 2400),
      elevation: `${Math.round(data.elevation || 2400)}m ASL`,
      livestockAdvice: advice,
      source: 'Open-Meteo (100% Free Public API)',
      isLive: true,
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  } catch (err) {
    console.info('Using offline Highland weather model (free fallback active):', err);
    return fallback;
  }
}

/**
 * Fetches real-time currency exchange rates from open.er-api.com.
 * Free Open Exchange Rates API with NO API KEY required.
 */
export async function fetchFreeExchangeRates(): Promise<FreeExchangeRates> {
  const fallback: FreeExchangeRates = {
    base: 'KES',
    rates: {
      KES: 1,
      USD: 0.00775, // approx 1 USD = 129 KES
      EUR: 0.00705, // approx 1 EUR = 142 KES
      GBP: 0.00605  // approx 1 GBP = 165 KES
    },
    source: 'Cached Fallback Rates',
    isLive: false,
    lastUpdated: new Date().toLocaleDateString()
  };

  try {
    const res = await fetch('https://open.er-api.com/v6/latest/KES', {
      signal: AbortSignal.timeout(3500)
    });
    if (!res.ok) throw new Error(`Rates API HTTP error ${res.status}`);

    const data = await res.json();
    if (data.result === 'success' && data.rates) {
      return {
        base: 'KES',
        rates: {
          KES: 1,
          USD: data.rates.USD || fallback.rates.USD,
          EUR: data.rates.EUR || fallback.rates.EUR,
          GBP: data.rates.GBP || fallback.rates.GBP
        },
        source: 'Open ER-API (100% Free Public API)',
        isLive: true,
        lastUpdated: new Date().toLocaleDateString()
      };
    }
    return fallback;
  } catch (err) {
    console.info('Using cached exchange rates (free fallback active):', err);
    return fallback;
  }
}
