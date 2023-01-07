import { Box, Text, Button } from 'native-base';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { formatDistanceToNow } from 'date-fns';

import type { MainStackParamList } from '../../types/navigation';
import { userStore } from '../../provider/AuthProvider';

export default function ({ navigation }: NativeStackScreenProps<MainStackParamList, 'Settings'>) {
  return (
    <Box
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ textAlign: 'center' }}>Change Settings Here</Text>
      <Button
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Text>Return</Text>
      </Button>
      <Button
        onPress={async () => {
          await userStore.refreshLocationData();
        }}
      >
        Refresh Location Data
      </Button>
      {userStore.locationData ? (
        <Box>
          <Text>-----RAW LOCATION DATA-----</Text>
          <Text>
            {userStore.locationData.coords.latitude}, {userStore.locationData.coords.longitude}
          </Text>

          <Text>Last Updated: {formatDistanceToNow(userStore.locationData.timestamp)}</Text>

          <Text>Accuracy: {userStore.locationData.coords.accuracy}m</Text>

          <Text>Altitude: {userStore.locationData.coords.altitude}</Text>

          <Text>Altitude Accuracy: {userStore.locationData.coords.altitudeAccuracy}</Text>

          <Text>Heading: {userStore.locationData.coords.heading}</Text>

          <Text>Speed: {userStore.locationData.coords.speed}</Text>

          <Text>Mocked: {userStore.locationData.mocked ? 'Yes' : 'No'}</Text>

          <Text>-----GOOGLE GEOCODE DATA-----</Text>

          <Text>Name: {userStore.locationData.name}</Text>

          <Text>Post Code: {userStore.locationData.postalCode}</Text>

          <Text>ISO county code: {userStore.locationData.isoCountryCode}</Text>

          <Text>Timezone (IOS Only): {userStore.locationData.timezone}</Text>

          <Text>
            Address:
            {[
              userStore.locationData.streetNumber + ' ' + userStore.locationData.street,
              userStore.locationData.district,
              userStore.locationData.city,
              userStore.locationData.subregion,
              userStore.locationData.region,
              userStore.locationData.country,
            ]
              .map((line) => line?.replaceAll('undefined', ''))
              .filter((line) => line)
              .filter((line) => line !== ' ')
              .join(', ')}
          </Text>
        </Box>
      ) : null}
    </Box>
  );
}
