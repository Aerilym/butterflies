import { View, Text } from 'react-native';

export function MatchBox({ matchID, userID }: { matchID: string; userID: string }) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        borderWidth: 1,
      }}
    >
      <Text>
        {matchID}, {userID}
      </Text>
    </View>
  );
}
