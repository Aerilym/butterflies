export interface Message {
  id: string;
  matchID: string;
  userID: string;
  text: string;
  created_at: string;
  isDelivered: boolean;
}

export interface Match {
  userID: string;
  id: string;
  user1: string;
  user2: string;
  created_at: string;
  user1Liked: boolean;
  user2Liked: boolean;
}
