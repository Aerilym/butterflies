import { Provider } from '@supabase/supabase-js';
import { supabase } from '../../provider/AuthProvider';
import { TouchableOpacity, Text, Image } from 'react-native';

export function AuthButton({ provider, icon }: { provider: Provider; icon: any }) {
  const handleLogin = async (provider: Provider) => {
    const { data, error } = await supabase.auth.signInWithOAuth({ provider });
  };

  return (
    <TouchableOpacity
      key={provider}
      onPress={() => handleLogin(provider)}
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
