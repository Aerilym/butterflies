import { useEffect, useRef, useState } from 'react';
import { View, TextInput, Button, ScrollView } from 'react-native';
import { supabase } from '../../provider/AuthProvider';
import { Message } from '../../types/database';
import { SupabaseRealtimeResponse } from '../../types/supabase';
import { MessageBubble } from './MessageBubble';

export function ChatBox({ matchID, userID }: { matchID: string; userID: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [draftMessage, setDraftMessage] = useState<string>('');

  function newMessage(message: Message) {
    setMessages((prev) => [...prev, message]);
  }

  async function fetchMessages() {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('match_id', matchID)
      .order('created_at', { ascending: true });

    setMessages(data as Message[]);
    supabase
      .channel(`public:messages:match_id=eq.${matchID}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `match_id=eq.${matchID}` },
        (response: SupabaseRealtimeResponse) => {
          newMessage(response.new as Message);
        }
      )
      .subscribe();
  }

  useEffect(() => {
    fetchMessages();
  }, []);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const scrollViewRef = useRef<any>();

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: '867px',
        margin: '25px 10px',
        height: '100%',
      }}
    >
      <ScrollView
        style={{
          height: '90vh',
        }}
        showsVerticalScrollIndicator={false}
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
      >
        {messages.map((message) => {
          const isSender = message.sender_id === userID;

          let isLead = false;

          const messageIdx = messages.indexOf(message);
          if (messageIdx === 0) {
            isLead = true;
          } else {
            const prevMessage = messages[messageIdx - 1];
            if (message.sender_id !== prevMessage.sender_id) {
              isLead = true;
            }
            const timeDiff =
              new Date(message.created_at).getTime() - new Date(prevMessage.created_at).getTime();
            if (timeDiff > 1000 * 60 * 10) {
              isLead = true;
            }
          }

          return (
            <MessageBubble
              key={message.message_id}
              message={message}
              isSender={isSender}
              isLead={isLead}
            />
          );
        })}
      </ScrollView>
      <View
        style={{
          display: 'flex',
          padding: '10px',
          height: '10vh',
          flexDirection: 'row',
        }}
      >
        <TextInput
          style={{
            height: '100%',
            width: '100%',
            borderColor: 'gray',
            borderWidth: 1,
            borderRadius: 10,
          }}
          multiline
          placeholder="Enter your message..."
          onChangeText={(newText) => setDraftMessage(newText)}
          value={draftMessage}
        ></TextInput>
        <Button
          title="Send"
          onPress={async () => {
            await supabase
              .from('messages')
              .insert({ match_id: matchID, sender_id: userID, text: draftMessage })
              .single();
            setDraftMessage('');
          }}
        ></Button>
      </View>
    </View>
  );
}
