import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Accordion } from '@/components/ui/Accordion';
import { Select } from '@/components/ui/Select';
import { vehicles } from '@/mocks/vehicles';
import { patients } from '@/mocks/patients';
import { router } from 'expo-router';
import { useTripStore } from '@/store/tripStore';
import { Ionicons } from '@expo/vector-icons';

type Passageiro = {
  id: string;
  pacienteId: string;
  pacienteNome: string;
  acompanhanteId?: string;
  acompanhanteNome?: string;
};

export default function CadastrarViagemScreen() {
  const [cidadeDestino, setCidadeDestino] = useState('');
  const [uf, setUf] = useState('');
  const [observacao, setObservacao] = useState('');

  const [veiculoId, setVeiculoId] = useState<string>();

  const [pacienteId, setPacienteId] = useState<string>();
  const [acompanhanteId, setAcompanhanteId] = useState<string>();
  const [passageiros, setPassageiros] = useState<Passageiro[]>([]);

  const startTrip = useTripStore((state) => state.startTrip);

  const veiculoOptions = vehicles.map((v) => ({
    value: v.id,
    label: `${v.modelo} ${v.placa} ${v.ano} ${v.renavam} ${v.tipo}`,
  }));

  const pacienteOptions = patients.map((p) => ({ value: p.id, label: p.nome }));

  function handleAdicionarPassageiro() {
    if (!pacienteId) return;

    const paciente = patients.find((p) => p.id === pacienteId);
    const acompanhante = patients.find((p) => p.id === acompanhanteId);
    if (!paciente) return;

    setPassageiros((prev) => [
      ...prev,
      {
        id: `${Date.now()}`,
        pacienteId: paciente.id,
        pacienteNome: paciente.nome,
        acompanhanteId: acompanhante?.id,
        acompanhanteNome: acompanhante?.nome,
      },
    ]);

    setPacienteId(undefined);
    setAcompanhanteId(undefined);
  }

  function handleRemoverPassageiro(id: string) {
    setPassageiros((prev) => prev.filter((p) => p.id !== id));
  }

  function handleIniciarViagem() {
    // TODO: integrar com API quando o back estiver pronto
    startTrip({ cidadeDestino, uf, observacao, veiculoId, passageiros });
    router.replace('/(app)/viagem-em-andamento');
    console.log({ cidadeDestino, uf, observacao, veiculoId, passageiros });
  }

  function handleLogout() {
    router.replace('/(auth)/login');
  }

  return (
    <View className="flex-1 bg-white">
        <SafeAreaView edges={['top']} className="bg-primary">
          <View className="px-6 h-[140px] flex-row items-center justify-between">
            <View>
              <Text className="text-white text-lg font-bold">Olá, João!</Text>
              <Text className="text-white/80 text-sm mt-1">Cadastre sua viagem aqui</Text>
            </View>

            <Pressable onPress={handleLogout} hitSlop={12}>
              <Ionicons name="log-out-outline" size={24} color="#FFFFFF" />
            </Pressable>
          </View>
        </SafeAreaView>

      <ScrollView className="flex-1 px-4 pt-4" contentContainerClassName="pb-4">
        <Accordion title="Dados da viagem">
          <View className="flex-row gap-3">
            <View className="flex-1">
              <Text className="text-sm font-semibold text-slate-800 mb-1.5">Cidade destino:</Text>
              <TextInput
                className="border border-slate-300 rounded-xl px-3.5 h-[44px] text-slate-800"
                value={cidadeDestino}
                onChangeText={setCidadeDestino}
              />
            </View>
            <View className="w-16">
              <Text className="text-sm font-semibold text-slate-800 mb-1.5">UF:</Text>
              <TextInput
                className="border border-slate-300 rounded-xl px-3.5 h-[44px] text-slate-800"
                value={uf}
                onChangeText={(v) => setUf(v.toUpperCase())}
                maxLength={2}
                autoCapitalize="characters"
              />
            </View>
          </View>

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
          <Select
            label="Escolha o veículo"
            options={veiculoOptions}
            value={veiculoId}
            onChange={setVeiculoId}
          />
        </Accordion>

        <Accordion title="Adicionar passageiros">
          <Select
            label="Paciente"
            placeholder="Selecione o paciente"
            options={pacienteOptions}
            value={pacienteId}
            onChange={setPacienteId}
          />
          <Select
            label="Possui acompanhante?"
            placeholder="Selecione o acompanhante"
            options={pacienteOptions.filter((o) => o.value !== pacienteId)}
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
        </Accordion>
      </ScrollView>

      <View className="px-4 pb-6 pt-2 bg-white border-t border-slate-100">
        <Pressable
          className="bg-primary h-[52px] rounded-xl items-center justify-center"
          onPress={handleIniciarViagem}
        >
          <Text className="text-white text-base font-semibold">Iniciar viagem</Text>
        </Pressable>
      </View>
    </View>
  );
}