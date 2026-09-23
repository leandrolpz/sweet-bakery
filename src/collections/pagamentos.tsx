import { money, todayBr } from '@/src/utils/format';
import type { CollectionDef } from './types';
import { byDateDesc, compact, fmtDate, orderCode, PAYMENT_METHODS, PAYMENT_STATUS, statusBadge } from './shared';

export const pagamentos: CollectionDef = {
  key: 'pagamentos',
  label: 'Pagamentos',
  singular: 'pagamento',
  emoji: '💳',
  description: 'Recebimentos de cada pedido',
  feminine: false,
  sort: byDateDesc,
  filter: { key: 'status', options: PAYMENT_STATUS },
  fields: [
    {
      key: 'orderId', label: 'Pedido', type: 'relation', required: true, placeholder: 'Escolha o pedido',
      relation: {
        collection: 'pedidos',
        label: (r) => `Pedido ${orderCode(r)} · ${money(r.total)}`,
        sublabel: (r) => fmtDate(r.date),
        emoji: () => '🧾',
        // Ao escolher o pedido, já sugere valor e forma de pagamento (só em cadastro novo).
        onPick: (r, { isEdit }) =>
          isEdit ? {} : { amount: String(r.total ?? '').replace('.', ','), method: r.paymentMethod ?? '' },
      },
    },
    {
      key: 'client', label: 'Cliente', type: 'text', placeholder: 'Nome do cliente', capitalize: 'words',
      fill: {
        collection: 'clientes', buttonLabel: 'Escolher cliente cadastrado',
        label: (r) => r.name ?? 'Sem nome', apply: (r) => r.name ?? '',
      },
    },
    { key: 'amount', label: 'Valor pago', type: 'money', required: true, half: true, min: 0 },
    { key: 'date', label: 'Data do pagamento', type: 'date', required: true, half: true, defaultValue: todayBr },
    { key: 'method', label: 'Forma de pagamento', type: 'select', required: true, options: PAYMENT_METHODS, defaultValue: () => 'PIX' },
    { key: 'status', label: 'Situação', type: 'select', required: true, options: PAYMENT_STATUS, defaultValue: () => 'pending' },
  ],
  list: {
    title: (r) => r.client || 'Cliente não informado',
    subtitle: (r) => `${fmtDate(r.date)}${r.orderId ? ` · Pedido ${orderCode({ id: String(r.orderId) })}` : ''}`,
    thumb: () => ({ emoji: '💳' }),
    value: (r) => money(r.amount),
    badge: statusBadge(PAYMENT_STATUS),
    details: (r) => compact([['Forma de pagamento', r.method]]),
  },
};
