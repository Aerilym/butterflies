import AsyncStorage from '@react-native-async-storage/async-storage';

import { GOOGLE_GEOCODE_API_KEY } from '@env';

import { Person } from '../types/userstore';
import { Match, Message, Preferences, Profile } from '../types/database';
import type { SupabaseAPI } from './supabase';
import { log } from '../services/log/logger';
import { LocationAPI, LocationAPIParams, UserLocationData } from './location';

const locationAPIConfig: LocationAPIParams = {
  key: {
    googleGeocode: GOOGLE_GEOCODE_API_KEY,
  },
};

export class UserStore {
  public socials?: Person[] | undefined;
  public matchQueue?: Person[] | undefined;
  public profile: Profile;
  public preferences: Preferences;
  public locationData?: UserLocationData | null;
  private supabaseAPI: SupabaseAPI;
  private locationAPI: LocationAPI;
  constructor(supabaseAPI: SupabaseAPI) {
    log.debug('Creating UserStore');
    this.supabaseAPI = supabaseAPI;
    this.locationAPI = new LocationAPI(locationAPIConfig);
    this.profile = {} as Profile;
    this.preferences = {} as Preferences;
    this.getSocials();
    this.getMatchQueue();
    this.getStoredProfile();
    this.getStoredPreferences();
    this.getLocationData();
  }

  /**
   * Get the socials item from the async storage and assign it to the socials property. If there isn't anything in the async storage, it will fetch the socials from the database.
   */
  async getSocials(): Promise<void> {
    log.debug('UserStore', 'getSocials called');
    const storedSocials = await this.getItem('@socials');
    if (storedSocials) {
      this.socials = storedSocials;
    } else {
      if (this.supabaseAPI.isUserIdSet()) {
        this.refreshSocials();
      }
    }
  }

  /**
   * Get the match queue item from the async storage and assign it to the matchQueue property. If there isn't anything in the async storage, it will fetch the match queue from the database.
   */
  async getMatchQueue(): Promise<void> {
    log.debug('UserStore', 'getMatchQueue called');
    const storedMatchQueue = await this.getItem('@matchQueue');
    if (storedMatchQueue) {
      this.matchQueue = storedMatchQueue;
    } else {
      if (this.supabaseAPI.isUserIdSet()) {
        this.refreshMatchQueue();
      }
    }
  }

  /**
   * Get the user's profile item from the async storage and assign it to the profile property. If there isn't anything in the async storage, it will fetch the profile from the database.
   */
  async getStoredProfile(): Promise<void> {
    log.debug('UserStore', 'getStoredProfile called');
    const storedProfile = await this.getItem('@profile');
    if (storedProfile) {
      this.profile = storedProfile;
    } else {
      if (this.supabaseAPI.isUserIdSet()) {
        this.refreshProfile();
      }
    }
  }

  /**
   * Get the user's preferences item from the async storage and assign it to the preferences property. If there isn't anything in the async storage, it will fetch the preferences from the database.
   */
  async getStoredPreferences(): Promise<void> {
    log.debug('UserStore', 'getStoredPreferences called');
    const storedPreferences = await this.getItem('@preferences');
    if (storedPreferences) {
      this.preferences = storedPreferences;
    } else {
      if (this.supabaseAPI.isUserIdSet()) {
        this.refreshPreferences();
      }
    }
  }

  /**
   * Get the user's location data item from the async storage and assign it to the locationData property. If there isn't anything in the async storage, it will fetch the location data from the database.
   * If the location data is stale, it will refresh the location data.
   * NOTE: The stale check happens after the stored location data is assigned to the locationData property. This is because its possible the user's location permission is revoked, so if it's stale but we can't get the new one we want to use the old one.
   */
  async getLocationData(): Promise<void> {
    log.debug('UserStore', 'getLocationData called');
    const storedLocationData = await this.getItem('@locationData');
    if (storedLocationData) {
      this.locationData = storedLocationData;
      if (this.isStale(storedLocationData.timestamp)) {
        this.refreshLocationData();
      }
    } else {
      this.refreshLocationData();
    }
  }

  /**
   * Refresh the socials property from supabase and store it in the socials property and the async storage.
   */
  refreshSocials = async (): Promise<void> => {
    log.debug('UserStore', 'refreshSocials called');
    const matches = await this.supabaseAPI.getMatches();
    this.socials = await this.getPeople(matches, true);
    await this.storeSocials(this.socials);
  };

  /**
   * Refresh the match queue property from supabase and store it in the matchQueue property and the async storage.
   */
  refreshMatchQueue = async (): Promise<void> => {
    log.debug('UserStore', 'refreshMatchQueue called');
    const matches = await this.supabaseAPI.getMatchQueue();
    this.matchQueue = await this.getPeople(matches, false);
    await this.storeMatchQueue(this.matchQueue);
  };

