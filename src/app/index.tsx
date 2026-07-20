import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useTripStore } from '@/store/tripStore';

export default function Index() {
  const hasHydrated = useTripStore((state) => state.hasHydrated);
  const status = useTripStore((state) => state.status);

  // TODO: trocar por checagem real de sessão quando o back estiver pronto
  const isAuthenticated = false;

  if (!hasHydrated) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator color="#1E5F8C" />
      </View>
    );
  }

  if (status === 'active') {
    return <Redirect href="/(app)/viagem-em-andamento" />;
  }

  return <Redirect href={isAuthenticated ? '/(app)/cadastrar-viagem' : '/(auth)/login'} />;
}