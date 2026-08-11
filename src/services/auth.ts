import { api } from '@/lib/api';

type LoginPayload = {
  login: string;
  password: string;
};

export type Motorista = {
  id: number;
  cpf: string;
  endereco: string;
  renach: string;
  validadeHabilitacao: string;
  tipoHabilitacao: string;
  tipoVinculo: string;
};

export type Me = {
  id: number;
  nome: string;
  email: string;
  role: 'ADMIN' | 'OPERADOR';
  motorista: Motorista | null;
};

type LoginResponse = {
  accessToken: string;
  expiresIn: number;
  tokenType: string;
  user: Me;
};

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/auth/login', payload);
  return data;
}