import React, { useState } from 'react';
import { View, Text, Pressable, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { Input } from '@/components/ui/Input';
import { maskCPF, isValidCPF } from '@/utils/cpf';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [errors, setErrors] = useState<{ cpf?: string; senha?: string }>({});

  function handleCpfChange(value: string) {
    setCpf(maskCPF(value));
    if (errors.cpf) setErrors((prev) => ({ ...prev, cpf: undefined }));
  }

  function handleSubmit() {
    const newErrors: typeof errors = {};

    if (!isValidCPF(cpf)) newErrors.cpf = 'CPF inválido';
    if (senha.length < 6) newErrors.senha = 'A senha deve ter pelo menos 6 caracteres';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    //trocar por chamada real de autenticação quando o back estiver pronto
    router.replace('/(app)/cadastrar-viagem');
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerClassName="flex-grow">


        <SafeAreaView edges={['top']} className="bg-primary">
          <View className="h-[150px] items-center justify-center">
            <Image
              source={require('@/assets/images/tfd.png')}
              className="w-28 h-28"
              resizeMode="contain"
            />
          </View>
        </SafeAreaView>

        <View className="flex-1 justify-center p-6">
          <Input
            label="CPF"
            placeholder="000.000.000-00"
            keyboardType="numeric"
            value={cpf}
            onChangeText={handleCpfChange}
            maxLength={14}
            error={errors.cpf}
          />

          <Input
            label="Senha"
            placeholder="Sua senha"
            isPassword
            value={senha}
            onChangeText={setSenha}
            error={errors.senha}
          />

          <Pressable
            className="bg-primary h-[52px] rounded-xl items-center justify-center mt-2"
            onPress={handleSubmit}
          >
            <Text className="text-white text-base font-semibold">Entrar</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}