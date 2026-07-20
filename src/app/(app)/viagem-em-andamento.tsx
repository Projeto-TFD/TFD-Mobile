import React, { useCallback } from 'react';
import { View, Text, Pressable, ScrollView, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { useTripStore } from '@/store/tripStore';
import { vehicles } from '@/mocks/vehicles';

export default function ViagemEmAndamentoScreen() {
  const trip = useTripStore((state) => state.trip);
  const finishTrip = useTripStore((state) => state.finishTrip);

  // Bloqueia o botão físico/gesto de voltar do Android enquanto a viagem estiver ativa
  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener('hardwareBackPress', () => true);
      return () => subscription.remove();
    }, [])
  );

  if (!trip) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-slate-500">Nenhuma viagem em andamento</Text>
      </View>
    );
  }

  const veiculo = vehicles.find((v) => v.id === trip.veiculoId);

  function handleFinalizar() {
    console.log('finalizar clicado');
    finishTrip();
    router.replace('/(app)/viagem-finalizada');
  }

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView edges={['top']} className="bg-primary">
        <View className="h-[140px] items-center justify-center">
          <Text className="text-white text-xl font-bold">Viagem iniciada!</Text>
        </View>
      </SafeAreaView>

      <ScrollView className="flex-1 px-4 pt-6" contentContainerClassName="pb-4">
        <Text className="text-sm font-semibold text-slate-800 mb-2">Dados da viagem</Text>
        <View className="border border-slate-200 rounded-xl p-4 mb-6">
          <View className="flex-row justify-between mb-1">
            <Text className="text-primary text-sm">Cidade</Text>
            <Text className="text-primary text-sm font-semibold">
              {trip.cidadeDestino || '-'}
              {trip.uf ? ` / ${trip.uf}` : ''}
            </Text>
          </View>

          {veiculo && (
            <Text className="text-primary text-sm mt-1">
              Veículo: {veiculo.modelo} · {veiculo.placa}
            </Text>
          )}

          {trip.observacao ? (
            <>
              <Text className="text-primary text-sm mt-3">Observação:</Text>
              <Text className="text-primary text-sm">{trip.observacao}</Text>
            </>
          ) : null}
        </View>

        <Text className="text-sm font-semibold text-slate-800 mb-2">Passageiros</Text>
        <View className="border border-slate-200 rounded-xl p-4">
          {trip.passageiros.length === 0 ? (
            <Text className="text-slate-400 text-sm">Nenhum passageiro adicionado</Text>
          ) : (
            trip.passageiros.map((p) => (
              <Text key={p.id} className="text-primary text-sm mb-1">
                {p.pacienteNome}
                {p.acompanhanteNome ? ` + ${p.acompanhanteNome}` : ''}
              </Text>
            ))
          )}
        </View>
      </ScrollView>

      <View className="px-4 pb-6 pt-2 bg-white border-t border-slate-100">
        <Pressable
          className="bg-primary h-[52px] rounded-xl items-center justify-center"
          onPress={handleFinalizar}
        >
          <Text className="text-white text-base font-semibold">Finalizar viagem</Text>
        </Pressable>
      </View>
    </View>
  );
}