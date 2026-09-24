import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors, radius } from '@/src/constants/theme';
import type { FieldDef, Row } from '@/src/collections/types';
import { useCollection } from '@/src/hooks/useCollection';
import { money, numberToInput, parseNumber, round2 } from '@/src/utils/format';
import { Box, FieldShell, SelectModal } from './inputs';
import { Button } from './ui/Button';
import { Thumb } from './ui/blocks';
import { T } from './ui/Text';

export type OrderItem = { product: Row; quantity: number; notes?: string };

/**
 * Montagem do pedido: escolhe produtos, quantidade e observação.
 * O total (itens + entrega) é calculado aqui e devolvido junto com os itens.
 */
export function OrderItemsField({
  field, items, total, error, isEdit, onChange,
}: {
  field: FieldDef;
  items: OrderItem[];
  total: unknown;
  error?: string;
  isEdit: boolean;
  onChange: (items: OrderItem[], total: number) => void;
}) {
  const { rows: products, loading } = useCollection('produtos');
  const [picker, setPicker] = useState(false);

  const productFor = (item: OrderItem) => item.product ?? products.find((product) => product.id === (item as any).produtoId_REF);
  const quantityFor = (item: OrderItem) => Number((item as any).quantity ?? (item as any).amount ?? 1);
  const sum = (list: OrderItem[]) =>
    round2(list.reduce((acc, i) => acc + (Number(productFor(i)?.price ?? (i as any).price) || 0) * quantityFor(i), 0));
  const subtotal = sum(items);

  // Pedido novo: taxa de entrega padrão R$ 8,00 (a mesma do app original).
  // Pedido existente: taxa = o que sobra do total depois dos itens.
  const [fee, setFee] = useState(() =>
    isEdit ? numberToInput(round2(Math.max(0, (parseNumber(total) ?? 0) - subtotal))) : '8',
  );
  const feeNum = parseNumber(fee) ?? 0;

  const commit = (next: OrderItem[], f = feeNum) => onChange(next, round2(sum(next) + f));

  const add = (p: Row) => {
    const i = items.findIndex((x) => x.product?.id === p.id);
    commit(
      i >= 0
        ? items.map((x, k) => (k === i ? { ...x, quantity: x.quantity + 1 } : x))
        : [...items, { product: p, quantity: 1, notes: '' }],
    );
    setPicker(false);
  };
  const setQty = (i: number, q: number) => commit(items.map((x, k) => (k === i ? { ...x, quantity: Math.max(1, q) } : x)));
  const setNotes = (i: number, notes: string) => onChange(items.map((x, k) => (k === i ? { ...x, notes } : x)), round2(subtotal + feeNum));
  const remove = (i: number) => commit(items.filter((_, k) => k !== i));

  return (
    <FieldShell field={field} error={error}>
      <View style={{ gap: 10 }}>
        {items.length === 0 ? (
          <View style={s.empty}>
            <T v="heading" color={colors.morango}>Nenhum item</T>
            <T color={colors.textoSuave} style={{ textAlign: 'center' }}>
              Nenhum produto neste pedido ainda.
            </T>
          </View>
        ) : (
            items.map((it, i) => {
              const product = productFor(it);
              const quantity = quantityFor(it);
              return (
            <View key={`${product?.id ?? (it as any).produtoId_REF ?? i}`} style={s.item}>
              <View style={s.itemTop}>
                <Thumb
                  size={48}
                  thumb={{ imageUrl: product?.image?.startsWith?.('http') ? product.image : undefined, text: 'P' }}
                />
                <View style={{ flex: 1 }}>
                  <T v="bodyStrong">{product?.name ?? 'Produto'}</T>
                  <T v="small" color={colors.textoSuave}>{money(product?.price ?? (it as any).price)} cada</T>
                </View>
                <Pressable
                  onPress={() => remove(i)}
                  accessibilityRole="button"
                  accessibilityLabel={`Remover ${product?.name ?? 'produto'}`}
                  style={s.remove}
                >
                  <T v="label" color={colors.perigo}>Remover</T>
                </Pressable>
              </View>

              <View style={s.itemMid}>
                <View style={s.stepper}>
                  <Pressable onPress={() => setQty(i, quantity - 1)} accessibilityRole="button" accessibilityLabel="Diminuir quantidade" style={s.stepBtn}>
                    <T v="heading">−</T>
                  </Pressable>
                  <T v="heading" style={{ minWidth: 28, textAlign: 'center' }}>{quantity}</T>
                  <Pressable onPress={() => setQty(i, quantity + 1)} accessibilityRole="button" accessibilityLabel="Aumentar quantidade" style={s.stepBtn}>
                    <T v="heading">+</T>
                  </Pressable>
                </View>
                <T v="heading" color={colors.morango}>{money((Number(product?.price ?? (it as any).price) || 0) * quantity)}</T>
              </View>

              <Box
                value={it.notes ?? ''}
                onChangeText={(t) => setNotes(i, t)}
                placeholder='Observação (ex.: escrever "Parabéns!")'
                style={{ fontSize: 14 }}
              />
            </View>
              );
            })
        )}

        <Button label="Adicionar produto" icon="add" variant="secondary" onPress={() => setPicker(true)} />

        <View style={s.totals}>
          <View style={s.line}>
            <T color={colors.textoSuave}>Subtotal dos itens</T>
            <T v="bodyStrong">{money(subtotal)}</T>
          </View>
          <View style={s.line}>
            <T color={colors.textoSuave}>Taxa de entrega</T>
            <View style={{ width: 130 }}>
              <Box
                prefix="R$"
                value={fee}
                keyboardType="decimal-pad"
                onChangeText={(t) => { setFee(t); commit(items, parseNumber(t) ?? 0); }}
                accessibilityLabel="Taxa de entrega"
              />
            </View>
          </View>
          <View style={[s.line, s.totalLine]}>
            <T v="heading">Total do pedido</T>
            <T v="title" color={colors.morango}>{money(round2(subtotal + feeNum))}</T>
          </View>
        </View>
      </View>

      <SelectModal
        visible={picker}
        title="Adicionar produto"
        loading={loading}
        emptyText="Nenhum produto cadastrado. Cadastre produtos primeiro."
        options={products.map((p) => ({ value: p.id, label: p.name ?? 'Sem nome', sublabel: money(p.price) }))}
        onSelect={(o) => { const p = products.find((x) => x.id === o.value); if (p) add(p); }}
        onClose={() => setPicker(false)}
      />
    </FieldShell>
  );
}

const s = StyleSheet.create({
  empty: {
    alignItems: 'center', gap: 4, padding: 20, borderRadius: radius.md,
    borderWidth: 1.5, borderStyle: 'dashed', borderColor: colors.campo,
  },
  item: { borderWidth: 1, borderColor: colors.linha, borderRadius: radius.md, padding: 12, gap: 10, backgroundColor: colors.chantilly },
  itemTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  itemMid: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  remove: { paddingHorizontal: 8, minHeight: 40, justifyContent: 'center' },
  stepper: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.superficie,
    borderRadius: radius.pill, borderWidth: 1.5, borderColor: colors.campo,
  },
  stepBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  totals: { backgroundColor: colors.chantilly, borderRadius: radius.md, padding: 14, gap: 10, borderWidth: 1, borderColor: colors.linha },
  line: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  totalLine: { borderTopWidth: 1, borderTopColor: colors.linha, paddingTop: 12 },
});
