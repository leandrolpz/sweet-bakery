import { money, todayBr } from '@/src/utils/format';
import { colors } from '@/src/constants/theme';
import type { CollectionDef } from './types';
import { byDateDesc, compact, fmtDate, orderCode, PAYMENT_METHODS, PAYMENT_STATUS, statusBadge } from './shared';

export const pagamentos: CollectionDef = {
  key: 'pagamentos',
  label: 'Pagamentos',
  singular: 'pagamento',
  emoji: 'payments',
  description: 'Recebimentos de cada pedido',
  feminine: false,
  sort: byDateDesc,
  filter: { key: 'status', options: PAYMENT_STATUS },
  fields: [
    {
      key: 'orderId_REF', label: 'Pedido', type: 'relation', required: true, placeholder: 'Escolha o pedido',
      relation: {
        collection: 'pedidos',
        label: (r) => `Pedido ${orderCode(r)} · ${money(r.total)}`,
        sublabel: (r) => fmtDate(r.date),
        onPick: () => ({}),
      },
    },
    { key: 'date', label: 'Data do pagamento', type: 'date', required: true, half: true, defaultValue: todayBr },
    { key: 'method', label: 'Forma de pagamento', type: 'select', required: true, options: PAYMENT_METHODS, defaultValue: () => 'PIX' },
    { key: 'status', label: 'Situação', type: 'select', required: true, options: PAYMENT_STATUS, defaultValue: () => 'pending' },
  ],
  list: {
    title: (r) => r.client || 'Cliente não informado',
    subtitle: (r) => `${fmtDate(r.date)}${r.orderId_REF ? ` · Pedido ${orderCode({ id: String(r.orderId_REF) })}` : ''}`,
    thumb: () => ({ emoji: 'payments', bg: colors.azulSuave, color: colors.azul }),
    badge: statusBadge(PAYMENT_STATUS),
    details: (r) => compact([['Forma de pagamento', r.method]]),
  },
};
