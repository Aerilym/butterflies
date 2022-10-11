export interface Profile {
  user_id: string;
  updated_at: string;
  username: string;
}
export interface Match {
  match_id: string;
  user_id1: string;
  user_id2: string;
  created_at: string;
  user1_liked: boolean;
  user2_liked: boolean;
}

export interface Message {
  message_id: string;
  created_at: string;
  match_id: string;
  sender_id: string;
  text: string;
  is_delivered: boolean;
}
