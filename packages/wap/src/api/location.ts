import * as locationManager from 'expo-location';
import { LocationGeocodedAddress, LocationObject } from 'expo-location';
import { log } from '../services/log/logger';

export interface LocationAPIParams {
  key: LocationAPIKeys;
}

interface LocationAPIKeys {
  googleGeocode: string;
}

export type GeocodeLocation = LocationGeocodedAddress & { geocodeTimestamp: number };

export type UserLocationData = LocationObject & GeocodeLocation;

export class LocationAPI {
  private lastPosition?: LocationObject;
  constructor({ key }: LocationAPIParams) {
    log.debug('Creating Location API');
    this.setGoogleApiKey(key.googleGeocode);
  }

  /**
   * Sets a Google API Key for using Google Maps Geocoding API.
   * @param key Google API key.
   */
  setGoogleApiKey(key: string): void {
    log.debug('Google API key set');
    locationManager.setGoogleApiKey(key);
  }

  /**
   * Get the user's foreground location permission.
   * @returns If the user has granted location permission.
   */
  async getLocationPermission(): Promise<boolean> {
    log.debug('Getting location permission');
    const permissionResponse = await locationManager.requestForegroundPermissionsAsync();
    log.debug('Location permission response', permissionResponse);

    const { status } = permissionResponse;
    log.debug('Location permission status', status);
    return status === 'granted';
  }

  /**
   * Manages the user's location permission, requesting permission and managing the response.
   * @returns If the app has location permission.
   */
  async manageLocationPermission(): Promise<boolean> {
    const hasPermission = await this.getLocationPermission();
    if (!hasPermission) log.warn('Location permission not granted');
    return hasPermission;
  }

  /**
   * Get the user's current position, checking and asking for permission if required.
   * @returns The user's current position if retrievable.
   */
  async getCurrentPosition(): Promise<LocationObject | void> {
    log.debug('Getting current position');
    const hasPermission = await this.manageLocationPermission();
    if (!hasPermission) return;

    const position = await locationManager.getCurrentPositionAsync({});
    log.debug('Current position', position);

    if (!position) return;

    this.lastPosition = position;
    return position;
  }

  /**
   * Get the user's last known position, checking and asking for permission if required.
   * @returns The user's last known position if retrievable.
   */
  async getLastKnownPosition(): Promise<LocationObject | void> {
    log.debug('Getting last known position');
    const hasPermission = await this.manageLocationPermission();
    if (!hasPermission) return;

    const position = await locationManager.getLastKnownPositionAsync();
    log.debug('Last known position', position);

    if (!position) return;

    this.lastPosition = position;
    return position;
  }

  /**
   * Reverse geocodes a location to a postal address using the google geocode API.
   * @param position The user's position.
   * @returns A list of address results.
   */
  async getGeocodeLocations(position: LocationObject): Promise<GeocodeLocation[]> {
    log.debug('Getting geocoded locations', position);
    const { coords } = position;

    let locationGeocodedAddresses: LocationGeocodedAddress[] = [];
    try {
      locationGeocodedAddresses = await locationManager.reverseGeocodeAsync(coords);
    } catch (error) {
      log.error('Error geocoding location', error);
    }

    if (!locationGeocodedAddresses.length) log.warn('No geocode locations found');

    const now = Date.now();
    const geocodeLocations = locationGeocodedAddresses.map((location) => {
      return { ...location, geocodeTimestamp: now };
    });

    log.debug('Geocode locations', geocodeLocations);
    return geocodeLocations;
  }

  /**
   * Reverse geocodes a location to a postal address using the google geocode API.
   * @param position The user's position.
   * @returns An address result.
   */
  async getGeocodeLocation(position: LocationObject): Promise<GeocodeLocation> {
    const geocodeLocation = (await this.getGeocodeLocations(position))[0];
    log.debug('Geocode location', geocodeLocation);
    return geocodeLocation;
  }

  /**
   * Get the user's location data and reverse geocoded address, constructing a user location data object.
   * @returns The user's location data.
   */
  async getLocationData(): Promise<UserLocationData | null> {
    log.debug('Getting user location data');
    let position = await this.getCurrentPosition();
    if (!position) {
      log.debug('Position could not be retrieved, getting last position');
      position = this.lastPosition;
    }
    if (!position) {
      log.debug('No last position found');
      position = await this.getLastKnownPosition();
    }
    if (!position) return null;
    log.debug('Using position', position);

    const geocodeLocation = await this.getGeocodeLocation(position);

    const userLocationData = { ...position, ...geocodeLocation, geocodeTimestamp: Date.now() };
    log.debug('User location data', userLocationData);
    return userLocationData;
  }
}
