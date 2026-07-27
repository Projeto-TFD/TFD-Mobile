import { api } from '@/lib/api';

export type Pessoa = {
  id: number;
  nome: string;
  cpf: string;
  cartaoSus: string | null;
  dataNascimento: string | null;
  telefone: string | null;
  endereco: string | null;
  municipio: string | null;
};

export async function fetchPessoas(): Promise<Pessoa[]> {
  const { data } = await api.get<Pessoa[]>('/pessoas');
  return data;
}