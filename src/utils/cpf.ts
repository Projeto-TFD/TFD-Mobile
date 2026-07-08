export function maskCPF(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

export function isValidCPF(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, '');
  if(digits.length !== 11) return false;
  if(/^(\d)\1{10}$/.test(digits)) return false;

  let sum = 0;
  for(let i = 0; i < 9; i++) sum += parseInt(digits[i]) * (10 - i);
  let firstCheck = (sum * 10) % 11;
  if(firstCheck === 10) firstCheck = 0;
  if(firstCheck !== parseInt(digits[9])) return false;

  sum = 0;
  for(let i = 0; i < 10; i++) sum += parseInt(digits[i]) * (11 - i);
  let secondCheck = (sum * 10) % 11;
  if(secondCheck === 10) secondCheck = 0;
  if(secondCheck !== parseInt(digits[10])) return false;

  return true;
}