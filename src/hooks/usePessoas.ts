import { useQuery } from '@tanstack/react-query';
import { fetchPessoas } from '@/services/pessoas';

export function usePessoas() {
  return useQuery({ queryKey: ['pessoas'], queryFn: fetchPessoas });
}