import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Passageiro = {
  id: string;
  pacienteId: string;
  pacienteNome: string;
  acompanhanteId?: string;
  acompanhanteNome?: string;
};

type TripData = {
  cidadeDestino: string;
  uf: string;
  observacao: string;
  veiculoId?: string;
  passageiros: Passageiro[];
};

type TripState = {
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  status: 'idle' | 'active';
  trip: TripData | null;
  startTrip: (trip: TripData) => void;
  finishTrip: () => void;
};

export const useTripStore = create<TripState>()(
  persist(
    (set) => ({
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),
      status: 'idle',
      trip: null,
      startTrip: (trip) => set({ status: 'active', trip }),
      finishTrip: () => set({ status: 'idle', trip: null }),
    }),
    {
      name: 'tfd-trip-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ status: state.status, trip: state.trip }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);