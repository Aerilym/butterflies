import { ImageBackground, TouchableOpacity } from 'react-native';
import { Box, Text } from 'native-base';

import { MatchQueueItem } from '../../types/social';

export function SwipeCard({
  navigation,
  matchQueueItem,
}: {
  // TODO: Add types for navigation and route
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navigation: any;
  matchQueueItem: MatchQueueItem;
}) {
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Profile', {
          profile: matchQueueItem.profile,
        });
      }}
      style={{
        marginVertical: 20,
        marginHorizontal: 20,
        flex: 1,
        borderRadius: 12,
        shadowRadius: 4,
        shadowOpacity: 0.2,
        shadowOffset: {
          width: 0,
          height: 2,
        },
      }}
    >
      <ImageBackground
        source={{ uri: matchQueueItem.profile.avatar_url }}
        resizeMode="cover"
        style={{
          flex: 1,
        }}
        imageStyle={{
          borderRadius: 12,
        }}
      >
        <Box
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            marginHorizontal: 20,
            marginVertical: 20,
          }}
        >
          <Text
            style={{
              fontWeight: 'bold',
              color: 'white',
              fontSize: 32,
            }}
          >
            {matchQueueItem.profile.display_name ?? ''}
          </Text>
          <Text
            style={{
              fontWeight: 'bold',
              color: 'white',
            }}
          >
            this is some bio info
          </Text>
        </Box>
      </ImageBackground>
    </TouchableOpacity>
  );
}
