import { useQuery } from '@tanstack/react-query';
import { fetchCidades } from '@/services/cidades';

export function useCidades() {
  return useQuery({ queryKey: ['cidades'], queryFn: fetchCidades });
}