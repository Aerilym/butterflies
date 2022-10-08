export interface Message {
  id: string;
  matchID: string;
  userID: string;
  text: string;
  createdAt: string;
}

export interface Match {
  userID: string;
  id: string;
  user1: string;
  user2: string;
  createdAt: string;
  user1Liked: boolean;
  user2Liked: boolean;
}
