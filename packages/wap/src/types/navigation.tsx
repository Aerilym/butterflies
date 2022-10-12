import { Profile } from './database';

export type MainStackParamList = {
  MainTabs: undefined;
  Filters: undefined;
  Settings: undefined;
  Profile: undefined;
  Swipe: undefined;
  Dashboard: undefined;
  Matches: undefined;
  Chat: {
    matchID: string;
    userID: string;
    matchProfile: Profile;
  };
};

export type AuthStackParamList = {
  Login: undefined;
};
