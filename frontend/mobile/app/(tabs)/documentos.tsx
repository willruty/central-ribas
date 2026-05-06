import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useAuth } from '../../contexts/AuthContext';
import { getDocumentosByFuncionario, Documento } from '../../services/documentosService';

type StatusFilter = 'todos' | 'vencidos' | 'vencendo' | 'validos';

const TIPO_LABEL: Record<Documento['tipo'], string> = {
  cnh:         'CNH',
  aso:         'ASO',
  certificado: 'Certificado',
  art:         'ART',
  laudo:       'Laudo',
  contrato:    'Contrato',
  nota_fiscal: 'Nota Fiscal',
  outro:       'Documento',
};

function getDocStatus(validade?: string): 'vencido' | 'vencendo' | 'valido' {
  if (!validade) return 'valido';
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const val = new Date(validade);
  val.setHours(0, 0, 0, 0);
  if (val < hoje) return 'vencido';
  const limite = new Date(hoje);
  limite.setDate(limite.getDate() + 30);
  if (val <= limite) return 'vencendo';
  return 'valido';
}

function diasParaVencer(validade?: string): string {
  if (!validade) return 'Sem validade';
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const val = new Date(validade);
  val.setHours(0, 0, 0, 0);
  const diff = Math.round((val.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return `Vencido há ${Math.abs(diff)} dias`;
  if (diff === 0) return 'Vence hoje';
  return `Vence em ${diff} dias`;
}

const STATUS_CONFIG = {
  vencido:  { bg: '#EF4444', label: 'Vencido',  bar: '#EF4444' },
  vencendo: { bg: '#F59E0B', label: 'Atenção',  bar: '#F59E0B' },
  valido:   { bg: '#22C55E', label: 'Válido',   bar: '#22C55E' },
};

const FILTERS: { key: StatusFilter; label: string }[] = [
  { key: 'todos',    label: 'Todos'    },
  { key: 'vencidos', label: 'Vencidos' },
  { key: 'vencendo', label: 'Vencendo' },
  { key: 'validos',  label: 'Válidos'  },
];

export default function DocumentosScreen() {
  const { token, funcionario } = useAuth();
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<StatusFilter>('todos');

  useEffect(() => {
    if (!token || !funcionario?.id) return;

    async function load() {
      setLoading(true);
      const { data } = await getDocumentosByFuncionario(funcionario!.id, token!);
      setDocumentos(data ?? []);
      setLoading(false);
    }

    load();
  }, [token, funcionario?.id]);

  const filtered = documentos.filter((doc) => {
    if (filtro === 'todos') return true;
    const s = getDocStatus(doc.validade);
    if (filtro === 'vencidos') return s === 'vencido';
    if (filtro === 'vencendo') return s === 'vencendo';
    if (filtro === 'validos')  return s === 'valido';
    return true;
  });

  return (
    <ScrollView className="flex-1 bg-[#f8f8f8]">
      {/* Header */}
      <View className="bg-[#08233e] px-6 pt-8 pb-10 border-b-[3px] border-black">
        <Text className="text-xs font-black text-[#ffd100] uppercase tracking-widest mb-1">
          Meus
        </Text>
        <Text className="text-3xl font-black text-white uppercase leading-9">
          Documentos
        </Text>
      </View>

      <View className="px-5 pt-6 pb-4">
        {/* Chips de filtro */}
        <View className="flex-row gap-2 mb-6 flex-wrap">
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f.key}
              onPress={() => setFiltro(f.key)}
              className={`py-2 px-4 rounded-xl border-[2px] border-black ${
                filtro === f.key ? 'bg-[#08233e]' : 'bg-white'
              }`}
            >
              <Text
                className={`font-black text-xs uppercase ${
                  filtro === f.key ? 'text-[#ffd100]' : 'text-black'
                }`}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Conteúdo */}
        {loading ? (
          <View className="items-center justify-center py-12">
            <ActivityIndicator color="#08233e" size="large" />
            <Text className="text-sm font-bold text-[#666] mt-3 uppercase">Carregando…</Text>
          </View>
        ) : filtered.length === 0 ? (
          <View className="border-[3px] border-black rounded-xl bg-white p-8 items-center shadow-[4px_4px_0px_0px_#000000]">
            <FontAwesome name="folder-open" size={40} color="#ccc" />
            <Text className="text-sm font-bold text-[#999] mt-4 text-center uppercase">
              {filtro === 'todos'
                ? 'Nenhum documento cadastrado para o seu perfil.'
                : `Nenhum documento ${filtro === 'vencidos' ? 'vencido' : filtro === 'vencendo' ? 'vencendo' : 'válido'}.`}
            </Text>
          </View>
        ) : (
          filtered.map((doc) => {
            const s = getDocStatus(doc.validade);
            const cfg = STATUS_CONFIG[s];
            return (
              <View
                key={doc.id}
                className="border-[3px] border-black rounded-xl bg-white shadow-[4px_4px_0px_0px_#000000] mb-4 overflow-hidden"
              >
                {/* Barra colorida no topo */}
                <View style={{ backgroundColor: cfg.bar }} className="h-2" />

                <View className="p-4">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center flex-1 mr-2">
                      <FontAwesome name="file-text" size={18} color="#08233e" />
                      <View className="ml-3 flex-1">
                        <Text className="text-sm font-black text-black uppercase tracking-tight" numberOfLines={1}>
                          {doc.nome_arquivo}
                        </Text>
                        <Text className="text-xs font-bold text-[#666] mt-0.5">
                          {TIPO_LABEL[doc.tipo] ?? 'Documento'} · {diasParaVencer(doc.validade)}
                        </Text>
                      </View>
                    </View>
                    <View style={{ backgroundColor: cfg.bg }} className="px-3 py-1 rounded-lg">
                      <Text className="text-xs font-black text-white uppercase">
                        {cfg.label}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            );
          })
        )}
      </View>

      <View className="h-6" />
    </ScrollView>
  );
}
