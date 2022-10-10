export interface Message {
  messageID: string;
  matchID: string;
  senderID: string;
  text: string;
  createdAt: string;
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
