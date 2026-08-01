import { api } from '@/lib/api';

export type Cidade = {
  id: number;
  nome: string;
  uf: string;
};

export async function fetchCidades(): Promise<Cidade[]> {
  const { data } = await api.get<Cidade[]>('/cidades');
  return data;
}