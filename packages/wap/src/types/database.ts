export interface Profile {
  user_id: string;
  updated_at: string;
  username: string;
  avatar_url: string;
  display_name: string;
  onboarded: string;
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

export interface Preferences {
  user_id: string;
  age_range: number[];
  random_switch: string;
  random_slider: string;
  random_radio: string;
  random_dropdown: string;
  random_checkboxes: string;
}
