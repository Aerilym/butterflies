import React, { useContext } from 'react';
import { KeyboardAvoidingView } from 'react-native';
import { SupabaseAuth } from '../../components/auth/SupabaseAuth';
import { AuthContext } from '../../provider/AuthProvider';

export default function () {
  return (
    <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
      <SupabaseAuth />
    </KeyboardAvoidingView>
  );
}
