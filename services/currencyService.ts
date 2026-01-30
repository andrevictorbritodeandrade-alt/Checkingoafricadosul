import { CurrencyRates } from '../types';
import { CACHE_KEY_RATES, ONE_HOUR_MS } from '../constants';

const API_URL = 'https://api.exchangerate-api.com/v4/latest/USD';

export const getRates = async (): Promise<CurrencyRates> => {
  // 1. Try to get from Cache
  const cached = localStorage.getItem(CACHE_KEY_RATES);
  if (cached) {
    const parsedCache: CurrencyRates = JSON.parse(cached);
    const now = Date.now();
    
    // If cache is fresh (less than 1 hour old), use it
    if (now - parsedCache.lastUpdated < ONE_HOUR_MS) {
      console.log('Using fresh cached rates');
      return parsedCache;
    }
  }

  // 2. Fetch from API
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    
    // Construct our safe rate object
    // API returns base USD. We need BRL and ZAR relative to USD.
    const rates: CurrencyRates = {
      USD: 1,
      BRL: data.rates.BRL || 5.0, // Fallback safe values if API structure changes
      ZAR: data.rates.ZAR || 18.0,
      lastUpdated: Date.now(),
    };

    // Save to cache
    localStorage.setItem(CACHE_KEY_RATES, JSON.stringify(rates));
    return rates;
    
  } catch (error) {
    console.error('Failed to fetch rates, checking for stale cache', error);
    
    // 3. Fallback: Use stale cache if available
    if (cached) {
      return JSON.parse(cached);
    }

    // 4. Absolute Fallback: Hardcoded approximations
    return {
      USD: 1,
      BRL: 5.80,
      ZAR: 18.50,
      lastUpdated: Date.now(),
    };
  }
};