  /**
   * Refresh the user's location data and store it in the locationData property and the async storage.
   */
  refreshLocationData = async (): Promise<void> => {
    log.debug('UserStore', 'refreshLocationData called');

    const locationData = await this.locationAPI.getLocationData();
    this.locationData = locationData;
    await this.storeLocationData(this.locationData ?? ({} as UserLocationData));
  };

  /**
   * Store the socials property in the async storage.
   * @param socials The socials to store in the async storage
   */
  storeSocials = async (socials: Person[]): Promise<void> => {
    await this.storeItem('@socials', socials);
  };

  /**
   * Store the match queue property in the async storage.
   * @param matchQueue The match queue to store in the async storage
   */
  storeMatchQueue = async (matchQueue: Person[]): Promise<void> => {
    await this.storeItem('@matchQueue', matchQueue);
  };

  /**
   * Store the profile property in the async storage.
   * @param profile The profile to store in the async storage. If no profile is provided, it will store the profile property.
   */
  storeProfile = async (profile?: Profile): Promise<void> => {
    await this.storeItem('@profile', profile ?? this.profile);
  };

  /**
   * Store the preference property in the async storage.
   */
  storePreferences = async (preferences?: Preferences): Promise<void> => {
    await this.storeItem('@preferences', preferences ?? this.preferences);
  };

  /**
   * Store the user location data in the async storage.
   * @param locationData The user's location data
   */
  storeLocationData = async (locationData?: UserLocationData): Promise<void> => {
    await this.storeItem('@locationData', locationData ?? this.locationData);
  };

  /**
   * Store an item in the async storage.
   * @param key The key to store the item under
   * @param item The item to store
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  storeItem = async (key: string, item: any): Promise<void> => {
    log.debug('UserStore', 'storeItem called', key, item);
    try {
      await AsyncStorage.setItem(key, JSON.stringify(item));
    } catch (e) {
      log.error('UserStore', 'storeItem', e);
      return;
    }
  };

  /**
   * Get an item from the async storage.
   * @param key The key to get the item from
   * @returns The item stored under the key
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getItem = async (key: string): Promise<any> => {
    log.debug('UserStore', 'getItem called', key);
    try {
      const item = await AsyncStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      log.error('UserStore', 'getItem', e);
      return null;
    }
  };

  /**
   * Get the people social profiles from the matches from supabase.
   * @param matches The matches to get the people social profiles from.
   * @param matched Whether the matches are matched or not.
   * @returns The people from the matches.
   */
  getPeople = async (matches: Match[], matched: boolean): Promise<Person[]> => {
    log.debug('UserStore', 'getPeople called', matches, matched);
    const peopleGets = matches.map(async (match) => {
      const id = await this.supabaseAPI.userID;
      const userID = match.user_id1 === id ? match.user_id2 : match.user_id1;
      const profile = await this.supabaseAPI.getProfile(userID);
      const person: Person = {
        id: userID,
        profile,
        match,
        matched,
        messages: [],
      };
      if (!matched) return person;
      person.messages = await this.supabaseAPI.getMessages(match.match_id);
      return person;
    });
    const people = await Promise.all(peopleGets);
    return people;
  };

  /**
   * Add a message to the messages property of the person with the given match id.
   * @param matchID The match id to add the message to
   * @param message The message to add to the messages
   */
  addMessage = async (matchID: string, message: Message): Promise<void> => {
    log.debug('UserStore', 'addMessage called', matchID, message);
    if (!this.socials) return;
    const social = this.socials.find((social) => social.match.match_id === matchID);
    const socialIdx = this.socials.findIndex((social) => social.match.match_id === matchID);
    if (!social) return;
    social.messages.push(message);
    this.socials[socialIdx] = social;
    await this.storeSocials(this.socials);
  };

  /**
   * Refresh the profile property from supabase and store it in the profile property and the async storage.
   */
  refreshProfile = async (): Promise<void> => {
    log.debug('UserStore', 'refreshProfile called');
    const id = await this.supabaseAPI.userID;
    if (!id) return;
    const profile = await this.supabaseAPI.getProfile(id);
    this.profile = profile;
    await this.storeProfile(profile);
  };

  /**
   * Refresh the preferences property from supabase and store it in the preferences property and the async storage.
   */
  refreshPreferences = async (): Promise<void> => {
    log.debug('UserStore', 'refreshPreferences called');
    const id = await this.supabaseAPI.userID;
    if (!id) return;
    const preferences = await this.supabaseAPI.getPreferences(id);
    this.preferences = preferences;
    await this.storePreferences(preferences);
  };

  /**
   * Clear the profile property.
   */
  clearUserProfile = (): void => {
    log.debug('UserStore', 'clearUserProfile called');
    this.profile = {} as Profile;
  };

  isStale = (lastUpdated: Date | number): boolean => {
    if (typeof lastUpdated === 'number') lastUpdated = new Date(lastUpdated);
    const now = new Date();
    const diff = now.getTime() - lastUpdated.getTime();
    return diff > 1000 * 60 * 60 * 24;
  };
}
