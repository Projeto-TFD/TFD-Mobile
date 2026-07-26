import React, { useState } from 'react';
import {View,Text,Pressable,KeyboardAvoidingView,Platform,ScrollView,Image,ActivityIndicator,} from 'react-native';
import { router } from 'expo-router';
import { Input } from '@/components/ui/Input';
import { login } from '@/services/auth';
import { useAuthStore } from '@/store/authStore';
import { SafeAreaView } from 'react-native-safe-area-context';

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [errors, setErrors] = useState<{ email?: string; senha?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const setToken = useAuthStore((state) => state.setToken);

  function handleEmailChange(value: string) {
    setEmail(value);
    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
    if (loginError) setLoginError(null);
  }

  async function handleSubmit() {
    const newErrors: typeof errors = {};

    if (!isValidEmail(email)) newErrors.email = 'E-mail inválido';
    if (senha.length < 6) newErrors.senha = 'A senha deve ter pelo menos 6 caracteres';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsLoading(true);
    setLoginError(null);

    try {
      const { accessToken } = await login({ email, password: senha });
      setToken(accessToken);
      router.replace('/(app)/cadastrar-viagem');
    } catch (error: any) {
      if (error?.response?.status === 401) {
        setLoginError('E-mail ou senha incorretos');
      } else {
        setLoginError('Não foi possível conectar. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerClassName="flex-grow">
        <SafeAreaView edges={['top']} className="bg-primary">
          <View className="h-[120px] items-center justify-center">
            <Image
              source={require('@/assets/images/logo.png')}
              className="w-40 h-40"
              resizeMode="contain"
            />
          </View>
        </SafeAreaView>

        <View className="flex-1 justify-center p-6">
          <Input
            label="E-mail"
            placeholder="seu@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={handleEmailChange}
            error={errors.email}
          />

          <Input
            label="Senha"
            placeholder="Sua senha"
            isPassword
            value={senha}
            onChangeText={(value) => {
              setSenha(value);
              if (errors.senha) setErrors((prev) => ({ ...prev, senha: undefined }));
              if (loginError) setLoginError(null);
            }}
            error={errors.senha}
          />

          {loginError && (
            <Text className="text-danger text-sm text-center mb-3">{loginError}</Text>
          )}

          <Pressable
            className="bg-primary h-[52px] rounded-xl items-center justify-center mt-2"
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="text-white text-base font-semibold">Entrar</Text>
            )}
          </Pressable>

          <Text className="text-center text-xs text-slate-400 mt-8">
            Desenvolvido por estudantes do IFPB — Campus Cajazeiras
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}