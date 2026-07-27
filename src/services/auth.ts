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
};

export async function fetchMe(): Promise<Me> {
  const { data } = await api.get<Me>('/auth/me');
  return data;
}