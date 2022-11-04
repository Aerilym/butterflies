import { Person } from '../types/userstore';
import { supabaseAPI } from '../provider/AuthProvider';
import { Match } from '../types/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class UserStore {
  public socials?: Person[] | undefined;
  public matchQueue?: Person[] | undefined;
  constructor() {
    this.getSocials();
    this.getMatchQueue();
  }

  async getSocials(): Promise<void> {
    const storedSocials = await this.getItem('@socials');
    console.log('storedSocials', storedSocials);
    if (storedSocials) {
      this.socials = storedSocials;
    } else {
      if (supabaseAPI.userID) {
        this.refreshSocials();
      }
    }
  }

  async getMatchQueue(): Promise<void> {
    const storedMatchQueue = await this.getItem('@matchQueue');
    console.log('storedMatchQueue', storedMatchQueue);
    if (storedMatchQueue) {
      this.matchQueue = storedMatchQueue;
    } else {
      if (supabaseAPI.userID) {
        this.refreshMatchQueue();
      }
    }
  }

  refreshSocials = async (): Promise<void> => {
    const matches = await supabaseAPI.getMatches();
    this.socials = await this.getPeople(matches, true);
    await this.storeSocials(this.socials);
  };

  refreshMatchQueue = async (): Promise<void> => {
    const matches = await supabaseAPI.getMatchQueue();
    this.matchQueue = await this.getPeople(matches, false);
    await this.storeMatchQueue(this.matchQueue);
  };

  storeSocials = async (socials: Person[]): Promise<void> => {
    await this.storeItem('@socials', socials);
  };

  storeMatchQueue = async (matchQueue: Person[]): Promise<void> => {
    await this.storeItem('@matchQueue', matchQueue);
  };

  storeItem = async (key: string, item: any): Promise<void> => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(item));
    } catch (e) {
      console.log(e);
    }
  };

  getItem = async (key: string): Promise<any> => {
    try {
      const item = await AsyncStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  getPeople = async (matches: Match[], matched: boolean): Promise<Person[]> => {
    const peopleGets = matches.map(async (match) => {
      const userID = match.user_id1 === supabaseAPI.userID ? match.user_id2 : match.user_id1;
      const profile = await supabaseAPI.getProfile(userID);
      const person: Person = {
        id: userID,
        profile,
        match,
        matched,
      };
      if (!matched) return person;
      const messages = await supabaseAPI.getMessages(match.match_id);
      const lastMessage = messages.length > 0 ? messages[-1] : null;
      return {
        ...person,
        messages,
        lastMessage,
      };
    });
    const people = await Promise.all(peopleGets);
    return people;
  };
}
