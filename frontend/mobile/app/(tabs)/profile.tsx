import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const InfoCard = ({
  icon,
  label,
  value,
}: {
  icon: React.ComponentProps<typeof FontAwesome>['name'];
  label: string;
  value: string;
}) => (
  <View className="border-[3px] border-black rounded-xl bg-white mb-4 shadow-[4px_4px_0px_0px_#000000] p-4">
    <View className="flex-row items-center">
      <View className="bg-[#08233e] w-12 h-12 items-center justify-center rounded-xl mr-4">
        <FontAwesome name={icon} size={20} color="#ffd100" />
      </View>
      <View className="flex-1">
        <Text className="text-xs font-black text-[#999] uppercase tracking-wide mb-1">
          {label}
        </Text>
        <Text className="text-sm font-bold text-black">
          {value}
        </Text>
      </View>
    </View>
  </View>
);

export default function ProfileScreen() {
  const { userEmail, funcionario, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', onPress: logout, style: 'destructive' },
      ]
    );
  };

  if (!isAuthenticated || !funcionario) {
    return (
      <View className="flex-1 items-center justify-center bg-[#f8f8f8]">
        <ActivityIndicator color="#08233e" size="large" />
      </View>
    );
  }

  const initials = getInitials(funcionario.nome);

  return (
    <ScrollView className="flex-1 bg-[#f8f8f8]">
      {/* Header */}
      <View className="bg-[#08233e] px-6 pt-8 pb-10 border-b-[3px] border-black">
        <Text className="text-xs font-black text-[#ffd100] uppercase tracking-widest mb-1">
          Perfil
        </Text>
        <Text className="text-3xl font-black text-white uppercase leading-9">
          Minha Conta
        </Text>
      </View>

      <View className="px-5 pt-6 pb-4">
        {/* Avatar Section */}
        <View className="items-center mb-8">
          <View className="w-24 h-24 bg-[#08233e] rounded-full items-center justify-center border-[3px] border-black shadow-[4px_4px_0px_0px_#000000]">
            <Text className="text-3xl font-black text-[#ffd100]">{initials}</Text>
          </View>
          <Text className="text-2xl font-black text-black uppercase mt-4 text-center">
            {funcionario.nome}
          </Text>
          <Text className="text-xs font-bold text-[#666] uppercase mt-1">
            {funcionario.cargo}
          </Text>
        </View>

        {/* Info Cards */}
        <View className="mb-8">
          <Text className="text-sm font-black text-black uppercase tracking-wide mb-4">
            Informações Pessoais
          </Text>

          <InfoCard
            icon="envelope"
            label="Email"
            value={userEmail ?? funcionario.email ?? 'Não informado'}
          />

          <InfoCard
            icon="briefcase"
            label="Cargo"
            value={funcionario.cargo}
          />

          <InfoCard
            icon="id-card"
            label="CPF"
            value={funcionario.cpf ?? 'Não informado'}
          />

          <InfoCard
            icon="phone"
            label="Telefone"
            value={funcionario.celular ?? funcionario.telefone ?? 'Não informado'}
          />
        </View>

        {/* Documentos pessoais */}
        <View className="mb-8">
          <Text className="text-sm font-black text-black uppercase tracking-wide mb-4">
            Documentos Pessoais
          </Text>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.navigate('/(tabs)/documentos' as any)}
            className="border-[3px] border-black rounded-xl bg-white shadow-[4px_4px_0px_0px_#000000] p-4 flex-row items-center"
          >
            <View className="bg-[#08233e] w-12 h-12 items-center justify-center rounded-xl mr-4">
              <FontAwesome name="file-text" size={20} color="#ffd100" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-black text-black uppercase">
                Ver meus documentos
              </Text>
              <Text className="text-xs font-bold text-[#666] mt-0.5">
                CNH, ASO, certificados e mais
              </Text>
            </View>
            <FontAwesome name="chevron-right" size={14} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Botões de ação */}
        <View className="gap-3 mb-8">
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleLogout}
            className="bg-[#EF4444] border-[3px] border-black py-4 px-6 rounded-xl shadow-[4px_4px_0px_0px_#000000]"
          >
            <View className="flex-row items-center justify-center">
              <FontAwesome name="sign-out" size={18} color="#fff" />
              <Text className="text-white text-center text-base font-black uppercase ml-2 tracking-widest">
                Sair
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View className="h-6" />
    </ScrollView>
  );
}
