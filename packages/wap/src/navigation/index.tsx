import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';

import Main from './MainStack';
import Auth from './AuthStack';
import Loading from '../screens/utility/Loading';
import { AuthContext } from '../provider/AuthProvider';
import { Dimensions, Platform, View, StyleSheet } from 'react-native';

export default () => {
  const { hasAuth } = useContext(AuthContext);

  return (
    <View style={styles.mobBox}>
      <NavigationContainer>
        {hasAuth == null && <Loading />}
        {hasAuth == false && <Auth />}
        {hasAuth == true && <Main />}
      </NavigationContainer>
    </View>
  );
};

const ScreenHeight = Dimensions.get('window').height;
const ScreenWidth = Dimensions.get('window').width;
const isWeb = Platform.OS === 'web';
const paddingOffset = 7;
const innerPadding = 4;

const styles = StyleSheet.create({
  mobBox: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
    borderWidth: isWeb ? 4 : undefined,
    borderStyle: isWeb ? 'solid' : undefined,
    borderColor: isWeb ? 'rgb(71, 77, 80)' : undefined,
    borderRadius: isWeb ? 6 : undefined,
    width: isWeb ? ScreenHeight / 1.7 + (innerPadding + innerPadding + paddingOffset) : ScreenWidth,
    paddingLeft: isWeb ? innerPadding : undefined,
    paddingRight: isWeb ? innerPadding + paddingOffset : undefined,
  },
});
