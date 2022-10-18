import { SupabaseClient, createClient, Provider } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { startAsync, makeRedirectUri } from 'expo-auth-session';

import { SB_URL, SB_KEY } from '@env';
import { Match, Message, Profile } from '../types/database';

const isWeb = Platform.OS === 'web';

export class SupabaseAPI {
  supabase: SupabaseClient;
  constructor() {
    this.supabase = createClient(SB_URL, SB_KEY, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        storage: AsyncStorage,
        detectSessionInUrl: isWeb ? true : false,
      },
    });
  }

  /**
   * Login to an auth provider using Supabase.
   * @param provider A supabase auth provider
   */
  login = async (provider: Provider): Promise<void> => {
    if (isWeb) {
      await this.supabase.auth.signInWithOAuth({
        provider,
      });
      return;
    }

    const returnUrl = makeRedirectUri({ useProxy: false });
    const authUrl = `${SB_URL}/auth/v1/authorize?provider=${provider}&redirect_to=${returnUrl}`;
    const response = await startAsync({ authUrl, returnUrl });

    if (response.type !== 'success') {
      return;
    }

    const refreshToken = response.params?.refresh_token;
    if (!refreshToken) return;
    this.supabase.auth.setSessionFromToken(refreshToken);
  };

  /**
   * Logout of Supabase.
   */
  logout = async (): Promise<void> => {
    this.supabase.auth.signOut();
  };

  /**
   * Get the current enabled authentication providers from Supabase.
   * @returns A list of enabled providers
   */
  getEnabledAuthProviders = async (): Promise<Provider[]> => {
    //TODO: Replace mock function with method to get enabled providers from Supabase or somewhere.
    return ['spotify', 'apple', 'facebook', 'google'];
  };

  /**
   * Get a user's profile.
   * @param userID The user ID to get the profile for.
   * @returns The profile for the user.
   */
  getProfile = async (userID: string): Promise<Profile> => {
    const { data } = await this.supabase.from('profiles').select('*').eq('user_id', userID);
    const userProfile = data ? data[0] : {};
    return userProfile as Profile;
  };

  /**
   * Get a user's matches.
   * @param userID The user ID to get the matches for.
   * @returns A list of matches for the user.
   */
  getMatches = async (userID: string): Promise<Match[]> => {
    const { data } = await this.supabase
      .from('matches')
      .select('*')
      .or('user_id1.eq.' + userID + ',user_id2.eq.' + userID)
      .order('created_at', { ascending: true });
    const matches = data ? data : [];
    return matches as Match[];
  };

  /**
   * Get a match's messages.
   * @param matchID The match ID to get the messages for.
   * @returns A list of messages for the match.
   */
  getMessages = async (matchID: string): Promise<Message[]> => {
    const { data } = await this.supabase
      .from('messages')
      .select('*')
      .eq('match_id', matchID)
      .order('created_at', { ascending: true });
    const messages = data ? data : [];
    return messages as Message[];
  };

  /**
   * Send a message to a match.
   * @param matchID The match ID to send the message to.
   * @param senderID The user ID of the sender.
   * @param message The message to send.
   */
  sendMessage = async (matchID: string, senderID: string, message: string): Promise<void> => {
    await this.supabase
      .from('messages')
      .insert({ match_id: matchID, sender_id: senderID, text: message })
      .single();
  };
}
