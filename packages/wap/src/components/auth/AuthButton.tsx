import { Provider, Session } from '@supabase/supabase-js';
import { supabase } from '../../provider/AuthProvider';
import { TouchableOpacity, Text, Image, Platform } from 'react-native';
import { startAsync, makeRedirectUri } from 'expo-auth-session';

export function AuthButton({ provider, icon }: { provider: Provider; icon: any }) {
  async function handleLogin(provider: Provider) {
    if (Platform.OS === 'web') {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: 'http://localhost:19006' },
      });
      if (error) {
        console.log(error);
      }
      console.log(data);
      return;
    }

    const returnUrl = makeRedirectUri({ useProxy: false });
    const authUrl = `https://btueksreggheiyvqbbdx.supabase.co/auth/v1/authorize?provider=${provider}&redirect_to=${returnUrl}`;
    const response = await startAsync({ authUrl, returnUrl });

    if (response.type !== 'success') {
      return;
    }

    if (!response.params?.refresh_token) {
      return;
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: 'exp://192.168.1.131:19000',  },
    });
    if (error) {
      console.log(error);
    }
    console.log(data);
    return;
  }

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
