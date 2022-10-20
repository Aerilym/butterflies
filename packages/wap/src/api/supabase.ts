import { SupabaseClient, createClient, Provider } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { startAsync, makeRedirectUri } from 'expo-auth-session';

import { SB_URL, SB_KEY } from '@env';
import { Match, Message, Profile } from '../types/database';
import { sendMessageParams, updateMatchLikeParams } from '../types/supabaseAPI';

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
    const { data: profile } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userID)
      .limit(1)
      .single();
    return (profile ?? {}) as Profile;
  };

  /**
   * Get a user's matches.
   * @param userID The user ID to get the matches for.
   * @returns A list of matches for the user.
   */
  getMatches = async (userID: string): Promise<Match[]> => {
    const { data: matches } = await this.supabase
      .from('matches')
      .select('*')
      .or('user_id1.eq.' + userID + ',user_id2.eq.' + userID)
      .order('created_at', { ascending: true });
    return (matches ?? []) as Match[];
  };

  /**
   * Get a match's messages.
   * @param matchID The match ID to get the messages for.
   * @returns A list of messages for the match.
   */
  getMessages = async (matchID: string): Promise<Message[]> => {
    const { data: messages } = await this.supabase
      .from('messages')
      .select('*')
      .eq('match_id', matchID)
      .order('created_at', { ascending: true });
    return (messages ?? []) as Message[];
  };

  /**
   * Get the last message sent in a match.
   * @param matchID The match ID to get the messages for.
   * @returns The last message in the match or null if there is none.
   */
  getLastMessage = async (matchID: string): Promise<Message | null> => {
    const { data: message } = await this.supabase
      .from('messages')
      .select('*')
      .eq('match_id', matchID)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    return message as Message;
  };

  /**
   * Get a user's match queue.
   * @param userID The user ID to get a match queue for.
   * @returns A list of profiles that the user can match with.
   */
  getMatchQueue = async (userID: string): Promise<Match[]> => {
    //TODO: Create a match queue solution to replace this profile getting method.
    /**
     * The following conditions must be met for a match row to be returned:
     * user_id1 === userID || user_id2 === userID
     *  AND
     * (
     *    user1_liked === null && user2_liked === null
     *      OR
     *    user1_liked === null && user2_liked === true
     *      OR
     *    user1_liked === true && user2_liked === null
     * )
     */
    const { data: matchQueue } = await this.supabase
      .from('matches')
      .select('*')
      .or('user_id1.eq.' + userID + ',user_id2.eq.' + userID);
    return matchQueue as Match[];
  };

  /**
   * Send a message to a match.
   * @param matchID The match ID to send the message to.
   * @param senderID The user ID of the sender.
   * @param message The message to send.
   */
  sendMessage = async ({ matchID, senderID, message }: sendMessageParams): Promise<void> => {
    await this.supabase
      .from('messages')
      .insert({ match_id: matchID, sender_id: senderID, text: message })
      .single();
  };

  /**
   * Update a match's like status.
   * @param matchID The match ID to update the like for.
   * @param userPosition The position of the user in the match.
   * @param like Whether the user liked the match.
   */
  updateMatchLike = async ({
    matchID,
    userPosition,
    like,
  }: updateMatchLikeParams): Promise<void> => {
    const userLiked = userPosition === 1 ? 'user1_liked' : 'user2_liked';
    await this.supabase
      .from('matches')
      .update({ match_id: matchID, [userLiked]: like })
      .eq('match_id', matchID);
  };
}
