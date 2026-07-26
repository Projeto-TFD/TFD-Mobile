import { useQuery } from '@tanstack/react-query';
import { fetchMe } from '@/services/auth';
import { useAuthStore } from '@/store/authStore';

export function useMe() {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: ['me'],
    queryFn: fetchMe,
    enabled: !!token, // só busca se já tiver token salvo
  });
}