import { TouchableOpacity, Image } from 'react-native-ui-lib';
import { StyleProp, ViewStyle } from 'react-native';

import { MatchSocial } from '../../types/social';

export function MatchCircle({
  navigation,
  matchSocial,
  size,
  style,
}: {
  // TODO: Add types for navigation and route
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navigation: any;
  matchSocial: MatchSocial;
  size: number;
  style?: StyleProp<ViewStyle>;
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
      style={style}
    >
      <Image
        style={{ width: size, height: size, borderRadius: size, backgroundColor: 'gray' }}
        source={{ uri: matchSocial.profile.avatar_url ?? 'https://i.redd.it/3hlhqoibf7471.jpg' }}
      />
    </TouchableOpacity>
  );
}
