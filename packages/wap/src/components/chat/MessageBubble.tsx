import { View, Text, StyleSheet } from 'react-native';
import { Message } from '../../types/database';

export function MessageBubble({ message, isSender }: { message: Message; isSender: boolean }) {
  const boxStyles = StyleSheet.create({
    container: {
      width: '100%',
      flexDirection: isSender ? 'row-reverse' : 'row',
    },
    bubble: {
      maxWidth: '450px',
      padding: '15px',
      marginBottom: 5,
      borderRadius: 15,
      backgroundColor: isSender ? '#579ffb' : '#ececec',
    },
  });
  return (
    <View style={boxStyles.container}>
      <View style={boxStyles.bubble}>
        <Text>{message.text}</Text>
      </View>
    </View>
  );
}
