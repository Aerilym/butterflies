import { Match, Message, Profile } from './database';

export interface SupabaseRealtimeResponse {
  schema: string;
  table: string;
  commit_timestamp: string;
  eventType: string;
  new: Profile | Match | Message;
  old: Profile | Match | Message;
  errors: null;
}
