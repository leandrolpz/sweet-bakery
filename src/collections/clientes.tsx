import { colors } from '@/src/constants/theme';
import type { CollectionDef } from './types';
import { byName, compact } from './shared';

export const clientes: CollectionDef = {
  key: 'clientes',
  label: 'Clientes',
  singular: 'cliente',
  emoji: 'clients',
  description: 'Quem compra na sua confeitaria',
  feminine: false,
  sort: byName,
  fields: [
    { key: 'name', label: 'Nome completo', type: 'text', required: true, placeholder: 'Ex.: Ana Beatriz Silva', capitalize: 'words' },
    { key: 'email', label: 'E-mail', type: 'email', placeholder: 'ana@email.com', half: true },
    { key: 'phone', label: 'Telefone', type: 'phone', placeholder: '(11) 99999-9999', half: true },
    { key: 'address', label: 'Endereço', type: 'textarea', placeholder: 'Rua, número, bairro, cidade', hint: 'Usado para preencher a entrega dos pedidos.' },
  ],
  list: {
    title: (r) => r.name || 'Sem nome',
    subtitle: (r) => r.email || r.phone || '',
    thumb: () => ({ emoji: 'clients', bg: colors.morangoSuave, color: colors.morango }),
    details: (r) => compact([['Telefone', r.phone], ['E-mail', r.email], ['Endereço', r.address]]),
  },
};
