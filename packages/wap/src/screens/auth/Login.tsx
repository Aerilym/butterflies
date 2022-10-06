import React from 'react';
import { KeyboardAvoidingView } from 'react-native';

import { SupabaseAuth } from '../../components/auth/SupabaseAuth';

export default function () {
  return (
    <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
      <SupabaseAuth />
    </KeyboardAvoidingView>
  );
}
