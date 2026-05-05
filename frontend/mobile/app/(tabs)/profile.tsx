import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
import { UserProfile } from '@/services/profileService';

export default function ProfileScreen() {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Mock data - será substituído por dados reais da API
  useEffect(() => {
    setProfile({
      id: '1',
      email: 'joao.silva@email.com',
      name: 'João Silva Santos',
      role: 'Operador de Guindaste',
      department: 'Operações',
      phone: '(11) 99999-9999',
      createdAt: '2023-01-15',
    });
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair da sua conta?',
      [
        { text: 'Cancelar', onPress: () => {}, style: 'cancel' },
        {
          text: 'Sair',
          onPress: () => {
            router.replace('/auth');
          },
          style: 'destructive',
        },
      ]
    );
  };

  if (!profile) {
    return (
      <View className="flex-1 items-center justify-center bg-[#f8f8f8]">
        <ActivityIndicator color="#08233e" size="large" />
      </View>
    );
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
            <FontAwesome name="user" size={48} color="#ffd100" />
          </View>
          <Text className="text-2xl font-black text-black uppercase mt-4 text-center">
            {profile.name}
          </Text>
          <Text className="text-xs font-bold text-[#666] uppercase mt-1">
            {profile.role}
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
            value={profile.email}
          />

          <InfoCard
            icon="building"
            label="Departamento"
            value={profile.department || 'N/A'}
          />

          <InfoCard
            icon="phone"
            label="Telefone"
            value={profile.phone || 'N/A'}
          />

          <InfoCard
            icon="calendar"
            label="Membro desde"
            value={new Date(profile.createdAt).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })}
          />
        </View>

        {/* Documents Section */}
        <View className="mb-8">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-sm font-black text-black uppercase tracking-wide">
              Documentos Pessoais
            </Text>
            <TouchableOpacity className="bg-[#08233e] px-3 py-1 rounded-lg border-[2px] border-black">
              <Text className="text-xs font-black text-[#ffd100] uppercase">
                Ver todos
              </Text>
            </TouchableOpacity>
          </View>

          {/* Mock document list */}
          <View className="border-[3px] border-black rounded-xl bg-white shadow-[4px_4px_0px_0px_#000000] overflow-hidden mb-4">
            <View className="bg-[#22C55E] h-1" />
            <View className="p-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                  <FontAwesome name="id-card" size={18} color="#08233e" />
                  <Text className="text-sm font-black text-black uppercase ml-3">
                    Carteira de Habilitação
                  </Text>
                </View>
                <View className="bg-[#22C55E] px-3 py-1 rounded-lg">
                  <Text className="text-xs font-black text-white uppercase">
                    Válido
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View className="border-[3px] border-black rounded-xl bg-white shadow-[4px_4px_0px_0px_#000000] overflow-hidden mb-4">
            <View className="bg-[#F59E0B] h-1" />
            <View className="p-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                  <FontAwesome name="id-card" size={18} color="#08233e" />
                  <Text className="text-sm font-black text-black uppercase ml-3">
                    CPF
                  </Text>
                </View>
                <View className="bg-[#F59E0B] px-3 py-1 rounded-lg">
                  <Text className="text-xs font-black text-white uppercase">
                    Próximo
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="gap-3 mb-8">
          <TouchableOpacity
            activeOpacity={0.8}
            className="bg-[#08233e] border-[3px] border-black py-4 px-6 rounded-xl shadow-[4px_4px_0px_0px_#000000]"
          >
            <View className="flex-row items-center justify-center">
              <FontAwesome name="edit" size={18} color="#ffd100" />
              <Text className="text-[#ffd100] text-center text-base font-black uppercase ml-2 tracking-widest">
                Editar Perfil
              </Text>
            </View>
          </TouchableOpacity>

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
