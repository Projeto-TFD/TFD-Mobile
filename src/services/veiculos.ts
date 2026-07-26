import { api } from '@/lib/api';

export type Veiculo = {
  id: number;
  nome: string;
  placa: string;
  ano: number;
  renavam: string;
  tipo: 'PROPRIO' | 'LOCADO';
  createdAt: string;
  updatedAt: string;
};

export async function fetchVeiculos(): Promise<Veiculo[]> {
  const { data } = await api.get<Veiculo[]>('/veiculos');
  return data;
}