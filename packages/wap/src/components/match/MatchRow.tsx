import { TouchableOpacity, Text, View } from 'react-native';

import { FaceButton } from '../profile/FaceButton';
import { MatchSocial } from '../../types/social';

export function MatchRow({
  navigation,
  matchSocial,
}: {
  // TODO: Add types for navigation and route
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navigation: any;
  matchSocial: MatchSocial;
}) {
  return (
    <TouchableOpacity
      key={matchSocial.match.match_id}
      onPress={() => {
        navigation.navigate('Chat', {
          matchID: matchSocial.match.match_id,
          matchProfile: matchSocial.profile,
          messages: matchSocial.messages,
        });
      }}
      style={{
        flexDirection: 'row',
        marginVertical: 10,
      }}
    >
      <FaceButton
        profile={matchSocial.profile}
        navigation={navigation}
        size={80}
        style={{ marginHorizontal: 10 }}
      />
      <View>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 18,
          }}
        >
          {matchSocial.profile.display_name ?? ''}
        </Text>
        <Text>
          {matchSocial.messages[matchSocial.messages.length - 1].text.length < 32
            ? matchSocial.messages[matchSocial.messages.length - 1].text
            : matchSocial.messages[matchSocial.messages.length - 1].text.substring(32)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
