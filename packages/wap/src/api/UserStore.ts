import AsyncStorage from '@react-native-async-storage/async-storage';

import { Person } from '../types/userstore';
import { supabaseAPI } from '../provider/AuthProvider';
import { Match, Message } from '../types/database';

export class UserStore {
  public socials?: Person[] | undefined;
  public matchQueue?: Person[] | undefined;
  constructor() {
    this.getSocials();
    this.getMatchQueue();
  }

  /**
   * Get the socials item from the async storage and assigns it to the socials property. If there isn't anything in the async storage, it will fetch the socials from the database.
   */
  async getSocials(): Promise<void> {
    const storedSocials = await this.getItem('@socials');
    if (storedSocials) {
      this.socials = storedSocials;
    } else {
      if (supabaseAPI.userID) {
        this.refreshSocials();
      }
    }
  }

  /**
   * Get the match queue item from the async storage and assigns it to the matchQueue property. If there isn't anything in the async storage, it will fetch the match queue from the database.
   */
  async getMatchQueue(): Promise<void> {
    const storedMatchQueue = await this.getItem('@matchQueue');
    if (storedMatchQueue) {
      this.matchQueue = storedMatchQueue;
    } else {
      if (supabaseAPI.userID) {
        this.refreshMatchQueue();
      }
    }
  }

  /**
   * Refresh the socials property from supabase and store it in the socials property and the async storage.
   */
  refreshSocials = async (): Promise<void> => {
    const matches = await supabaseAPI.getMatches();
    this.socials = await this.getPeople(matches, true);
    await this.storeSocials(this.socials);
  };

  /**
   * Refresh the match queue property from supabase and store it in the matchQueue property and the async storage.
   */
  refreshMatchQueue = async (): Promise<void> => {
    const matches = await supabaseAPI.getMatchQueue();
    this.matchQueue = await this.getPeople(matches, false);
    await this.storeMatchQueue(this.matchQueue);
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
   * Store an item in the async storage.
   * @param key The key to store the item under
   * @param item The item to store
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  storeItem = async (key: string, item: any): Promise<void> => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(item));
    } catch (e) {
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
    try {
      const item = await AsyncStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (e) {
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
    const peopleGets = matches.map(async (match) => {
      const userID = match.user_id1 === supabaseAPI.userID ? match.user_id2 : match.user_id1;
      const profile = await supabaseAPI.getProfile(userID);
      const person: Person = {
        id: userID,
        profile,
        match,
        matched,
        messages: [],
      };
      if (!matched) return person;
      person.messages = await supabaseAPI.getMessages(match.match_id);
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
    if (!this.socials) return;
    const social = this.socials.find((social) => social.match.match_id === matchID);
    const socialIdx = this.socials.findIndex((social) => social.match.match_id === matchID);
    if (!social) return;
    social.messages.push(message);
    this.socials[socialIdx] = social;
    await this.storeSocials(this.socials);
  };
}
