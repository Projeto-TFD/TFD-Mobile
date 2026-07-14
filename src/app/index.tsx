import { Redirect } from 'expo-router';

export default function Index() {
  //trocar por checagem real de sessão (token salvo, etc.) quando o back estiver pronto
  const isAuthenticated = false;

  return <Redirect href={isAuthenticated ? '/(app)/cadastrar-viagem' : '/(auth)/login'} />;
}