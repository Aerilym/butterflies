import { Match, Profile } from './database';

export interface sendMessageParams {
  matchID: string;
  senderID: string;
  message: string;
}

export interface updateMatchLikeParams {
  matchID: string;
  userPosition: 1 | 2;
  like: boolean;
}
