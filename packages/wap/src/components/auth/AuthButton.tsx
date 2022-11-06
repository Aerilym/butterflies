import { View, Icon, Text, TouchableOpacity } from 'react-native-ui-lib';

import { supabaseAPI } from '../../provider/AuthProvider';

import type { Provider } from '@supabase/supabase-js';
import type { ImageSourcePropType } from 'react-native';

export function AuthButton({ provider, icon }: { provider: Provider; icon: ImageSourcePropType }) {
  return (
    <TouchableOpacity
      key={provider}
      onPress={() => supabaseAPI.login(provider)}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        backgroundColor: '#ffffff',
        borderColor: '#17171E',
        borderRadius: 40,
        padding: 6,
        margin: 8,
        width: '100%',
        maxWidth: 250,
      }}
    >
      <View
        style={{
          marginVertical: 8,
          marginHorizontal: 8,
          width: 40,
          height: 40,
        }}
      >
        <Icon source={icon} />
      </View>
      <Text style={{ color: '#17171E', fontWeight: 'bold' }}>
        Login with {provider.charAt(0).toUpperCase() + provider.slice(1)}
      </Text>
    </TouchableOpacity>
  );
}
