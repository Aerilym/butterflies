import { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Box } from 'native-base';

import type { Message } from '../../types/database';

function parseMessageTime(time: string): string {
  const date = new Date(time);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const suffix = hours >= 12 ? 'pm' : 'am';
  const hours12 = hours % 12 || 12;
  const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
  const timeString = `${hours12}:${minutesStr}${suffix}`;

  const isToday = date.toDateString() === new Date().toDateString();

  if (isToday) return timeString;

  const isPastSixDays = date.getTime() > new Date().getTime() - 6 * 24 * 60 * 60 * 1000;

  if (isPastSixDays)
    return `${date.toLocaleString('en-US', { weekday: 'short' })} at ${timeString}`;

  const dateStr = date.toLocaleString('en-US', { month: 'short', day: 'numeric' });
  const isThisYear = date.getFullYear() === new Date().getFullYear();
  if (isThisYear) return `${dateStr} at ${timeString}`;

  const yearStr = date.toLocaleString('en-US', { year: 'numeric' });
  return `${dateStr} ${yearStr} at ${timeString}`;
}

export function MessageBubble({
  message,
  isSender,
  isLead,
}: {
  message: Message;
  isSender: boolean;
  isLead: boolean;
}) {
  const [isPressed, setIsPressed] = useState<boolean>(false);

  const handleClick = () => {
    setIsPressed((current) => !current);
  };

  const boxStyles = StyleSheet.create({
    container: {
      marginTop: isLead ? 10 : 0,
    },
    button: {
      width: '100%',
      flexDirection: isSender ? 'row-reverse' : 'row',
    },
    bubble: {
      paddingVertical: 10,
      paddingHorizontal: 10,
      marginBottom: 2,
      borderRadius: 15,
      backgroundColor: isSender ? '#579ffb' : '#ececec',
    },
    textWhen: {
      fontSize: 12,
      color: '#a0a0a0',
      marginTop: 5,
      marginHorizontal: 10,
      textAlign: 'center',
    },
    textDelivered: {
      fontSize: 12,
      color: '#a0a0a0',
      marginBottom: 5,
      marginHorizontal: 10,
      textAlign: isSender ? 'right' : 'left',
    },
  });
  return (
    <Box style={boxStyles.container}>
      <Text
        style={{ ...boxStyles.textWhen, display: isLead ? 'flex' : isPressed ? 'flex' : 'none' }}
      >
        {parseMessageTime(message.created_at)}
      </Text>
      <TouchableOpacity key={message.message_id} onPress={handleClick} style={boxStyles.button}>
        <Box style={boxStyles.bubble}>
          <Text>{message.text}</Text>
        </Box>
      </TouchableOpacity>
      <Text style={{ ...boxStyles.textDelivered, display: isPressed ? 'flex' : 'none' }}>
        {isSender ? (message.is_delivered ? 'Delivered' : 'Sent') : ''}
      </Text>
    </Box>
  );
}
