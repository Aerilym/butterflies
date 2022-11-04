import type { Profile, Match, Message } from './database';

export interface Person {
  id: string;
  profile: Profile;
  match: Match;
  matched: boolean;
  messages?: Message[] | null;
  lastMessage?: Message | null;
}
