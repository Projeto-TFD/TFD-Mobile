import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming, withDelay } from 'react-native-reanimated';
import React, { useEffect } from 'react';

export default function ViagemFinalizadaScreen() {
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(
      150,
      withSequence(
        withTiming(1.2, { duration: 300 }),
        withTiming(1, { duration: 150 })
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  function handleVoltar() {
    router.replace('/(app)/cadastrar-viagem');
  }

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView edges={['top']} className="bg-primary">
        <View className="h-[140px] items-center justify-center">
          <Text className="text-white text-xl font-bold">Viagem finalizada!</Text>
        </View>
      </SafeAreaView>

        <View className="flex-1 items-center justify-center">
            <Animated.View style={animatedStyle}>
                <Ionicons name="checkmark-circle" size={160} color="#16A34A" />
            </Animated.View>
        </View>

      <View className="px-4 pb-6 pt-2 bg-white">
        <Pressable
          className="bg-primary h-[52px] rounded-xl items-center justify-center"
          onPress={handleVoltar}
        >
          <Text className="text-white text-base font-semibold">Voltar ao menu inicial</Text>
        </Pressable>
      </View>
    </View>
  );
}