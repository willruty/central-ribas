import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { getDocumentos, getDocumentosVencidos, getDocumentosProximoVencimento } from '../../services/documentosService';
import { getEquipamentos, Equipamento } from '../../services/equipamentosService';

type StatusData = {
  vencidos: number;
  vencendo: number;
  emDia: number;
};

const EQUIP_STATUS: Record<Equipamento['status'], { label: string; color: string; bg: string }> = {
  disponivel:    { label: 'Disponível',  color: '#16a34a', bg: '#f0fdf4' },
  locado:        { label: 'Locado',      color: '#2563eb', bg: '#eff6ff' },
  em_manutencao: { label: 'Manutenção',  color: '#d97706', bg: '#fffbeb' },
  inativo:       { label: 'Inativo',     color: '#64748b', bg: '#f1f5f9' },
};

function todayLabel() {
  return new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function HomeScreen() {
  const { token, funcionario } = useAuth();
  const [status, setStatus] = useState<StatusData | null>(null);
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    async function load() {
      setLoading(true);
      const [vencidosRes, vencendoRes, todosRes, equipRes] = await Promise.all([
        getDocumentosVencidos(token!),
        getDocumentosProximoVencimento(30, token!),
        getDocumentos(token!),
        getEquipamentos(token!, 0, 3),
      ]);

      const vencidos = vencidosRes.data?.length ?? 0;
      const vencendo = vencendoRes.data?.length ?? 0;
      const total = todosRes.data?.length ?? 0;

      setStatus({ vencidos, vencendo, emDia: Math.max(0, total - vencidos - vencendo) });
      setEquipamentos(equipRes.data ?? []);
      setLoading(false);
    }

    load();
  }, [token]);

  const primeiroNome = funcionario?.nome?.split(' ')[0] ?? 'Usuário';

  return (
    <ScrollView className="flex-1 bg-[#f8fafc]">
      {/* Banner de boas-vindas — fundo navy com gradiente sutil */}
      <View
        className="px-6 pt-8 pb-10"
        style={{ backgroundColor: '#08233e' }}
      >
        <Text className="text-[10px] font-bold text-blue-300/80 uppercase tracking-[0.2em] mb-2">
          Bem-vindo de volta
        </Text>
        <Text className="text-3xl font-black text-white leading-tight tracking-tight">
          Bom dia,{'\n'}{primeiroNome}
        </Text>
        <Text className="text-xs text-white/40 mt-2 capitalize">
          {todayLabel()}
        </Text>
      </View>

      {/* Cards de status — gradiente colorido como as StatCards do web */}
      <View className="px-5 pt-5 pb-2">
        <Text className="text-[10px] font-black text-[#64748b] uppercase tracking-[0.18em] mb-4">
          Status de Documentos
        </Text>

        <View className="flex-row gap-3 mb-3">
          {/* Vencidos */}
          <View
            className="flex-1 rounded-2xl p-4 overflow-hidden"
            style={{
              backgroundColor: '#dc2626',
              shadowColor: '#dc2626',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.25,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <View className="flex-row items-center justify-between mb-2">
              <FontAwesome name="exclamation-circle" size={14} color="rgba(255,255,255,0.7)" />
              <Text className="text-[9px] font-bold text-white/60 uppercase tracking-wider">urgente</Text>
            </View>
            <Text className="text-3xl font-black text-white leading-none mb-0.5">
              {loading ? '—' : status?.vencidos ?? 0}
            </Text>
            <Text className="text-[11px] text-white/70">Vencidos</Text>
          </View>

          {/* Vencendo */}
          <View
            className="flex-1 rounded-2xl p-4 overflow-hidden"
            style={{
              backgroundColor: '#d97706',
              shadowColor: '#d97706',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.25,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <View className="flex-row items-center justify-between mb-2">
              <FontAwesome name="clock-o" size={14} color="rgba(255,255,255,0.7)" />
              <Text className="text-[9px] font-bold text-white/60 uppercase tracking-wider">30 dias</Text>
            </View>
            <Text className="text-3xl font-black text-white leading-none mb-0.5">
              {loading ? '—' : status?.vencendo ?? 0}
            </Text>
            <Text className="text-[11px] text-white/70">Vencendo</Text>
          </View>

          {/* Em dia */}
          <View
            className="flex-1 rounded-2xl p-4 overflow-hidden"
            style={{
              backgroundColor: '#16a34a',
              shadowColor: '#16a34a',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.25,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <View className="flex-row items-center justify-between mb-2">
              <FontAwesome name="check-circle" size={14} color="rgba(255,255,255,0.7)" />
              <Text className="text-[9px] font-bold text-white/60 uppercase tracking-wider">ok</Text>
            </View>
            <Text className="text-3xl font-black text-white leading-none mb-0.5">
              {loading ? '—' : status?.emDia ?? 0}
            </Text>
            <Text className="text-[11px] text-white/70">Em dia</Text>
          </View>
        </View>
      </View>

      {/* Botão Ver documentos */}
      <View className="px-5 mb-6">
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.navigate('/(tabs)/documentos' as any)}
          className="bg-[#08233e] py-4 px-6 rounded-xl flex-row items-center justify-center"
          style={{
            shadowColor: '#08233e',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <FontAwesome name="file-text" size={16} color="#fff" />
          <Text className="text-white text-[15px] font-bold ml-2.5 tracking-wide">
            Ver meus documentos
          </Text>
        </TouchableOpacity>
      </View>

      {/* Seção Frota */}
      <View className="px-5 pb-8">
        <Text className="text-[10px] font-black text-[#64748b] uppercase tracking-[0.18em] mb-4">
          Frota
        </Text>

        {loading ? (
          <View className="items-center py-8">
            <ActivityIndicator color="#08233e" size="large" />
          </View>
        ) : equipamentos.length === 0 ? (
          <View
            className="bg-white border border-[#e2e8f0] rounded-2xl p-6 items-center"
            style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 }}
          >
            <FontAwesome name="truck" size={32} color="#cbd5e1" />
            <Text className="text-sm font-semibold text-[#94a3b8] mt-3 text-center">
              Nenhum equipamento cadastrado
            </Text>
          </View>
        ) : (
          equipamentos.map((eq) => {
            const badge = EQUIP_STATUS[eq.status] ?? EQUIP_STATUS.inativo;
            return (
              <View
                key={eq.id}
                className="bg-white border border-[#e2e8f0] rounded-2xl mb-3 overflow-hidden"
                style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 }}
              >
                <View className="flex-row items-center p-4">
                  <View
                    className="w-11 h-11 items-center justify-center rounded-xl mr-3"
                    style={{ backgroundColor: '#08233e' }}
                  >
                    <FontAwesome name="truck" size={18} color="#fff" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-bold text-[#0f1c33] tracking-tight" numberOfLines={1}>
                      {eq.nome}
                    </Text>
                    {eq.modelo ? (
                      <Text className="text-xs text-[#64748b] mt-0.5">{eq.modelo}</Text>
                    ) : null}
                  </View>
                  <View
                    className="px-2.5 py-1 rounded-lg ml-2"
                    style={{ backgroundColor: badge.bg }}
                  >
                    <Text className="text-xs font-semibold" style={{ color: badge.color }}>
                      {badge.label}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}
