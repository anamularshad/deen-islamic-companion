import { CityLocation } from '../types';

export const POPULAR_CITIES: CityLocation[] = [
  // Holy Cities & Middle East
  { id: 'makkah', name: 'Makkah', country: 'Saudi Arabia', latitude: 21.4225, longitude: 39.8262, timezone: 'Asia/Riyadh', defaultMethod: 'UmmAlQura' },
  { id: 'madinah', name: 'Madinah', country: 'Saudi Arabia', latitude: 24.4672, longitude: 39.6111, timezone: 'Asia/Riyadh', defaultMethod: 'UmmAlQura' },
  { id: 'jerusalem', name: 'Al-Quds (Jerusalem)', country: 'Palestine', latitude: 31.7683, longitude: 35.2137, timezone: 'Asia/Jerusalem', defaultMethod: 'MuslimWorldLeague' },
  { id: 'cairo', name: 'Cairo', country: 'Egypt', latitude: 30.0444, longitude: 31.2357, timezone: 'Africa/Cairo', defaultMethod: 'Egyptian' },
  { id: 'dubai', name: 'Dubai', country: 'United Arab Emirates', latitude: 25.2048, longitude: 55.2708, timezone: 'Asia/Dubai', defaultMethod: 'Dubai' },
  { id: 'riyadh', name: 'Riyadh', country: 'Saudi Arabia', latitude: 24.7136, longitude: 46.6753, timezone: 'Asia/Riyadh', defaultMethod: 'UmmAlQura' },
  { id: 'doha', name: 'Doha', country: 'Qatar', latitude: 25.2854, longitude: 51.5310, timezone: 'Asia/Qatar', defaultMethod: 'Qatar' },
  { id: 'kuwait', name: 'Kuwait City', country: 'Kuwait', latitude: 29.3759, longitude: 47.9774, timezone: 'Asia/Kuwait', defaultMethod: 'Kuwait' },
  { id: 'istanbul', name: 'Istanbul', country: 'Turkey', latitude: 41.0082, longitude: 28.9784, timezone: 'Europe/Istanbul', defaultMethod: 'Turkey' },
  { id: 'amman', name: 'Amman', country: 'Jordan', latitude: 31.9454, longitude: 35.9284, timezone: 'Asia/Amman', defaultMethod: 'MuslimWorldLeague' },

  // South Asia
  { id: 'dhaka', name: 'Dhaka', country: 'Bangladesh', latitude: 23.8103, longitude: 90.4125, timezone: 'Asia/Dhaka', defaultMethod: 'Karachi' },
  { id: 'chittagong', name: 'Chittagong', country: 'Bangladesh', latitude: 22.3569, longitude: 91.7832, timezone: 'Asia/Dhaka', defaultMethod: 'Karachi' },
  { id: 'sylhet', name: 'Sylhet', country: 'Bangladesh', latitude: 24.8949, longitude: 91.8687, timezone: 'Asia/Dhaka', defaultMethod: 'Karachi' },
  { id: 'karachi', name: 'Karachi', country: 'Pakistan', latitude: 24.8607, longitude: 67.0011, timezone: 'Asia/Karachi', defaultMethod: 'Karachi' },
  { id: 'lahore', name: 'Lahore', country: 'Pakistan', latitude: 31.5204, longitude: 74.3587, timezone: 'Asia/Karachi', defaultMethod: 'Karachi' },
  { id: 'islamabad', name: 'Islamabad', country: 'Pakistan', latitude: 33.6844, longitude: 73.0479, timezone: 'Asia/Karachi', defaultMethod: 'Karachi' },
  { id: 'mumbai', name: 'Mumbai', country: 'India', latitude: 19.0760, longitude: 72.8777, timezone: 'Asia/Kolkata', defaultMethod: 'Karachi' },
  { id: 'delhi', name: 'New Delhi', country: 'India', latitude: 28.6139, longitude: 77.2090, timezone: 'Asia/Kolkata', defaultMethod: 'Karachi' },

  // Southeast Asia
  { id: 'jakarta', name: 'Jakarta', country: 'Indonesia', latitude: -6.2088, longitude: 106.8456, timezone: 'Asia/Jakarta', defaultMethod: 'Singapore' },
  { id: 'kualalumpur', name: 'Kuala Lumpur', country: 'Malaysia', latitude: 3.1390, longitude: 101.6869, timezone: 'Asia/Kuala_Lumpur', defaultMethod: 'Singapore' },
  { id: 'singapore', name: 'Singapore', country: 'Singapore', latitude: 1.3521, longitude: 103.8198, timezone: 'Asia/Singapore', defaultMethod: 'Singapore' },

  // Europe & UK
  { id: 'london', name: 'London', country: 'United Kingdom', latitude: 51.5074, longitude: -0.1278, timezone: 'Europe/London', defaultMethod: 'MuslimWorldLeague' },
  { id: 'birmingham', name: 'Birmingham', country: 'United Kingdom', latitude: 52.4862, longitude: -1.8904, timezone: 'Europe/London', defaultMethod: 'MuslimWorldLeague' },
  { id: 'paris', name: 'Paris', country: 'France', latitude: 48.8566, longitude: 2.3522, timezone: 'Europe/Paris', defaultMethod: 'MuslimWorldLeague' },
  { id: 'berlin', name: 'Berlin', country: 'Germany', latitude: 52.5200, longitude: 13.4050, timezone: 'Europe/Berlin', defaultMethod: 'MuslimWorldLeague' },

  // North America
  { id: 'newyork', name: 'New York', country: 'United States', latitude: 40.7128, longitude: -74.0060, timezone: 'America/New_York', defaultMethod: 'NorthAmerica' },
  { id: 'chicago', name: 'Chicago', country: 'United States', latitude: 41.8781, longitude: -87.6298, timezone: 'America/Chicago', defaultMethod: 'NorthAmerica' },
  { id: 'losangeles', name: 'Los Angeles', country: 'United States', latitude: 34.0522, longitude: -118.2437, timezone: 'America/Los_Angeles', defaultMethod: 'NorthAmerica' },
  { id: 'toronto', name: 'Toronto', country: 'Canada', latitude: 43.6532, longitude: -79.3832, timezone: 'America/Toronto', defaultMethod: 'NorthAmerica' },

  // Oceania & Africa
  { id: 'sydney', name: 'Sydney', country: 'Australia', latitude: -33.8688, longitude: 151.2093, timezone: 'Australia/Sydney', defaultMethod: 'MuslimWorldLeague' },
  { id: 'melbourne', name: 'Melbourne', country: 'Australia', latitude: -37.8136, longitude: 144.9631, timezone: 'Australia/Melbourne', defaultMethod: 'MuslimWorldLeague' },
  { id: 'nairobi', name: 'Nairobi', country: 'Kenya', latitude: -1.2921, longitude: 36.8219, timezone: 'Africa/Nairobi', defaultMethod: 'MuslimWorldLeague' },
  { id: 'capetown', name: 'Cape Town', country: 'South Africa', latitude: -33.9249, longitude: 18.4241, timezone: 'Africa/Johannesburg', defaultMethod: 'MuslimWorldLeague' },
];

export const DEFAULT_CITY = POPULAR_CITIES[0]; // Makkah
