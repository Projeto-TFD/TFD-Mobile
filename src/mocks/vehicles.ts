export type Vehicle = {
  id: string;
  modelo: string;
  placa: string;
  ano: string;
  renavam: string;
  tipo: string;
};

export const vehicles: Vehicle[] = [
  { id: '1', modelo: 'Gol', placa: 'ABC1D23', ano: '2020', renavam: '00123456789', tipo: 'Sedan' },
  { id: '2', modelo: 'Corsa', placa: 'DEF4G56', ano: '2018', renavam: '00987654321', tipo: 'Hatch' },
  { id: '3', modelo: 'Spin', placa: 'GHI7J89', ano: '2022', renavam: '00456789123', tipo: 'Minivan' },
  { id: '4', modelo: 'Cruze', placa: 'JKL0M12', ano: '2021', renavam: '00789123456', tipo: 'Sedan' },
];