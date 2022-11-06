import { Match, Message, Profile } from './database';

export interface MatchQueueItem {
  match: Match;
  userPosition: 1 | 2;
  profile: Profile;
}

export interface MatchSocial {
  match: Match;
  profile: Profile;
  messages: Message[];
}
