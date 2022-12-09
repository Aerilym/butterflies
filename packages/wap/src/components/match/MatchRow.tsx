import { TouchableOpacity } from 'react-native';
import { Text, Box } from 'native-base';
import { formatDistanceToNow } from 'date-fns';

import { MatchSocial } from '../../types/social';
import { FaceButton } from '../profile/FaceButton';

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
      <FaceButton
        key={matchSocial.match.match_id}
        navigation={navigation}
        profile={matchSocial.profile}
        size={69}
        style={{
          marginHorizontal: 10,
          marginVertical: 10,
        }}
      />

      <Box style={{ flexGrow: 0 }}>
        <Text
          style={{
            marginTop: 20,
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
      </Box>

      <Box
        style={{
          flexGrow: 1,
          display: 'flex',
          alignItems: 'flex-end',
          flexWrap: 'nowrap',
          overflow: 'hidden',
          marginTop: 20,
        }}
      >
        <Text>
          {formatDistanceToNow(
            new Date(matchSocial.messages[matchSocial.messages.length - 1].created_at),
            { addSuffix: true }
          )}
        </Text>
      </Box>
    </TouchableOpacity>
  );
}
