import { TouchableOpacity, Image, StyleProp, ViewStyle } from 'react-native';

import { Profile } from '../../types/database';

export function FaceButton({
  navigation,
  profile,
  size,
  style,
}: {
  // TODO: Add types for navigation and route
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navigation: any;
  profile: Profile;
  size: number;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Profile', {
          profile,
        });
      }}
      style={style}
    >
      <Image
        style={{ width: size, height: size, borderRadius: size, backgroundColor: 'gray' }}
        source={{ uri: profile?.avatar_url ?? 'https://i.redd.it/3hlhqoibf7471.jpg' }}
      />
    </TouchableOpacity>
  );
}
