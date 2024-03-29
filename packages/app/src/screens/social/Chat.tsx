import { useEffect, useRef, useState } from 'react';
import { TouchableOpacity, ScrollView } from 'react-native';
import { Box, Input } from 'native-base';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { supabaseAPI, userStore } from '../../provider/AuthProvider';
import type { MainStackParamList } from '../../types/navigation';
import type { Message, Profile } from '../../types/database';
import { MessageBubble } from '../../components/chat/MessageBubble';
import { FaceButton } from '../../components/profile/FaceButton';

// TODO: Create message parser
function parseMessage(message: string) {
  return message;
}

export default function ({
  navigation,
  route,
}: NativeStackScreenProps<MainStackParamList, 'Chat'>) {
  const {
    matchID,
    matchProfile,
    messages: socialMessages,
  } = route.params ?? {
    matchID: '',
    matchProfile: {} as Profile,
    messages: [] as Message[],
  };

  const [messages, setMessages] = useState<Message[]>(socialMessages);
  const [draftMessage, setDraftMessage] = useState<string>('');

  const userID = userStore.profile.user_id;

  useEffect(() => {
    //TODO: Move subscribe events to supabaseAPI class.
    supabaseAPI.supabase
      .channel(`public:messages:match_id=eq.${matchID}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `match_id=eq.${matchID}` },
        (response) => {
          // TODO: pull out the message from the response in a clearer way
          const message = response.new as Message;
          setMessages((prev) => [...prev, message]);
          userStore.addMessage(matchID, message);
        }
      )
      .subscribe();
  }, []);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const scrollViewRef = useRef<any>();
  return (
    <>
      <ScrollView
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
      <Box
        style={{
          height: '8%',
        }}
      >
        <Box
          style={{
            display: 'flex',
            height: '80%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginHorizontal: 10,
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: 'lightblue',
              alignSelf: 'center',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 100,
              height: 40,
              width: 40,
              marginHorizontal: 5,
            }}
            onPress={async () => {
              navigation.goBack();
            }}
          >
            <Ionicons name={'md-arrow-back'} size={24} />
          </TouchableOpacity>
          <FaceButton navigation={navigation} profile={matchProfile} size={40} />
          <Input
            style={{
              height: '90%',
              flex: 1,
              marginHorizontal: 10,
            }}
            w="1/2"
            maxW="200"
            placeholder="Enter your message..."
            onChangeText={(newText) => setDraftMessage(newText)}
            value={draftMessage}
          />
          <TouchableOpacity
            style={{
              alignSelf: 'center',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 100,
              height: 40,
              width: 40,
              marginHorizontal: 5,
            }}
            onPress={async () => {
              const parsedMessage = parseMessage(draftMessage);
              if (parsedMessage === '') return;
              supabaseAPI.sendMessage({ matchID, senderID: userID, message: parsedMessage });
              setDraftMessage('');
            }}
          >
            <Ionicons name={'send-sharp'} size={24} />
          </TouchableOpacity>
        </Box>
      </Box>
    </>
  );
}
