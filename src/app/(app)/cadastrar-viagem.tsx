import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Accordion } from '@/components/ui/Accordion';
import { Select } from '@/components/ui/Select';
import { useVeiculos } from '@/hooks/useVeiculos';
import { usePessoas } from '@/hooks/usePessoas';
import { useCidades } from '@/hooks/useCidades';
import { useMe } from '@/hooks/useMe';
import { router } from 'expo-router';
import { useTripStore } from '@/store/tripStore';
import { criarViagem } from '@/services/viagens';
import { Ionicons } from '@expo/vector-icons';

type Passageiro = {
  id: string;
  pacienteId: string;
  pacienteNome: string;
  acompanhanteId?: string;
  acompanhanteNome?: string;
};

const MARIZOPOLIS_ID = 4;

export default function CadastrarViagemScreen() {
  const { data: pessoas, isLoading: isLoadingPessoas, isError: isErrorPessoas } = usePessoas();
  const me = useMe();
  const { data: cidades, isLoading: isLoadingCidades, isError: isErrorCidades } = useCidades();
  const { data: veiculos, isLoading: isLoadingVeiculos, isError: isErrorVeiculos } = useVeiculos();

  const [cidadeDestinoId, setCidadeDestinoId] = useState<string>();
  const [observacao, setObservacao] = useState('');
  const [veiculoId, setVeiculoId] = useState<string>();

  const [pacienteId, setPacienteId] = useState<string>();
  const [acompanhanteId, setAcompanhanteId] = useState<string>();
  const [passageiros, setPassageiros] = useState<Passageiro[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const startTrip = useTripStore((state) => state.startTrip);

  const veiculoOptions = (veiculos ?? []).map((v) => ({
    value: String(v.id),
    label: `${v.nome} · ${v.placa} · ${v.ano} · ${v.renavam}`,
  }));

  const cidadeOptions = (cidades ?? [])
    .filter((c) => c.id !== MARIZOPOLIS_ID)
    .map((c) => ({ value: String(c.id), label: `${c.nome} - ${c.uf}` }));

  const idsJaUsados = passageiros.flatMap((p) =>
    [p.pacienteId, p.acompanhanteId].filter(Boolean)
  );
  const todasPessoas = (pessoas ?? []).map((p) => ({ value: String(p.id), label: p.nome }));
  const pacienteOptions = todasPessoas.filter(
    (o) => !idsJaUsados.includes(o.value) && o.value !== acompanhanteId
  );
  const acompanhanteOptions = todasPessoas.filter(
    (o) => !idsJaUsados.includes(o.value) && o.value !== pacienteId
  );

  function handleAdicionarPassageiro() {
    if (!pacienteId) return;

    const paciente = pessoas?.find((p) => String(p.id) === pacienteId);
    const acompanhante = pessoas?.find((p) => String(p.id) === acompanhanteId);
    if (!paciente) return;

    setPassageiros((prev) => [
      ...prev,
      {
        id: `${Date.now()}`,
        pacienteId: paciente.id.toString(),
        pacienteNome: paciente.nome,
        acompanhanteId: acompanhante?.id.toString(),
        acompanhanteNome: acompanhante?.nome,
      },
    ]);

    setPacienteId(undefined);
    setAcompanhanteId(undefined);
  }

  function handleRemoverPassageiro(id: string) {
    setPassageiros((prev) => prev.filter((p) => p.id !== id));
  }

  async function handleIniciarViagem() {
    if (!me?.motorista) {
      setSubmitError('Usuário logado não está vinculado a um motorista.');
      return;
    }
    if (!veiculoId || !cidadeDestinoId) {
      setSubmitError('Preencha veículo e cidade destino antes de iniciar.');
      return;
    }
    if (passageiros.length === 0) {
      setSubmitError('Adicione ao menos um passageiro.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const dataSaida = new Date().toISOString();

    const pessoasPayload = passageiros.flatMap((p) => {
      const items: { pessoaId: number; tipoParticipacao: 'PACIENTE' | 'ACOMPANHANTE' }[] = [
        { pessoaId: Number(p.pacienteId), tipoParticipacao: 'PACIENTE' },
      ];
      if (p.acompanhanteId) {
        items.push({ pessoaId: Number(p.acompanhanteId), tipoParticipacao: 'ACOMPANHANTE' });
      }
      return items;
    });

    try {
      const viagem = await criarViagem({
        veiculoId: Number(veiculoId),
        cidadeDestinoId: Number(cidadeDestinoId),
        dataSaida,
        observacao: observacao || undefined,
        pessoas: pessoasPayload,
      });

      const cidade = cidades?.find((c) => String(c.id) === cidadeDestinoId);

      startTrip({
        viagemId: viagem.id,
        cidadeDestino: cidade ? `${cidade.nome} - ${cidade.uf}` : '',
        cidadeDestinoId: Number(cidadeDestinoId),
        observacao,
        veiculoId,
        passageiros,
      });

      router.replace('/(app)/viagem-em-andamento');
} catch (error: any) {
  console.log('Erro ao criar viagem:', error);

  if (error.response) {
    console.log('Status:', error.response.status);
    console.log('Dados:', error.response.data);
  }

  setSubmitError(
    error.response?.data?.message ??
    'Não foi possível iniciar a viagem.'
  );
}
  }

  function handleLogout() {
    router.replace('/(auth)/login');
  }

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView edges={['top']} className="bg-primary">
        <View className="px-6 h-[140px] flex-row items-center justify-between">
          <View>
            <Text className="text-white text-lg font-bold">Olá, {me?.nome ?? '...'}!</Text>
            <Text className="text-white/80 text-sm mt-1">Cadastre sua viagem aqui</Text>
          </View>

          <Pressable onPress={handleLogout} hitSlop={12}>
            <Ionicons name="log-out-outline" size={24} color="#FFFFFF" />
          </Pressable>
        </View>
      </SafeAreaView>

      <ScrollView className="flex-1 px-4 pt-4" contentContainerClassName="pb-4">
        <Accordion title="Dados da viagem">
          {isLoadingCidades ? (
            <ActivityIndicator color="#1E5F8C" />
          ) : isErrorCidades ? (
            <Text className="text-danger text-sm">Não foi possível carregar as cidades.</Text>
          ) : (
            <Select
              label="Cidade destino"
              placeholder="Selecione a cidade"
              options={cidadeOptions}
              value={cidadeDestinoId}
              onChange={setCidadeDestinoId}
            />
          )}

          <Text className="text-sm font-semibold text-slate-800 mb-1.5 mt-4">Observação:</Text>
          <TextInput
            className="border border-slate-300 rounded-xl px-3.5 py-3 text-slate-800 h-[80px]"
            value={observacao}
            onChangeText={setObservacao}
            multiline
            textAlignVertical="top"
          />
        </Accordion>

        <Accordion title="Selecionar veículo">
          {isLoadingVeiculos ? (
            <ActivityIndicator color="#1E5F8C" />
          ) : isErrorVeiculos ? (
            <Text className="text-danger text-sm">Não foi possível carregar os veículos.</Text>
          ) : (
            <Select
              label="Escolha o veículo"
              options={veiculoOptions}
              value={veiculoId}
              onChange={setVeiculoId}
            />
          )}
        </Accordion>

        <Accordion title="Adicionar passageiros">
          {isLoadingPessoas ? (
            <ActivityIndicator color="#1E5F8C" />
          ) : isErrorPessoas ? (
            <Text className="text-danger text-sm">Não foi possível carregar os pacientes.</Text>
          ) : (
            <>
              <Select
                label="Paciente"
                placeholder="Selecione o paciente"
                options={pacienteOptions}
                value={pacienteId}
                onChange={setPacienteId}
              />
              <Select
                label="Acompanhante (opcional)"
                placeholder="Selecione o acompanhante"
                options={acompanhanteOptions}
                value={acompanhanteId}
                onChange={setAcompanhanteId}
              />

              {passageiros.length > 0 && (
                <View className="mb-4">
                  <Text className="text-sm font-semibold text-slate-800 mb-2">
                    Passageiros adicionados
                  </Text>
                  {passageiros.map((p) => (
                    <View
                      key={p.id}
                      className="flex-row items-center justify-between border-b border-slate-100 py-2"
                    >
                      <Text className="text-slate-700 text-sm">
                        {p.pacienteNome}
                        {p.acompanhanteNome ? ` + ${p.acompanhanteNome}` : ''}
                      </Text>
                      <Pressable onPress={() => handleRemoverPassageiro(p.id)} hitSlop={8}>
                        <Text className="text-slate-400 text-base">×</Text>
                      </Pressable>
                    </View>
                  ))}
                </View>
              )}

              <Pressable
                className="bg-primary h-[44px] rounded-xl items-center justify-center"
                onPress={handleAdicionarPassageiro}
              >
                <Text className="text-white text-sm font-semibold">Adicionar paciente</Text>
              </Pressable>
            </>
          )}
        </Accordion>
      </ScrollView>

      <View className="px-4 pb-6 pt-2 bg-white border-t border-slate-100">
        {submitError && (
          <Text className="text-danger text-sm text-center mb-2">{submitError}</Text>
        )}

        <Pressable
          className="bg-primary h-[52px] rounded-xl items-center justify-center"
          onPress={handleIniciarViagem}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text className="text-white text-base font-semibold">Iniciar viagem</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}