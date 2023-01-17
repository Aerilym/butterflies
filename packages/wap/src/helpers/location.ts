import type { LocationObjectCoords } from 'expo-location';
import { GeocodeLocation } from '../api/location';

/**
 * Calculate the distance between two points on the earth in kilometres.
 * @param point1 latitude and longitude of the first point
 * @param point2 latitude and longitude of the second point
 * @param minimumDistance a minimum accuracy of distance (default 2km)
 */
export const earthDistance = (
  point1: LocationObjectCoords,
  point2: LocationObjectCoords,
  minimumDistance = 2
): number => {
  const radius = 6371000; // Radius of the earth in meters
  const distanceLatitude = deg2rad(point2.latitude - point1.latitude);
  const distanceLongitude = deg2rad(point2.longitude - point1.longitude);

  const a =
    Math.sin(distanceLatitude / 2) * Math.sin(distanceLatitude / 2) +
    Math.cos(deg2rad(point1.latitude)) *
      Math.cos(deg2rad(point2.latitude)) *
      Math.sin(distanceLongitude / 2) *
      Math.sin(distanceLongitude / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = Math.round(radius * c) / 1000;
  return Math.max(distance, minimumDistance);
};

function deg2rad(degrees: number) {
  return degrees * (Math.PI / 180);
}

export const parseLocation = (location: GeocodeLocation): string => {
  const address = Object.values(location).join(' ');
  return address;
};
