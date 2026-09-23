import { countWhere } from '@/src/services/firestore';
import { money, todayBr } from '@/src/utils/format';
import type { CollectionDef } from './types';
import {
  byDateDesc, compact, fmtDate, itemsSummary, orderCode, ORDER_STATUS, PAYMENT_METHODS, statusBadge,
} from './shared';

export const pedidos: CollectionDef = {
  key: 'pedidos',
  label: 'Pedidos',
  singular: 'pedido',
  emoji: '📋',
  description: 'Encomendas e entregas',
  feminine: false,
  sort: byDateDesc,
  filter: { key: 'status', options: ORDER_STATUS },
  fields: [
    { key: 'items', label: 'Itens do pedido', type: 'orderItems', required: true },
    { key: 'total', label: 'Total', type: 'money', hidden: true },
    { key: 'status', label: 'Situação do pedido', type: 'select', required: true, options: ORDER_STATUS, defaultValue: () => 'received' },
    { key: 'paymentMethod', label: 'Forma de pagamento', type: 'select', required: true, options: PAYMENT_METHODS, defaultValue: () => 'PIX' },
    { key: 'date', label: 'Data do pedido', type: 'date', required: true, half: true, defaultValue: todayBr },
    {
      key: 'address', label: 'Endereço de entrega', type: 'textarea', required: true, placeholder: 'Rua, número, bairro, cidade',
      fill: {
        collection: 'clientes', buttonLabel: 'Usar endereço de um cliente',
        label: (r) => r.name ?? 'Sem nome', apply: (r) => r.address ?? '',
      },
    },
  ],
  list: {
    title: (r) => `Pedido ${orderCode(r)}`,
    subtitle: (r) => {
      const n = Array.isArray(r.items) ? r.items.length : 0;
      return `${fmtDate(r.date)} · ${n} ${n === 1 ? 'item' : 'itens'}`;
    },
    thumb: () => ({ emoji: '🧾' }),
    value: (r) => money(r.total),
    badge: statusBadge(ORDER_STATUS),
    details: (r) => compact([['Itens', itemsSummary(r.items)], ['Pagamento', r.paymentMethod], ['Entrega', r.address]]),
  },
  deleteWarning: async (row) => {
    const n = await countWhere('pagamentos', 'orderId', row.id);
    return n > 0 ? `Atenção: existe${n > 1 ? 'm' : ''} ${n} pagamento${n > 1 ? 's' : ''} ligado${n > 1 ? 's' : ''} a este pedido.` : null;
  },
};
