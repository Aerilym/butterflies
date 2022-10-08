import { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import { supabase } from '../../provider/AuthProvider';
import { Message } from '../../types/database';
import { MessageBubble } from './MessageBubble';

export function ChatBox({ matchID, userID }: { matchID: string; userID: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [draftMessage, setDraftMessage] = useState<string>('');

  async function fetchMessages() {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('matchID', matchID)
      .order('created_at', { ascending: true });

    if (error) {
      console.log('error', error);
      return;
    }
    setMessages(data as Message[]);
  }

  function newMessage(message: Message) {
    setMessages((prev) => [...prev, message]);
  }

  supabase
    .channel(`public:messages:id=eq.${matchID}`)
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'messages', filter: `id=eq.${matchID}` },
      (message: Message) => {
        newMessage(message);
      }
    )
    .subscribe();

  fetchMessages();

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
      <View
        style={{
          flex: 1,
        }}
      >
        {messages.map((message) => {
          const isSender = message.userID === userID;

          let isLead = false;

          const messageIdx = messages.indexOf(message);
          if (messageIdx === 0) {
            isLead = true;
          } else {
            const prevMessage = messages[messageIdx - 1];
            if (message.userID !== prevMessage.userID) {
              isLead = true;
            }
            const timeDiff =
              new Date(message.created_at).getTime() - new Date(prevMessage.created_at).getTime();
            if (timeDiff > 1000 * 60 * 10) {
              isLead = true;
            }
          }

          return (
            <MessageBubble key={message.id} message={message} isSender={isSender} isLead={isLead} />
          );
        })}
      </View>
      <View
        style={{
          display: 'flex',
          padding: '10px',
        }}
      >
        <TextInput
          style={{
            height: 40,
            borderColor: 'gray',
            borderWidth: 1,
            borderRadius: 10,
          }}
          placeholder="Type here to translate!"
          onChangeText={(newText) => setDraftMessage(newText)}
          value={draftMessage}
        ></TextInput>
        <Button
          title="Send"
          onPress={async () => {
            const { data, error } = await supabase
              .from('messages')
              .insert({ matchID, userID, text: draftMessage })
              .single();
            if (error) {
              console.log('error', error);
              return;
            }
            setDraftMessage('');
          }}
        ></Button>
      </View>
    </View>
  );
}
