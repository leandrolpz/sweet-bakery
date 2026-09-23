/** Formatação e conversão de valores (dinheiro, datas, máscaras). Sem depender de Intl. */

export const money = (v: unknown) => {
  const n = Number(v) || 0;
  const [int, dec] = n.toFixed(2).split('.');
  return `R$ ${int.replace(/\B(?=(\d{3})+(?!\d))/g, '.')},${dec}`;
};

/** Aceita "12,50", "12.50" e "1.234,50". Retorna null se vazio ou inválido. */
export function parseNumber(input: unknown): number | null {
  const s = String(input ?? '').trim().replace(/\s/g, '').replace(/^R\$/, '');
  if (!s) return null;
  const normalized = s.includes(',') ? s.replace(/\./g, '').replace(',', '.') : s;
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}

export const numberToInput = (v: unknown) =>
  v === undefined || v === null || v === '' ? '' : String(v).replace('.', ',');

export const round2 = (n: number) => Math.round(n * 100) / 100;

const pad = (n: number) => String(n).padStart(2, '0');

export function isoToBr(iso?: unknown): string {
  if (!iso) return '';
  const d = new Date(String(iso));
  if (isNaN(d.getTime())) return '';
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

/** Converte DD/MM/AAAA em ISO. Se a data não mudou, mantém o ISO original (preserva a hora). */
export function brToIso(br: string, original?: unknown): string | null {
  if (original && isoToBr(original) === br) return String(original);
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(br.trim());
  if (!m) return null;
  const [, dd, mm, yy] = m;
  const d = new Date(+yy, +mm - 1, +dd, 12, 0, 0);
  if (d.getMonth() !== +mm - 1 || d.getDate() !== +dd) return null;
  return d.toISOString();
}

export const todayBr = () => isoToBr(new Date().toISOString());

export function maskDate(s: string) {
  const n = s.replace(/\D/g, '').slice(0, 8);
  if (n.length > 4) return `${n.slice(0, 2)}/${n.slice(2, 4)}/${n.slice(4)}`;
  if (n.length > 2) return `${n.slice(0, 2)}/${n.slice(2)}`;
  return n;
}

export function maskPhone(s: string) {
  const n = s.replace(/\D/g, '').slice(0, 11);
  if (n.length === 0) return '';
  if (n.length <= 2) return `(${n}`;
  if (n.length <= 6) return `(${n.slice(0, 2)}) ${n.slice(2)}`;
  if (n.length <= 10) return `(${n.slice(0, 2)}) ${n.slice(2, 6)}-${n.slice(6)}`;
  return `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7)}`;
}

export const isHex = (s: unknown) => /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(String(s ?? '').trim());
export const safeColor = (s: unknown, fallback: string) => (isHex(s) ? String(s).trim() : fallback);

/** Remove acentos e caixa — busca tolerante ("pao" encontra "Pão"). */
export const norm = (s: unknown) =>
  String(s ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export const shortId = (id: string) => `#${id.slice(-6).toUpperCase()}`;
export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export const validateHex = (v: unknown) => (isHex(v) ? null : 'Use uma cor no formato #RRGGBB, como #C92F60.');
