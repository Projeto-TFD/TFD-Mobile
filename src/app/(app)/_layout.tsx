import { Stack } from 'expo-router';

export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="viagem-em-andamento" options={{ gestureEnabled: false }} />
      <Stack.Screen name="viagem-finalizada" options={{ gestureEnabled: false }} />
    </Stack>
  );
}