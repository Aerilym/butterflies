import { SupabaseClient, createClient, Provider } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { startAsync, makeRedirectUri } from 'expo-auth-session';

import { SB_URL, SB_KEY } from '@env';
import { Match, Message, Preferences, Profile } from '../types/database';
import { sendMessageParams, updateMatchLikeParams } from '../types/supabaseAPI';
import { isMobileDevice, isWeb } from '../helpers/environment';
import { getLogFiles, log } from '../services/log/logger';

export class SupabaseAPI {
  supabase: SupabaseClient;
  userID?: string;
  constructor() {
    log.debug('Creating Supabase API');
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
    log.debug('Logging in with provider:', provider);
    if (isWeb) {
      const { data, error } = await this.supabase.auth.signInWithOAuth({
        provider,
      });
      log.debug('Provider login response', data);
      if (error) log.error('Error logging in with provider: ', provider, error, data);
      return;
    }

    const redirectUrl = makeRedirectUri({ useProxy: false });

    const authResponse = await startAsync({
      authUrl: `${SB_URL}/auth/v1/authorize?provider=${provider}&redirect_to=${redirectUrl}`,
      returnUrl: redirectUrl,
    });

    log.debug('Login auth response', authResponse);
    if (authResponse.type !== 'success') return;

    const { data, error } = await this.supabase.auth.refreshSession({
      refresh_token: authResponse.params?.refresh_token,
    });
    log.debug('Provider login response', data);
    if (error) log.error('Error logging in with provider: ', provider, error, data);
  };

  /**
   * Logout of Supabase.
   */
  logout = async (): Promise<void> => {
    log.debug('Logging out');
    const { error } = await this.supabase.auth.signOut();
    if (error) log.error('Error logging out', error);
  };

  /**
   * Get the current enabled authentication providers from Supabase.
   * @returns A list of enabled providers
   */
  getEnabledAuthProviders = async (): Promise<Provider[]> => {
    const response = await fetch(
      'https://field-manager.aerilym.workers.dev/options?key=providerOrder'
    );

    const { value } = await response.json();

    log.debug('Enabled providers', value);
    if (!value || value.length === 0) log.warn('No enabled providers found');

    return value ?? [];
  };

  /**
   * Get a user's profile.
   * @param userID The user ID to get the profile for.
   * @returns The profile for the user.
   */
  getProfile = async (userID?: string): Promise<Profile> => {
    const { data: profile } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userID ?? this.userID)
      .limit(1)
      .single();
    return (profile ?? {}) as Profile;
  };

  /**
   * Get a user's preferences.
   * @param userID The user ID to get the profile for.
   * @returns The profile for the user.
   */
  getPreferences = async (userID?: string): Promise<Preferences> => {
    const { data: preferences } = await this.supabase
      .from('preferences')
      .select('*')
      .eq('user_id', userID ?? this.userID)
      .limit(1)
      .single();
    return (preferences ?? {}) as Preferences;
  };

  /**
   * Get a user's matches.
   * @param userID The user ID to get the matches for.
   * @returns A list of matches for the user.
   */
  getMatches = async (): Promise<Match[]> => {
    const { data: matches } = await this.supabase
      .from('matches')
      .select('*')
      .or('user_id1.eq.' + this.userID + ',user_id2.eq.' + this.userID)
      .eq('user1_liked', true)
      .eq('user2_liked', true)
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
   * @returns A list of profiles that the user can match with.
   */
  getMatchQueue = async (): Promise<Match[]> => {
    //TODO: Create a match queue solution to replace this profile getting method.
    /**
     * The select logic in JS is:
     * (user_id1 === userID && user1_liked === null && user2_likes !== false) ||
     * (user_id2 === userID && user2_liked === null && user1_likes !== false);
     */
    const { data: matchQueue } = await this.supabase
      .from('matches')
      .select('*')
      .or(
        `and(user_id1.eq.${this.userID},user1_liked.is.null,user2_liked.not.is.false),and(user_id2.eq.${this.userID},user2_liked.is.null,user1_liked.not.is.false)`
      );
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

  /**
   * Complete the user onboarding by setting the onboarded field to true in the database.
   */
  completeOnboarding = async (): Promise<void> => {
    await this.supabase.from('profiles').update({ onboarded: true }).eq('user_id', this.userID);
  };

  /**
   * Restart the user onboarding by setting the onboarded field to false in the database.
   */
  restartOnboarding = async (): Promise<void> => {
    await this.supabase.from('profiles').update({ onboarded: false }).eq('user_id', this.userID);
  };

  /**
   * Onboards the user. This is called after the user first logs in and fills in their profile and preferences. Supabase will create a profile and preferences row for the user when the account is created.
   * @param options The options to onboard the user with.
   */
  onboard = async ({
    profile,
    preferences,
  }: {
    profile: Profile;
    preferences: Preferences;
  }): Promise<void> => {
    // This deconstructs the object to remove the user_id and updated_at fields from the profile and preferences objects. This is because we don't want to update those fields.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { user_id: id_1, updated_at: up_1, onboarded, ...profileOptions } = profile;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { user_id: id_2, ...preferenceOptions } = preferences;

    await this.supabase
      .from('profiles')
      .update({ ...profileOptions })
      .eq('user_id', this.userID);

    await this.supabase
      .from('preferences')
      .update({ ...preferenceOptions })
      .eq('user_id', this.userID);
  };

  /**
   * Upload the log files between two dates to the Supabase logs storage bucket.
   * @param startDate The start date to upload the log files from. If this is not provided, it will upload the log file for the end date.
   * @param endDate The end date to upload the log files to. Default: Today.
   */
  uploadLogFiles = async (startDate?: Date, endDate = new Date()): Promise<void> => {
    if (!isMobileDevice) return;
    if (startDate)
      log.debug(
        'Uploading log files between',
        startDate.toISOString(),
        'and',
        endDate.toISOString()
      );
    else log.debug('Uploading log file for', endDate.toISOString());

    const logFiles = await getLogFiles(startDate, endDate);
    logFiles.forEach(async (logFile) => {
      log.debug('Uploading log file', logFile.name);
      const arrayBuffer = new TextEncoder().encode(logFile.contents).buffer;
      const { data, error } = await this.supabase.storage
        .from('logs')
        .upload(`${this.userID}/${logFile.name}`, arrayBuffer);
      if (error) log.error('File upload error', error);
      if (data) log.debug('File upload success', data);
    });
  };

  /**
   * Upload the log files for a number of days in the past.
   * @param pastDays The number of days in the past to upload the log files for. Default: 1.
   */
  uploadLogFileDays = async (pastDays = 1): Promise<void> => {
    if (pastDays < 1) return log.error('pastDays must be greater than 0');
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - pastDays - 1);
    await this.uploadLogFiles(startDate);
  };

  /**
   * Upload the log files for today and yesterday.
   */
  uploadLogFileTwoDays = async (): Promise<void> => {
    await this.uploadLogFileDays(2);
  };

  /**
   * Upload the log files for the last 7 days.
   */
  uploadLogFileOneWeek = async (): Promise<void> => {
    await this.uploadLogFileDays(7);
  };
}
