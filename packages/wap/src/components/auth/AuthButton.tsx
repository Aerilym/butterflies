import type { Provider } from '@supabase/supabase-js';
import { TouchableOpacity, Text, Image, ImageSourcePropType } from 'react-native';

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
        padding: 6,
        margin: 8,
        width: '100%',
        maxWidth: 250,
      }}
    >
      <Image
        resizeMode="contain"
        style={{
          margin: 8,
          marginRight: 20,
          height: 32,
          width: 32,
        }}
        source={icon}
      />
      <Text style={{ color: '#17171E', fontWeight: 'bold' }}>
        Login with {provider.charAt(0).toUpperCase() + provider.slice(1)}
      </Text>
    </TouchableOpacity>
  );
}
