import { View } from 'react-native';
import { T } from '@/src/components/ui/Text';
import { colors, radius } from '@/src/constants/theme';
import { safeColor, validateHex } from '@/src/utils/format';
import { countWhere } from '@/src/services/firestore';
import type { CollectionDef } from './types';
import { byName, compact } from './shared';

const TEXT_COLORS = ['#C92F60', '#6B4FA3', '#2F6FB2', '#2E7D5B', '#8F5E0F', '#4E2C32'];
const BG_COLORS = ['#FFE3EB', '#ECE4FA', '#DCEBFA', '#DDF3E5', '#FFEBC7', '#FFF1E6'];

export const categorias: CollectionDef = {
  key: 'categorias',
  label: 'Categorias',
  singular: 'categoria',
  emoji: 'category',
  description: 'Organize o cardápio em grupos',
  feminine: true,
  sort: byName,
  fields: [
    { key: 'name', label: 'Nome da categoria', type: 'text', required: true, placeholder: 'Ex.: Bolos', capitalize: 'words' },
  ],
  list: {
    title: (r) => r.name || 'Sem nome',
    thumb: () => ({ emoji: 'category', bg: colors.morangoSuave, color: colors.morango }),
  },
  deleteWarning: async (row) => {
    const n = await countWhere('produtos', 'categoryId_REF', row.id);
    return n > 0 ? `Atenção: ${n} produto${n > 1 ? 's usam' : ' usa'} esta categoria e ficará${n > 1 ? 'ão' : ''} sem categoria.` : null;
  },
};
