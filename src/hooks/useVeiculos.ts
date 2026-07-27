import { useQuery } from '@tanstack/react-query';
import { fetchVeiculos } from '@/services/veiculos';

export function useVeiculos() {
  return useQuery({ queryKey: ['veiculos'], queryFn: fetchVeiculos });
}