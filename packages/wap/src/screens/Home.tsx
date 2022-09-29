import React from 'react';
import { View, Linking } from 'react-native';
import { MainStackParamList } from '../types/navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  Layout,
  Button,
  Text,
  TopNav,
  Section,
  SectionContent,
  useTheme,
  themeColor,
} from 'react-native-rapi-ui';
import { Ionicons } from '@expo/vector-icons';

export default function ({ navigation }: NativeStackScreenProps<MainStackParamList, 'MainTabs'>) {
  const { isDarkmode, setTheme } = useTheme();
  return (
    <Layout>
      <TopNav
        middleContent="Home"
        rightContent={<Ionicons name={'filter'} style={{ marginBottom: -7 }} size={24} />}
        rightAction={() => {
          navigation.navigate('Filters');
        }}
      />
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Section style={{ marginTop: 20 }}>
          <SectionContent>
            <Text fontWeight="bold" style={{ textAlign: 'center' }}>
              No profiles match your filters, try expanding them!
            </Text>
            <Button
              text="Expand filters"
              onPress={() => {
                navigation.navigate('Filters');
              }}
              style={{
                marginTop: 10,
              }}
            />
          </SectionContent>
        </Section>
      </View>
    </Layout>
  );
}
