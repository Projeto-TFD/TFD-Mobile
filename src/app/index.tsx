import React, { useState } from 'react';
import { View, Text, Pressable, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { Input } from '@/components/ui/Input';
import { maskCPF, isValidCPF } from '@/utils/cpf';

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

    console.log('login', { cpf, senha });
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerClassName="flex-grow">


        <View className="bg-primary w-full items-center justify-center">
          <Image
            source={require('@/assets/images/tfd.png')}
            className="w-40 h-40"
            resizeMode="contain"
          />
        </View>

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