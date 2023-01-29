import type { Message, Profile } from './database';

export type MainStackParamList = {
  Onboarding: undefined;
  MainTabs: undefined;
  Filters: undefined;
  Settings: undefined;
  Profile: undefined;
  Swipe: undefined;
  Dashboard: undefined;
  Matches: undefined;
  Chat: {
    matchID: string;
    matchProfile: Profile;
    messages: Message[];
  };
  DevTabs: undefined;
  DevHome: undefined;
  DevImages: undefined;
  DevLocation: undefined;
  DevLogs: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
};
