import { useAuthStore } from '@/store/authStore';

export function useMe() {
  return useAuthStore((state) => state.user);
}