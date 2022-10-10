import { useEffect, useRef, useState } from 'react';
import { View, TextInput, Button, ScrollView, Text, TouchableOpacity } from 'react-native';
import { supabase } from '../../provider/AuthProvider';
import { Message } from '../../types/database';
import { MessageBubble } from './MessageBubble';

export function ChatBox({ matchID, userID }: { matchID: string; userID: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [draftMessage, setDraftMessage] = useState<string>('');

  function newMessage(message: Message) {
    setMessages((prev) => [...prev, message]);
  }

  async function fetchMessages() {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('matchID', matchID)
      .order('createdAt', { ascending: true });

    if (error) {
      console.log('error', error);
      return;
    }
    setMessages(data as Message[]);
    supabase
      .channel(`public:messages:matchID=eq.${matchID}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `matchID=eq.${matchID}` },
        (message: Message) => {
          console.log('message', message.messageID);
          newMessage(message);
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
          const isSender = message.senderID === userID;

          let isLead = false;

          const messageIdx = messages.indexOf(message);
          if (messageIdx === 0) {
            isLead = true;
          } else {
            const prevMessage = messages[messageIdx - 1];
            if (message.senderID !== prevMessage.senderID) {
              isLead = true;
            }
            const timeDiff =
              new Date(message.createdAt).getTime() - new Date(prevMessage.createdAt).getTime();
            if (timeDiff > 1000 * 60 * 10) {
              isLead = true;
            }
          }

          return (
            <MessageBubble
              key={message.messageID}
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
            const { data, error } = await supabase
              .from('messages')
              .insert({ matchID, senderID: userID, text: draftMessage })
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
