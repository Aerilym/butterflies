import { Box, Text, Image } from 'native-base';
import { SupabaseAuth } from '../../components/auth/SupabaseAuth';

export default function () {
  return (
    <Box
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginHorizontal: 10,
      }}
    >
      <Box>
        <Image
          alt={'everything is fine gif'}
          style={{
            width: 300,
            height: 400,
          }}
          source={{ uri: 'https://media.tenor.com/MYZgsN2TDJAAAAAC/this-is.gif' }}
        />
      </Box>
      <Box>
        <SupabaseAuth />
      </Box>
      <Box>
        <Text
          style={{
            color: '#17171E',
            textAlign: 'center',
            fontSize: 10,
            marginHorizontal: 20,
          }}
        >
          By signing up, you agree to our Terms of service. View our privacy policy to see how we
          use your data.
        </Text>
      </Box>
    </Box>
  );
}
