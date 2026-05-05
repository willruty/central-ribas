import { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {
  Document,
  getDocumentStatus,
  getStatusColor,
  getStatusLabel,
  formatDate,
} from '@/services/documentService';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Mock data - será substituído por dados reais da API
  const mockDocuments: Document[] = [
    {
      id: '1',
      name: 'Carteira de Habilitação',
      type: 'personal',
      expiresAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
      issuedAt: '2022-01-15',
    },
    {
      id: '2',
      name: 'CPF',
      type: 'personal',
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      issuedAt: '2020-01-01',
    },
    {
      id: '3',
      name: 'Certidão de Antecedentes',
      type: 'personal',
      expiresAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      issuedAt: '2021-06-10',
    },
    {
      id: '4',
      name: 'Manual do Guindaste XYZ-500',
      type: 'equipment',
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      issuedAt: '2023-01-01',
    },
  ];

  const filteredDocuments = mockDocuments.filter((doc) => {
    const matchesSearch = doc.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType =
      selectedType === null ||
      (selectedType === 'personal' && doc.type === 'personal') ||
      (selectedType === 'equipment' && doc.type === 'equipment');
    return matchesSearch && matchesType;
  });

  const DocumentCard = ({ document }: { document: Document }) => {
    const [status, setStatus] = useState<'valid' | 'warning' | 'expired'>('valid');

    useEffect(() => {
      getDocumentStatus(document.expiresAt).then(setStatus);
    }, [document.expiresAt]);

    const statusColor = getStatusColor(status);
    const statusLabel = getStatusLabel(status);

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        className="border-[3px] border-black rounded-xl shadow-[4px_4px_0px_0px_#000000] mb-4 bg-white overflow-hidden"
      >
        {/* Header com cores de status */}
        <View style={{ backgroundColor: statusColor }} className="h-1" />

        <View className="p-4">
          {/* Tipo de documento */}
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center flex-1">
              <FontAwesome
                name={
                  document.type === 'personal' ? 'id-card' : 'file-text'
                }
                size={18}
                color="#08233e"
              />
              <Text className="text-xs font-black text-[#08233e] uppercase tracking-wide ml-2">
                {document.type === 'personal'
                  ? 'Pessoal'
                  : 'Equipamento'}
              </Text>
            </View>
            <View
              style={{ backgroundColor: statusColor }}
              className="px-3 py-1 rounded-lg"
            >
              <Text className="text-xs font-black text-white uppercase">
                {statusLabel}
              </Text>
            </View>
          </View>

          {/* Nome do documento */}
          <Text className="text-base font-black text-black uppercase tracking-tight mb-3">
            {document.name}
          </Text>

          {/* Data de vencimento */}
          <View className="flex-row items-center border-t-[2px] border-t-[#e5e5e5] pt-3">
            <FontAwesome name="calendar" size={14} color="#666" />
            <Text className="text-xs font-bold text-[#666] ml-2">
              Vence em {formatDate(document.expiresAt)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView className="flex-1 bg-[#f8f8f8]">
      {/* Header */}
      <View className="bg-[#08233e] px-6 pt-8 pb-10 border-b-[3px] border-black">
        <Text className="text-xs font-black text-[#ffd100] uppercase tracking-widest mb-1">
          Buscar
        </Text>
        <Text className="text-3xl font-black text-white uppercase leading-9">
          Documentos
        </Text>
      </View>

      <View className="px-5 pt-6 pb-4">
        {/* Search Bar */}
        <View className="mb-6">
          <Text className="text-sm font-black text-black uppercase tracking-wide mb-2">
            Buscar Documento
          </Text>
          <View className="border-[3px] border-black rounded-xl bg-white flex-row items-center px-4 shadow-[4px_4px_0px_0px_#000000]">
            <FontAwesome name="search" size={18} color="#666" />
            <TextInput
              className="flex-1 ml-3 py-3 text-base text-black"
              placeholder="Nome do documento..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery !== '' && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <FontAwesome name="times-circle" size={18} color="#999" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Filter Buttons */}
        <View className="mb-6">
          <Text className="text-sm font-black text-black uppercase tracking-wide mb-2">
            Filtrar por tipo
          </Text>
          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => setSelectedType(null)}
              className={`flex-1 py-3 px-4 rounded-xl border-[2px] border-black ${
                selectedType === null
                  ? 'bg-[#08233e]'
                  : 'bg-white'
              }`}
            >
              <Text
                className={`text-center font-black text-xs uppercase ${
                  selectedType === null
                    ? 'text-[#ffd100]'
                    : 'text-black'
                }`}
              >
                Todos
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setSelectedType('personal')}
              className={`flex-1 py-3 px-4 rounded-xl border-[2px] border-black ${
                selectedType === 'personal'
                  ? 'bg-[#08233e]'
                  : 'bg-white'
              }`}
            >
              <Text
                className={`text-center font-black text-xs uppercase ${
                  selectedType === 'personal'
                    ? 'text-[#ffd100]'
                    : 'text-black'
                }`}
              >
                Pessoais
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setSelectedType('equipment')}
              className={`flex-1 py-3 px-4 rounded-xl border-[2px] border-black ${
                selectedType === 'equipment'
                  ? 'bg-[#08233e]'
                  : 'bg-white'
              }`}
            >
              <Text
                className={`text-center font-black text-xs uppercase ${
                  selectedType === 'equipment'
                    ? 'text-[#ffd100]'
                    : 'text-black'
                }`}
              >
                Equipamentos
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Results */}
        {loading ? (
          <View className="items-center justify-center py-10">
            <ActivityIndicator color="#08233e" size="large" />
          </View>
        ) : filteredDocuments.length === 0 ? (
          <View className="items-center justify-center py-10">
            <FontAwesome name="search" size={40} color="#ccc" />
            <Text className="text-sm font-bold text-[#999] mt-4 text-center">
              Nenhum documento encontrado
            </Text>
          </View>
        ) : (
          filteredDocuments.map((doc) => (
            <DocumentCard key={doc.id} document={doc} />
          ))
        )}
      </View>

      <View className="h-6" />
    </ScrollView>
  );
}
