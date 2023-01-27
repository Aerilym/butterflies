//Temporary component in use for tab bar

import React from 'react';
import { Ionicons } from '@expo/vector-icons';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default ({ icon, focused }: { icon: any; focused: boolean }) => {
  return (
    <Ionicons
      name={icon}
      style={{ marginBottom: -7 }}
      size={24}
      color={focused ? 'black' : 'rgb(143, 155, 179)'}
    />
  );
};
