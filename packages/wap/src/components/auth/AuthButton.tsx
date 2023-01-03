import { TouchableOpacity, ImageSourcePropType } from 'react-native';
import { Image, Text } from 'native-base';
import type { Provider } from '@supabase/supabase-js';

import { supabaseAPI } from '../../provider/AuthProvider';

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
        paddingVertical: 6,
        paddingHorizontal: 50,
        margin: 8,
        width: '100%',
        maxWidth: 300,
      }}
    >
      <Image
        alt={provider + ' icon'}
        size={5}
        source={icon}
        style={{
          marginVertical: 8,
          marginHorizontal: 10,
        }}
      />
      <Text style={{ color: '#17171E', fontWeight: 'bold' }}>
        Continue with {provider.charAt(0).toUpperCase() + provider.slice(1)}
      </Text>
    </TouchableOpacity>
  );
}
