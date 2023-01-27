import { ActivityIndicator } from 'react-native';
import { Box } from 'native-base';

export default function () {
  return (
    <Box
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <ActivityIndicator size="large" />
    </Box>
  );
}
