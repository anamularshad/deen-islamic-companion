import { Coordinates, Qibla } from 'adhan';

export const KAABA_COORDINATES = {
  latitude: 21.4225,
  longitude: 39.8262,
};

export function calculateQiblaBearing(latitude: number, longitude: number): number {
  const coords = new Coordinates(latitude, longitude);
  const qiblaAngle = Qibla(coords);
  return Math.round(qiblaAngle * 10) / 10;
}

// Great circle distance in kilometers to Mecca
export function calculateDistanceToKaaba(latitude: number, longitude: number): number {
  const R = 6371; // Earth radius in km
  const lat1 = (latitude * Math.PI) / 180;
  const lon1 = (longitude * Math.PI) / 180;
  const lat2 = (KAABA_COORDINATES.latitude * Math.PI) / 180;
  const lon2 = (KAABA_COORDINATES.longitude * Math.PI) / 180;

  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

export function getBearingDirectionName(degrees: number): string {
  const directions = [
    'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
    'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW',
  ];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}
