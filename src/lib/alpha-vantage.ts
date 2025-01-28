import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY;
const BASE_URL = 'https://www.alphavantage.co/query';

export interface StockData {
  symbol: string;
  interval: string;
  data: {
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }[];
}

export async function getStockData(symbol: string, interval: string = '5min'): Promise<StockData> {
  try {
    if (!API_KEY) {
      throw new Error('Alpha Vantage API key is not configured');
    }

    const response = await axios.get(BASE_URL, {
      params: {
        function: 'TIME_SERIES_INTRADAY',
        symbol,
        interval,
        apikey: API_KEY,
      },
    });

    // Log the full response for debugging
    console.log('Alpha Vantage API Response:', JSON.stringify(response.data, null, 2));

    // Check for rate limit message
    if (response.data?.Note) {
      console.error('Alpha Vantage API Note:', response.data.Note);
      throw new Error('API rate limit reached. Please try again later.');
    }

    // Check for error message
    if (response.data?.['Error Message']) {
      console.error('Alpha Vantage API Error:', response.data['Error Message']);
      throw new Error(response.data['Error Message']);
    }

    const timeSeriesKey = `Time Series (${interval})`;
    const rawData = response.data[timeSeriesKey];

    if (!rawData) {
      console.error('Missing time series data:', JSON.stringify(response.data, null, 2));
      throw new Error('No time series data available for this symbol');
    }

    const data = Object.entries(rawData).map(([time, values]: [string, any]) => ({
      time,
      open: parseFloat(values['1. open']),
      high: parseFloat(values['2. high']),
      low: parseFloat(values['3. low']),
      close: parseFloat(values['4. close']),
      volume: parseInt(values['5. volume']),
    }));

    return {
      symbol,
      interval,
      data,
    };
  } catch (error) {
    console.error('Error fetching stock data:', error);
    throw new Error('Failed to fetch stock data');
  }
}

export async function searchSymbols(keywords: string) {
  try {
    if (!API_KEY) {
      throw new Error('Alpha Vantage API key is not configured');
    }

    const response = await axios.get(BASE_URL, {
      params: {
        function: 'SYMBOL_SEARCH',
        keywords,
        apikey: API_KEY,
      },
    });

    // Log the full response for debugging
    console.log('Alpha Vantage API Response:', JSON.stringify(response.data, null, 2));

    // Check for rate limit message
    if (response.data?.Note) {
      console.error('Alpha Vantage API Note:', response.data.Note);
      throw new Error('API rate limit reached. Please try again later.');
    }

    // Check for error message
    if (response.data?.['Error Message']) {
      console.error('Alpha Vantage API Error:', response.data['Error Message']);
      throw new Error(response.data['Error Message']);
    }

    if (!response.data || !response.data.bestMatches) {
      console.error('Unexpected API response structure:', JSON.stringify(response.data, null, 2));
      throw new Error('Invalid API response format');
    }

    const matches = response.data.bestMatches;
    if (!Array.isArray(matches)) {
      console.error('bestMatches is not an array:', typeof matches);
      throw new Error('Invalid API response format: bestMatches is not an array');
    }

    return matches.map((match: any) => ({
      symbol: match['1. symbol'],
      name: match['2. name'],
      type: match['3. type'],
      region: match['4. region'],
      marketOpen: match['5. marketOpen'],
      marketClose: match['6. marketClose'],
      timezone: match['7. timezone'],
      currency: match['8. currency'],
    }));
  } catch (error) {
    console.error('Error searching symbols:', error);
    throw new Error('Failed to search symbols');
  }
}
