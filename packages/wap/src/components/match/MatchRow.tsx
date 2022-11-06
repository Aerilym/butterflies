import { formatDistanceToNow } from 'date-fns';
import { Avatar, Text, TouchableOpacity, View } from 'react-native-ui-lib';

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
      onPress={() => {
        navigation.navigate('Chat', {
          matchID: matchSocial.match.match_id,
          matchProfile: matchSocial.profile,
          messages: matchSocial.messages,
        });
      }}
      style={{
        display: 'flex',
        flexDirection: 'row',
      }}
      margin-s2
    >
      <Avatar
        source={{
          uri: matchSocial.profile?.avatar_url ?? 'https://i.redd.it/3hlhqoibf7471.jpg',
        }}
        size={80}
        onPress={() =>
          navigation.navigate('Profile', {
            profile: matchSocial.profile,
          })
        }
        containerStyle={{
          marginHorizontal: 10,
          flexGrow: 0,
        }}
      />

      <View style={{ flexGrow: 0 }}>
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

      <View
        style={{
          flexGrow: 1,
          display: 'flex',
          alignItems: 'flex-end',
          flexWrap: 'nowrap',
          overflow: 'hidden',
        }}
      >
        <Text>
          {formatDistanceToNow(
            new Date(matchSocial.messages[matchSocial.messages.length - 1].created_at),
            { addSuffix: true }
          )}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
