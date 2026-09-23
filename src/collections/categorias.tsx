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
  emoji: '🏷️',
  description: 'Organize o cardápio em grupos',
  feminine: true,
  sort: byName,
  fields: [
    { key: 'name', label: 'Nome da categoria', type: 'text', required: true, placeholder: 'Ex.: Bolos', capitalize: 'words' },
    {
      key: 'icon', label: 'Ícone', type: 'emoji', required: true, defaultValue: () => '🍰',
      suggestions: ['🍰', '🧁', '🎂', '🍩', '🍪', '🥧', '🍫', '🍮', '🥐', '🍓', '🍬', '🍨'],
    },
    { key: 'color', label: 'Cor do texto', type: 'color', required: true, half: true, palette: TEXT_COLORS, defaultValue: () => TEXT_COLORS[0], validate: validateHex },
    { key: 'bgColor', label: 'Cor de fundo', type: 'color', required: true, half: true, palette: BG_COLORS, defaultValue: () => BG_COLORS[0], validate: validateHex },
  ],
  formPreview: (f) => (
    <View
      style={{
        flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: radius.lg,
        backgroundColor: safeColor(f.bgColor, colors.morangoSuave),
      }}
    >
      <T style={{ fontSize: 32, lineHeight: 40 }}>{f.icon || '🍰'}</T>
      <T v="heading" color={safeColor(f.color, colors.morango)}>{f.name || 'Nome da categoria'}</T>
    </View>
  ),
  list: {
    title: (r) => r.name || 'Sem nome',
    thumb: (r) => ({ emoji: r.icon, bg: safeColor(r.bgColor, colors.morangoSuave) }),
    details: (r) => compact([['Cor do texto', r.color], ['Cor de fundo', r.bgColor]]),
  },
  deleteWarning: async (row) => {
    const n = await countWhere('produtos', 'categoryId', row.id);
    return n > 0 ? `Atenção: ${n} produto${n > 1 ? 's usam' : ' usa'} esta categoria e ficará${n > 1 ? 'ão' : ''} sem categoria.` : null;
  },
};
