// Máscaras aplicadas enquanto o usuário digita. Os separadores só aparecem depois
// que há um dígito além deles — assim apagar com backspace nunca "trava" num "/" ou "-".

const digitsOnly = (text: string) => text.replace(/\D/g, '');

/** 15031990 → 15/03/1990 */
export function maskDate(text: string): string {
  const d = digitsOnly(text).slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
}

/** Celular (11) 99999-9999 ou fixo (11) 3333-4444, conforme a quantidade de dígitos. */
export function maskPhone(text: string): string {
  const d = digitsOnly(text).slice(0, 11);
  if (d.length === 0) return '';
  if (d.length <= 2) return `(${d}`;
  const ddd = d.slice(0, 2);
  const rest = d.slice(2);
  if (rest.length <= 4) return `(${ddd}) ${rest}`;
  const split = d.length === 11 ? 5 : 4;
  return `(${ddd}) ${rest.slice(0, split)}-${rest.slice(split)}`;
}

/**
 * DD/MM/AAAA → ISO em meia-noite UTC (o dia não "volta" um por causa de fuso).
 * Retorna null se a data estiver incompleta, não existir ou estiver no futuro.
 */
export function parseBrDate(text: string): string | null {
  const match = text.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return null;
  const [day, month, year] = [Number(match[1]), Number(match[2]), Number(match[3])];
  const date = new Date(Date.UTC(year, month - 1, day));
  const isRealDate = date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
  if (!isRealDate || year < 1900 || date.getTime() > Date.now()) return null;
  return date.toISOString();
}

/** ISO → DD/MM/AAAA, para preencher o campo ao editar. */
export function isoToBrDate(iso: string): string {
  const [year, month, day] = iso.slice(0, 10).split('-');
  return `${day}/${month}/${year}`;
}
