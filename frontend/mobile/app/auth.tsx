import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { login } from '../services/authService';

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin() {
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Preencha o email e a senha para continuar.');
      return;
    }

    setLoading(true);
    const result = await login(email.trim(), password);
    setLoading(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    router.replace('/(tabs)/home');
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#ffd100]"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="px-6">
          {/* Card principal */}
          <View className="bg-white border-[3px] border-black p-8 rounded-2xl shadow-[6px_6px_0px_0px_#000000] w-full">

            {/* Logo / Título */}
            <View className="items-center mb-8">
              <Text className="text-4xl font-black text-black uppercase tracking-tighter">
                Guindastes
              </Text>
              <Text className="text-xl font-bold text-[#08233e] uppercase">
                Ribas
              </Text>
            </View>

            {/* Campo Email */}
            <View className="mb-4">
              <Text className="text-sm font-black text-black uppercase tracking-wide mb-2">
                Email
              </Text>
              <TextInput
                className="border-[3px] border-black rounded-xl px-4 py-3 text-base text-black bg-[#f8f8f8]"
                placeholder="seu@email.com"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
                editable={!loading}
              />
            </View>

            {/* Campo Senha */}
            <View className="mb-6">
              <Text className="text-sm font-black text-black uppercase tracking-wide mb-2">
                Senha
              </Text>
              <TextInput
                className="border-[3px] border-black rounded-xl px-4 py-3 text-base text-black bg-[#f8f8f8]"
                placeholder="••••••••"
                placeholderTextColor="#999"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                editable={!loading}
              />
            </View>

            {/* Mensagem de erro */}
            {error !== '' && (
              <View className="bg-[#FF3B3B] border-[2px] border-black rounded-xl px-4 py-3 mb-5">
                <Text className="text-white font-black text-sm text-center">
                  {error}
                </Text>
              </View>
            )}

            {/* Botão de login */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleLogin}
              disabled={loading}
              className="bg-[#08233e] border-[3px] border-black py-4 px-8 rounded-xl shadow-[4px_4px_0px_0px_#000000]"
            >
              {loading ? (
                <ActivityIndicator color="#ffd100" />
              ) : (
                <Text className="text-[#ffd100] text-center text-lg font-black uppercase tracking-widest">
                  Entrar
                </Text>
              )}
            </TouchableOpacity>

          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
