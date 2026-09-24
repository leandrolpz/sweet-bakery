import { countWhere } from '@/src/services/firestore';
import { colors } from '@/src/constants/theme';
import { money, todayBr } from '@/src/utils/format';
import { auth } from '@/src/services/firebase';
import type { CollectionDef } from './types';
import {
  byDateDesc, compact, fmtDate, itemsSummary, orderCode, ORDER_STATUS, statusBadge,
} from './shared';

export const pedidos: CollectionDef = {
  key: 'pedidos',
  label: 'Pedidos',
  singular: 'pedido',
  emoji: 'orders',
  description: 'Encomendas e entregas',
  feminine: false,
  sort: byDateDesc,
  filter: { key: 'status', options: ORDER_STATUS },
  fields: [
    { key: 'items', label: 'Itens do pedido', type: 'orderItems', required: true },
    { key: 'clienteId_REF', label: 'Cliente', type: 'relation', required: true, placeholder: 'Escolha o cliente', relation: { collection: 'clientes', label: (r) => r.name ?? 'Sem nome' } },
    { key: 'userId_REF', label: 'Funcionário', type: 'text', hidden: true, defaultValue: () => auth.currentUser?.uid ?? '' },
    { key: 'total', label: 'Total', type: 'money', hidden: true },
    { key: 'status', label: 'Situação do pedido', type: 'select', required: true, options: ORDER_STATUS, defaultValue: () => 'received' },
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
    thumb: () => ({ emoji: 'orders', bg: colors.carameloSuave, color: colors.caramelo }),
    value: (r) => money(r.total),
    badge: statusBadge(ORDER_STATUS),
    details: (r) => compact([['Cliente', r.clienteId_REF], ['Itens', itemsSummary(r.items)], ['Entrega', r.address]]),
  },
  deleteWarning: async (row) => {
    const n = await countWhere('pagamentos', 'orderId_REF', row.id);
    return n > 0 ? `Atenção: existe${n > 1 ? 'm' : ''} ${n} pagamento${n > 1 ? 's' : ''} ligado${n > 1 ? 's' : ''} a este pedido.` : null;
  },
};
