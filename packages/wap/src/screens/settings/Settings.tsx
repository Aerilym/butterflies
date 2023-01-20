import { Box, Text, Button } from 'native-base';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { formatDistanceToNow } from 'date-fns';

import type { MainStackParamList } from '../../types/navigation';
import { supabaseAPI, userStore } from '../../provider/AuthProvider';
import { earthDistance } from '../../helpers/location';
import { LocationObjectCoords } from 'expo-location';
import { useState } from 'react';
import { UserLocationData } from '../../api/location';

export default function ({ navigation }: NativeStackScreenProps<MainStackParamList, 'Settings'>) {
  const [location, setLocation] = useState<UserLocationData>(
    userStore.locationData ?? ({} as UserLocationData)
  );
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
          await supabaseAPI.uploadLogFiles();
        }}
      >
        Upload Logs
      </Button>
      <Button
        onPress={async () => {
          await userStore.refreshLocationData();
          if (userStore.locationData) {
            setLocation(userStore.locationData);
          }
        }}
      >
        Refresh Location Data
      </Button>
      {userStore.locationData && location ? (
        <Box>
          <Text>-----RAW LOCATION DATA-----</Text>
          <Text>
            {location.coords.latitude}, {location.coords.longitude}
          </Text>

          <Text>Last Updated: {formatDistanceToNow(location.timestamp)}</Text>

          <Text>Accuracy: {location.coords.accuracy}m</Text>

          <Text>Altitude: {location.coords.altitude}</Text>

          <Text>Altitude Accuracy: {location.coords.altitudeAccuracy}</Text>

          <Text>Heading: {location.coords.heading}</Text>

          <Text>Speed: {location.coords.speed}</Text>

          <Text>Mocked: {location.mocked ? 'Yes' : 'No'}</Text>

          <Text>-----GOOGLE GEOCODE DATA-----</Text>

          <Text>Name: {location.name}</Text>

          <Text>Post Code: {location.postalCode}</Text>

          <Text>ISO county code: {location.isoCountryCode}</Text>

          <Text>Timezone (IOS Only): {location.timezone}</Text>

          <Text>
            Address:
            {[
              location.streetNumber + ' ' + location.street,
              location.district,
              location.city,
              location.subregion,
              location.region,
              location.country,
            ]
              .map((line) => line?.replaceAll('undefined', ''))
              .filter((line) => line)
              .filter((line) => line !== ' ')
              .join(', ')}
          </Text>

          <Text>
            Distance from Yah Yahs:{' '}
            {Math.round(
              earthDistance(location.coords, {
                latitude: -37.80586505770181,
                longitude: 144.98296141840655,
              } as LocationObjectCoords)
            )}{' '}
            km
          </Text>
        </Box>
      ) : null}
    </Box>
  );
}
