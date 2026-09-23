import { colors } from '@/src/constants/theme';
import { money } from '@/src/utils/format';
import type { CollectionDef } from './types';
import { byName, compact } from './shared';

export const produtos: CollectionDef = {
  key: 'produtos',
  label: 'Produtos',
  singular: 'produto',
  emoji: '🍰',
  description: 'Bolos, doces e tortas à venda',
  feminine: false,
  sort: byName,
  lookups: ['categorias'],
  fields: [
    { key: 'name', label: 'Nome do produto', type: 'text', required: true, placeholder: 'Ex.: Bolo de cenoura com chocolate', capitalize: 'words' },
    {
      key: 'categoryId', label: 'Categoria', type: 'relation', required: true, half: true, placeholder: 'Escolha a categoria',
      relation: { collection: 'categorias', label: (r) => r.name ?? 'Sem nome', emoji: (r) => r.icon ?? '🏷️' },
    },
    { key: 'price', label: 'Preço', type: 'money', required: true, half: true, min: 0 },
    { key: 'description', label: 'Descrição', type: 'textarea', placeholder: 'Conte o que torna esse doce especial' },
    { key: 'ingredients', label: 'Ingredientes', type: 'textarea', placeholder: 'Farinha, ovos, chocolate…' },
    { key: 'image', label: 'Foto', type: 'image', hint: 'Cole o link (URL) de uma foto do produto.' },
    { key: 'rating', label: 'Avaliação (0 a 5)', type: 'number', half: true, min: 0, max: 5, defaultValue: () => '0' },
    { key: 'reviews', label: 'Nº de avaliações', type: 'number', half: true, min: 0, defaultValue: () => '0' },
    { key: 'bestseller', label: 'Mais vendido', type: 'boolean', hint: 'Destaca o produto como campeão de vendas.' },
  ],
  list: {
    title: (r) => r.name || 'Sem nome',
    subtitle: (r, ctx) => {
      const c = ctx.lookups.categorias?.find((x) => x.id === r.categoryId);
      return c ? `${c.icon ?? ''} ${c.name}`.trim() : 'Sem categoria';
    },
    thumb: (r, ctx) => {
      const c = ctx.lookups.categorias?.find((x) => x.id === r.categoryId);
      return { imageUrl: /^https?:\/\//i.test(r.image ?? '') ? r.image : undefined, emoji: c?.icon ?? '🍰' };
    },
    value: (r) => money(r.price),
    badge: (r) => (r.bestseller ? { label: '⭐ Mais vendido', color: colors.caramelo, bg: colors.carameloSuave } : null),
    details: (r) =>
      compact([
        ['Descrição', r.description],
        ['Ingredientes', r.ingredients],
        ['Avaliação', Number(r.reviews) > 0 ? `⭐ ${String(r.rating).replace('.', ',')} (${r.reviews} avaliações)` : ''],
      ]),
  },
};
