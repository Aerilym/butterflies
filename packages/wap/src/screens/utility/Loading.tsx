import { View } from 'react-native-ui-lib';
import { ActivityIndicator } from 'react-native';

export default function () {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <ActivityIndicator size="large" />
    </View>
  );
}
