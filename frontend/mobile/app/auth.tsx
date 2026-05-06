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
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';

export default function AuthScreen() {
  const { login } = useAuth();
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
      className="flex-1 bg-[#08233e]"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Branding area — topo escuro como o painel esquerdo do web */}
        <View className="px-8 pt-16 pb-10 items-start">
          <Text className="text-[10px] font-bold text-blue-300/80 uppercase tracking-[0.22em] mb-3">
            Sistema de Gestão · 2026
          </Text>
          <Text className="text-4xl font-black text-white leading-tight tracking-tight">
            Guindastes{'\n'}Ribas
          </Text>
          <Text className="text-sm text-white/50 mt-3 leading-relaxed">
            Gestão completa da sua frota e documentos críticos.
          </Text>
        </View>

        {/* Formulário — card branco flutuando sobre o fundo navy */}
        <View className="bg-white rounded-t-3xl px-7 pt-8 pb-10">
          <Text className="text-2xl font-black text-[#0f1c33] tracking-tight mb-1">
            Acesse sua conta
          </Text>
          <Text className="text-sm text-[#64748b] mb-8">
            Entre com suas credenciais para continuar.
          </Text>

          {/* Campo Email */}
          <View className="mb-5">
            <Text className="text-[11px] font-bold text-[#64748b] uppercase tracking-widest mb-2">
              E-mail
            </Text>
            <View className="flex-row items-center bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 h-12">
              <FontAwesome name="envelope" size={14} color="#94a3b8" />
              <TextInput
                className="flex-1 text-[#0f1c33] ml-3 text-sm"
                placeholder="seu@email.com"
                placeholderTextColor="#94a3b8"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
                editable={!loading}
              />
            </View>
          </View>

          {/* Campo Senha */}
          <View className="mb-6">
            <Text className="text-[11px] font-bold text-[#64748b] uppercase tracking-widest mb-2">
              Senha
            </Text>
            <View className="flex-row items-center bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 h-12">
              <FontAwesome name="lock" size={14} color="#94a3b8" />
              <TextInput
                className="flex-1 text-[#0f1c33] ml-3 text-sm"
                placeholder="••••••••"
                placeholderTextColor="#94a3b8"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                editable={!loading}
              />
            </View>
          </View>

          {/* Mensagem de erro */}
          {error !== '' && (
            <View className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5 flex-row items-start gap-2">
              <FontAwesome name="exclamation-circle" size={14} color="#dc2626" style={{ marginTop: 2 }} />
              <Text className="text-[#dc2626] text-sm flex-1 ml-2">
                {error}
              </Text>
            </View>
          )}

          {/* Botão de login */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleLogin}
            disabled={loading}
            className="bg-[#08233e] py-4 px-8 rounded-xl"
            style={{
              shadowColor: '#08233e',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <View className="flex-row items-center justify-center">
                <Text className="text-white text-center text-[15px] font-bold tracking-wide">
                  Entrar no painel
                </Text>
                <FontAwesome name="arrow-right" size={14} color="#fff" style={{ marginLeft: 8 }} />
              </View>
            )}
          </TouchableOpacity>

          <Text className="text-xs text-[#94a3b8] text-center mt-6">
            Problemas para acessar? Fale com o suporte.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
