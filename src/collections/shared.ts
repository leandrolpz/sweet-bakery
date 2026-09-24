import type { Option, Row } from './types';
import { isoToBr, shortId } from '@/src/utils/format';
import { colors } from '@/src/constants/theme';

export const PAYMENT_METHODS: Option[] = [
  { value: 'PIX', label: 'PIX' },
  { value: 'Cartão de Crédito', label: 'Cartão de Crédito' },
  { value: 'Cartão de Débito', label: 'Cartão de Débito' },
  { value: 'Dinheiro', label: 'Dinheiro' },
];

export const ORDER_STATUS: Option[] = [
  { value: 'received', label: 'Recebido', color: colors.azul, bg: colors.azulSuave },
  { value: 'preparing', label: 'Em preparo', color: colors.lavanda, bg: colors.lavandaSuave },
  { value: 'ready', label: 'Pronto', color: colors.pistache, bg: colors.pistacheSuave },
  { value: 'delivered', label: 'Entregue', color: colors.caramelo, bg: colors.carameloSuave },
];

export const PAYMENT_STATUS: Option[] = [
  { value: 'pending', label: 'Pendente', color: colors.caramelo, bg: colors.carameloSuave },
  { value: 'paid', label: 'Pago', color: colors.pistache, bg: colors.pistacheSuave },
  { value: 'canceled', label: 'Cancelado', color: colors.perigo, bg: colors.perigoSuave },
  { value: 'refunded', label: 'Estornado', color: colors.lavanda, bg: colors.lavandaSuave },
];

export const fmtDate = (v: unknown) => isoToBr(v) || 'Sem data';
export const orderCode = (r: Row) => shortId(r.id);
export const byDateDesc = (a: Row, b: Row) => String(b.date ?? '').localeCompare(String(a.date ?? ''));
export const byName = (a: Row, b: Row) => String(a.name ?? '').localeCompare(String(b.name ?? ''), 'pt-BR');

export const itemsSummary = (items: any) =>
  (Array.isArray(items) ? items : []).map((i) => `${i.quantity ?? i.amount ?? 1}× ${i.product?.name ?? (i.produtoId_REF ? `Produto ${shortId(String(i.produtoId_REF))}` : 'Produto')}`).join(', ');

export const compact = (rows: [string, unknown][]): [string, string][] =>
  rows.filter(([, v]) => v !== undefined && v !== null && String(v).trim() !== '').map(([k, v]) => [k, String(v)]);

export const statusBadge = (options: Option[]) => (r: Row) => {
  const v = String(r.status ?? '').toLowerCase();
  const o = options.find((x) => x.value === v || x.label.toLowerCase() === v);
  return o
    ? { label: o.label, color: o.color!, bg: o.bg! }
    : r.status
      ? { label: String(r.status), color: colors.textoSuave, bg: colors.linha }
      : null;
};
