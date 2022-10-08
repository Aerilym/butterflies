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
  };
};

export type AuthStackParamList = {
  Login: undefined;
};
