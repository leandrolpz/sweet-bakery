import type { Option, Row } from './types';
import { isoToBr, shortId } from '@/src/utils/format';
import { colors } from '@/src/constants/theme';

export const PAYMENT_METHODS: Option[] = [
  { value: 'PIX', label: 'PIX', emoji: '💸' },
  { value: 'Cartão de Crédito', label: 'Cartão de Crédito', emoji: '💳' },
  { value: 'Cartão de Débito', label: 'Cartão de Débito', emoji: '🏦' },
  { value: 'Dinheiro', label: 'Dinheiro', emoji: '💵' },
];

export const ORDER_STATUS: Option[] = [
  { value: 'received', label: 'Recebido', emoji: '📥', color: colors.azul, bg: colors.azulSuave },
  { value: 'preparing', label: 'Em preparo', emoji: '👩‍🍳', color: colors.lavanda, bg: colors.lavandaSuave },
  { value: 'ready', label: 'Pronto', emoji: '✅', color: colors.pistache, bg: colors.pistacheSuave },
  { value: 'delivered', label: 'Entregue', emoji: '🚚', color: colors.caramelo, bg: colors.carameloSuave },
];

export const PAYMENT_STATUS: Option[] = [
  { value: 'pending', label: 'Pendente', emoji: '⏳', color: colors.caramelo, bg: colors.carameloSuave },
  { value: 'paid', label: 'Pago', emoji: '✅', color: colors.pistache, bg: colors.pistacheSuave },
  { value: 'canceled', label: 'Cancelado', emoji: '✖️', color: colors.perigo, bg: colors.perigoSuave },
  { value: 'refunded', label: 'Estornado', emoji: '↩️', color: colors.lavanda, bg: colors.lavandaSuave },
];

export const fmtDate = (v: unknown) => isoToBr(v) || 'Sem data';
export const orderCode = (r: Row) => shortId(r.id);
export const byDateDesc = (a: Row, b: Row) => String(b.date ?? '').localeCompare(String(a.date ?? ''));
export const byName = (a: Row, b: Row) => String(a.name ?? '').localeCompare(String(b.name ?? ''), 'pt-BR');

export const itemsSummary = (items: any) =>
  (Array.isArray(items) ? items : []).map((i) => `${i.quantity}× ${i.product?.name ?? 'Produto'}`).join(', ');

export const compact = (rows: [string, unknown][]): [string, string][] =>
  rows.filter(([, v]) => v !== undefined && v !== null && String(v).trim() !== '').map(([k, v]) => [k, String(v)]);

export const statusBadge = (options: Option[]) => (r: Row) => {
  const v = String(r.status ?? '').toLowerCase();
  const o = options.find((x) => x.value === v || x.label.toLowerCase() === v);
  return o
    ? { label: `${o.emoji} ${o.label}`, color: o.color!, bg: o.bg! }
    : r.status
      ? { label: String(r.status), color: colors.textoSuave, bg: colors.linha }
      : null;
};
