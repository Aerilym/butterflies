import * as locationManager from 'expo-location';
import { LocationGeocodedAddress, LocationGeocodedLocation, LocationObject } from 'expo-location';
import { lookupLocationFromIP, parseLocation } from '../helpers/location';
import { log } from '../services/log/logger';

export interface LocationAPIParams {
  key: LocationAPIKeys;
}

interface LocationAPIKeys {
  googleGeocode: string;
}

export type GeocodeLocation = LocationGeocodedAddress & { geocodeTimestamp: number };

export type PositionObject = LocationObject & { source: PositionSource };

export type UserLocationData = PositionObject & GeocodeLocation;

type PositionSource = 'real' | 'old' | 'last' | 'ip';

export class LocationAPI {
  private _lastPosition: PositionObject | undefined;
  constructor({ key }: LocationAPIParams) {
    log.debug('Creating Location API');
    this.setGoogleApiKey(key.googleGeocode);
  }

  public get lastPosition(): PositionObject | undefined {
    if (!this._lastPosition) return;
    return { ...this._lastPosition, source: 'old' as PositionSource };
  }

  public set lastPosition(position: PositionObject | undefined) {
    this._lastPosition = position;
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
  async getCurrentPosition(): Promise<PositionObject | void> {
    log.debug('Getting current position');
    const hasPermission = await this.manageLocationPermission();
    if (!hasPermission) return;

    const position = await locationManager.getCurrentPositionAsync({});
    log.debug('Current position', position);

    if (!position) return;

    return { ...position, source: 'real' as PositionSource };
  }

  /**
   * Get the user's last known position, checking and asking for permission if required.
   * @returns The user's last known position if retrievable.
   */
  async getLastKnownPosition(): Promise<PositionObject | void> {
    log.debug('Getting last known position');
    const hasPermission = await this.manageLocationPermission();
    if (!hasPermission) return;

    const position = await locationManager.getLastKnownPositionAsync();
    log.debug('Last known position', position);

    if (!position) return;

    return { ...position, source: 'last' as PositionSource };
  }

  /**
   * Reverse geocodes a location to a postal address using the google geocode API.
   * @param position The user's position.
   * @returns A list of address results.
   */
  async getGeocodeLocations(position: PositionObject): Promise<GeocodeLocation[]> {
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
  async getGeocodeLocation(position: PositionObject): Promise<GeocodeLocation> {
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
    const position =
      (await this.getCurrentPosition()) ??
      this.lastPosition ??
      (await this.getLastKnownPosition()) ??
      (await this.getLocationFromIP());

    if (!position) {
      log.error('No position found', position);
      return null;
    }

    const geocodeLocation = await this.getGeocodeLocation(position);

    const userLocationData = {
      ...position,
      ...geocodeLocation,
    };
    log.debug('User location data', userLocationData);
    return userLocationData;
  }

  async getPositionFromLocation(
    location: GeocodeLocation | string
  ): Promise<LocationGeocodedLocation> {
    log.debug('Getting position from geocode location');
    if (this.isGeocodeLocation(location)) location = parseLocation(location);
    const position = (await locationManager.geocodeAsync(location))[0];
    log.debug('Position from geocode location', position);
    return position;
  }

  async getLocationFromIP(): Promise<UserLocationData | null> {
    log.debug('Getting location from IP');
    const location = await lookupLocationFromIP();
    log.debug('Location from IP', location);
    return location;
  }

  isGeocodeLocation(location: any): location is GeocodeLocation {
    return 'geocodeTimestamp' in location && 'latitude' in location && 'longitude' in location;
  }
}
