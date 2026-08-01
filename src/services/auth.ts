import { api } from '@/lib/api';

type LoginPayload = {
  email: string;
  password: string;
};

type LoginResponse = {
  accessToken: string;
};

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/auth/login', payload);
  return data;
}

export type Me = {
  id: number;
  nome: string;
  email: string;
  role: 'ADMIN' | 'OPERADOR';
  ativo: boolean;
  motorista: {
    id: number;
    cpf: string;
    endereco: string;
    renach: string;
    validadeHabilitacao: string;
    tipoHabilitacao: string;
    tipoVinculo: string;
  } | null;
};

export async function fetchMe(): Promise<Me> {
  const { data } = await api.get<Me>('/auth/me');
  return data;
}