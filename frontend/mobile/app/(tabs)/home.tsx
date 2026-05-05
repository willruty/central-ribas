import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';

type FeatureCardProps = {
  icon: React.ComponentProps<typeof FontAwesome>['name'];
  title: string;
  description: string;
  onPress?: () => void;
  disabled?: boolean;
};

function FeatureCard({ icon, title, description, onPress, disabled }: FeatureCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={disabled ? 1 : 0.8}
      onPress={onPress}
      disabled={disabled}
      className="flex-row items-center border-[3px] border-black rounded-xl shadow-[4px_4px_0px_0px_#000000] mb-4 bg-white overflow-hidden"
    >
      {/* Ícone lateral */}
      <View className="bg-[#08233e] w-16 h-full items-center justify-center py-5">
        <FontAwesome name={icon} size={26} color="#ffd100" />
      </View>

      {/* Conteúdo */}
      <View className="flex-1 px-4 py-4">
        <Text className="text-base font-black text-black uppercase tracking-tight mb-1">
          {title}
        </Text>
        <Text className="text-xs font-bold text-[#666] leading-4">
          {description}
        </Text>
      </View>

      {/* Seta */}
      <View className="pr-4">
        <FontAwesome name="chevron-right" size={14} color="#000" />
      </View>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const handleScanQR = () => {
    Alert.alert('QR Code', 'Funcionalidade de scanner de QR Code em breve!');
  };

  const handleSearchDocuments = () => {
    router.navigate('/(tabs)/search');
  };

  const handleViewProfile = () => {
    router.navigate('/(tabs)/profile');
  };

  return (
    <ScrollView className="flex-1 bg-[#f8f8f8]">
      {/* Banner de boas-vindas */}
      <View className="bg-[#08233e] px-6 pt-8 pb-10 border-b-[3px] border-black">
        <Text className="text-xs font-black text-[#ffd100] uppercase tracking-widest mb-1">
          Bem-vindo
        </Text>
        <Text className="text-3xl font-black text-white uppercase leading-9">
          O que{'\n'}deseja fazer?
        </Text>
      </View>

      {/* Cards de funcionalidades */}
      <View className="px-5 pt-6 pb-4">

        <FeatureCard
          icon="qrcode"
          title="Escanear Equipamento"
          description="Leia o QR Code de um equipamento para acessar informações e registros."
          onPress={handleScanQR}
        />

        <FeatureCard
          icon="search"
          title="Buscar Documentos"
          description="Busque e visualize todos os seus documentos pessoais e de equipamentos."
          onPress={handleSearchDocuments}
        />

        <FeatureCard
          icon="user"
          title="Meu Perfil"
          description="Veja suas informações pessoais, documentos e dados da conta."
          onPress={handleViewProfile}
        />

      </View>

      {/* Section de Status */}
      <View className="px-5 pt-4 pb-4">
        <Text className="text-sm font-black text-black uppercase tracking-wide mb-4">
          Status de Documentos
        </Text>

        <View className="border-[3px] border-black rounded-xl bg-white shadow-[4px_4px_0px_0px_#000000] p-4 mb-4">
          <View className="flex-row items-center mb-3">
            <View className="bg-[#22C55E] w-3 h-3 rounded-full mr-2" />
            <Text className="text-sm font-bold text-black uppercase">
              3 documentos válidos
            </Text>
          </View>
          <View className="w-full bg-[#e5e5e5] h-2 rounded-full overflow-hidden">
            <View className="bg-[#22C55E] h-full" style={{ width: '75%' }} />
          </View>
        </View>

        <View className="border-[3px] border-black rounded-xl bg-white shadow-[4px_4px_0px_0px_#000000] p-4 mb-4">
          <View className="flex-row items-center mb-3">
            <View className="bg-[#F59E0B] w-3 h-3 rounded-full mr-2" />
            <Text className="text-sm font-bold text-black uppercase">
              1 documento próximo do vencimento
            </Text>
          </View>
          <View className="w-full bg-[#e5e5e5] h-2 rounded-full overflow-hidden">
            <View className="bg-[#F59E0B] h-full" style={{ width: '25%' }} />
          </View>
        </View>

        <View className="border-[3px] border-black rounded-xl bg-white shadow-[4px_4px_0px_0px_#000000] p-4">
          <View className="flex-row items-center mb-3">
            <View className="bg-[#EF4444] w-3 h-3 rounded-full mr-2" />
            <Text className="text-sm font-bold text-black uppercase">
              0 documentos vencidos
            </Text>
          </View>
          <View className="w-full bg-[#e5e5e5] h-2 rounded-full overflow-hidden">
            <View className="bg-[#EF4444] h-full" style={{ width: '0%' }} />
          </View>
        </View>
      </View>

      <View className="h-6" />
    </ScrollView>
  );
}
