import { api } from '@/lib/api';

export type CriarViagemPayload = {
  veiculoId: number;
  cidadeOrigemId: number;
  cidadeDestinoId: number;
  dataSaida: string;
  observacao?: string;
  pessoas: {
    pessoaId: number;
    tipoParticipacao: 'PACIENTE' | 'ACOMPANHANTE';
  }[];
};

export type Viagem = {
  id: number;
  veiculoId: number;
  motoristaId: number;
  cidadeOrigemId: number;
  cidadeDestinoId: number;
  dataSaida: string;
  dataEntrada: string | null;
  observacao: string | null;
};

export async function criarViagem(payload: CriarViagemPayload): Promise<Viagem> {
  const { data } = await api.post<Viagem>('/viagens', payload);
  return data;
}

export async function finalizarViagem(id: number, dataEntrada: string): Promise<Viagem> {
  const { data } = await api.patch<Viagem>(`/viagens/${id}`, { dataEntrada });
  return data;
}