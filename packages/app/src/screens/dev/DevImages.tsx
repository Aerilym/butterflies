import { ScrollView } from 'native-base';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { MainStackParamList } from '../../types/navigation';
import ImagePicker from '../../components/utility/ImagePicker';

export default function ({ navigation }: NativeStackScreenProps<MainStackParamList, 'DevImages'>) {
  return (
    <ScrollView
      style={{
        flex: 1,
      }}
    >
      <ImagePicker />
    </ScrollView>
  );
}
