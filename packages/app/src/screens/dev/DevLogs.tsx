import { Button, ScrollView } from 'native-base';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { MainStackParamList } from '../../types/navigation';
import { supabaseAPI } from '../../provider/AuthProvider';
import FileBrowser from '../../components/utility/FileBrowser';

export default function ({ navigation }: NativeStackScreenProps<MainStackParamList, 'DevLogs'>) {
  return (
    <ScrollView
      style={{
        flex: 1,
      }}
    >
      <Button
        onPress={async () => {
          await supabaseAPI.uploadLogFiles();
        }}
      >
        Upload Logs
      </Button>
      <FileBrowser allowNameSearch />
    </ScrollView>
  );
}
