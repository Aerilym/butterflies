import { ImageBackground } from 'react-native';
import { Card, Text, View } from 'react-native-ui-lib';

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
    <Card
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
      }}
      enableShadow={true}
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
        <View
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
        </View>
      </ImageBackground>
    </Card>
  );
}
