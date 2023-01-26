import type { LocationObjectCoords } from 'expo-location';
import { GeocodeLocation, UserLocationData } from '../api/location';
import { log } from '../services/log/logger';

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

interface IPGeoLocationResult {
  ip: string;
  hostname: string;
  continent_code: string;
  continent_name: string;
  country_code2: string;
  country_code3: string;
  country_name: string;
  country_capital: string;
  state_prov: string;
  district: string;
  city: string;
  zipcode: string;
  latitude: number;
  longitude: number;
  is_eu: boolean;
  calling_code: string;
  country_tld: string;
  languages: string;
  country_flag: string;
  geoname_id: string;
  isp: string;
  connection_type: string;
  organization: string;
  asn: string;
  currency: {
    code: string;
    name: string;
    symbol: string;
  };
  time_zone: {
    name: string;
    offset: number;
    current_time: string;
    current_time_unix: number;
    is_dst: boolean;
    dst_savings: number;
  };
}

/**
 * Lookup the location of a given IP address.
 * @param IP the IP address to lookup, if not provided the current IP will be used.
 * @returns the location of the IP address or undefined if the lookup failed.
 */
export const lookupLocationFromIP = async (IP?: string): Promise<void | UserLocationData> => {
  const apiKey = 'b6793efa924840a5a2842590382fd130';
  const baseUrl = 'https://api.ipgeolocation.io/ipgeo';
  let url = `${baseUrl}?apiKey=${apiKey}`;
  if (IP) url += `&ip=${IP}`;

  const result = await fetch(url);

  if (!result.ok) return log.warn('IP location lookup failed', result.status, result.statusText);

  const data: IPGeoLocationResult = await result.json();

  const now = Date.now();

  return {
    timestamp: now,
    geocodeTimestamp: now,
    coords: {
      latitude: data.latitude,
      longitude: data.longitude,
    },
    country: data.country_name,
    city: data.city,
    district: data.district,
    region: data.state_prov,
  } as UserLocationData;
};
