import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, fonts, radius } from '@/src/constants/theme';
import type { CollectionDef, ListCtx, Row } from '@/src/collections/types';
import { useCollection } from '@/src/hooks/useCollection';
import { useLayout } from '@/src/hooks/useLayout';
import { deleteRecord } from '@/src/services/firestore';
import { capitalize, norm } from '@/src/utils/format';
import { CollectionTabs } from './CollectionTabs';
import { useConfirm, useToast } from './Feedback';
import { Box, Chip } from './inputs';
import { Badge, Banner, Card, EmptyState, Loading, PageHeader, Thumb } from './ui/blocks';
import { Button } from './ui/Button';
import { T } from './ui/Text';

/** Tela LISTAR / ALTERAR / EXCLUIR de uma collection. */
export function CrudList({ def }: { def: CollectionDef }) {
  const router = useRouter();
  const toast = useToast();
  const confirm = useConfirm();
  const { contentWidth } = useLayout();

  const { rows, loading, error } = useCollection(def.key);
  // Hooks não podem ser condicionais; sem lookup, reaproveitamos a própria collection (o Firestore compartilha o listener).
  const l1 = useCollection(def.lookups?.[0] ?? def.key);
  const ctx: ListCtx = { lookups: def.lookups?.[0] ? { [def.lookups[0]]: l1.rows } : {} };

  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const visible = useMemo(() => {
    const term = norm(q);
    const list = rows.filter((r) => {
      if (def.filter && statusFilter !== 'all') {
        const v = String(r[def.filter.key] ?? '').toLowerCase();
        const o = def.filter.options.find((x) => x.value === statusFilter);
        if (v !== statusFilter && v !== o?.label.toLowerCase()) return false;
      }
      if (!term) return true;
      const text = [
        def.list.title(r, ctx), def.list.subtitle?.(r, ctx), ...(def.list.details?.(r, ctx) ?? []).map(([, v]) => v),
      ].join(' ');
      return norm(text).includes(term);
    });
    return def.sort ? [...list].sort(def.sort) : list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, q, statusFilter, l1.rows]);

  const cols = contentWidth >= 1000 ? 3 : contentWidth >= 620 ? 2 : 1;
  const done = def.feminine ? 'excluída' : 'excluído';

  async function onDelete(row: Row) {
    let warning: string | null = null;
    try { warning = def.deleteWarning ? await def.deleteWarning(row) : null; } catch { /* segue sem aviso */ }
    const ok = await confirm({
      title: `Excluir ${def.singular}?`,
      message: `${def.list.title(row, ctx)}\n\n${warning ? `${warning}\n\n` : ''}Esta ação não pode ser desfeita.`,
      confirmLabel: 'Sim, excluir',
      danger: true,
    });
    if (!ok) return;
    try {
      await deleteRecord(def.key, row.id);
      toast.success(`${capitalize(def.singular)} ${done}.`);
    } catch {
      toast.error('Não foi possível excluir. Verifique a conexão e tente de novo.');
    }
  }

  const newButton = (
    <Button label={`Cadastrar ${def.singular}`} icon="＋" onPress={() => router.push(`/${def.key}/novo` as any)} />
  );

  return (
    <View>
      <PageHeader
        title={def.label}
        subtitle={loading ? 'Carregando…' : `${rows.length} ${rows.length === 1 ? 'registro' : 'registros'} cadastrados`}
      />
      <CollectionTabs def={def} />

      {error ? (
        <Banner>Não foi possível carregar os dados: {error}</Banner>
      ) : loading ? (
        <Loading />
      ) : rows.length === 0 ? (
        <Card>
          <EmptyState
            emoji={def.emoji}
            title={`Nenhum${def.feminine ? 'a' : ''} ${def.singular} cadastrad${def.feminine ? 'a' : 'o'}`}
            text={`Comece cadastrando ${def.feminine ? 'a primeira' : 'o primeiro'} ${def.singular}. ${def.description}.`}
          >
            {newButton}
          </EmptyState>
        </Card>
      ) : (
        <>
          <View style={s.tools}>
            <View style={{ flex: 1, minWidth: 220 }}>
              <Box
                value={q}
                onChangeText={setQ}
                placeholder={`Buscar ${def.label.toLowerCase()}…`}
                autoCorrect={false}
                accessibilityLabel="Buscar"
                prefix="🔍"
              />
            </View>
          </View>

          {def.filter ? (
            <View style={s.chips}>
              <Chip label="Todos" selected={statusFilter === 'all'} onPress={() => setStatusFilter('all')} />
              {def.filter.options.map((o) => (
                <Chip key={o.value} label={o.label} emoji={o.emoji} selected={statusFilter === o.value} onPress={() => setStatusFilter(o.value)} />
              ))}
            </View>
          ) : null}

          {visible.length === 0 ? (
            <Card>
              <EmptyState emoji="🔎" title="Nada encontrado" text="Tente outra palavra ou limpe os filtros.">
                <Button label="Limpar busca" variant="secondary" onPress={() => { setQ(''); setStatusFilter('all'); }} />
              </EmptyState>
            </Card>
          ) : (
            <View style={[s.grid, { marginHorizontal: -8 }]}>
              {visible.map((row) => {
                const badge = def.list.badge?.(row);
                const details = def.list.details?.(row, ctx) ?? [];
                const value = def.list.value?.(row);
                const subtitle = def.list.subtitle?.(row, ctx);
                return (
                  <View key={row.id} style={{ width: `${100 / cols}%`, padding: 8 }}>
                    <Card style={s.card}>
                      <View style={s.top}>
                        <Thumb thumb={def.list.thumb?.(row, ctx) ?? { emoji: def.emoji }} />
                        <View style={{ flex: 1, gap: 2 }}>
                          <T v="heading" numberOfLines={2}>{def.list.title(row, ctx)}</T>
                          {subtitle ? <T v="small" color={colors.textoSuave} numberOfLines={2}>{subtitle}</T> : null}
                        </View>
                        {value ? <T v="heading" color={colors.morango}>{value}</T> : null}
                      </View>

                      {badge ? <Badge {...badge} /> : null}

                      {details.length > 0 ? (
                        <View style={s.details}>
                          {details.map(([k, v]) => (
                            <T key={k} v="small" color={colors.textoSuave} numberOfLines={3}>
                              <T v="small" color={colors.texto} style={{ fontFamily: fonts.bodyBold }}>{k}: </T>
                              {v}
                            </T>
                          ))}
                        </View>
                      ) : null}

                      <View style={s.actions}>
                        <Button
                          label="Alterar"
                          icon="✏️"
                          size="sm"
                          variant="secondary"
                          style={{ flex: 1 }}
                          onPress={() => router.push(`/${def.key}/editar/${row.id}` as any)}
                        />
                        <Button label="Excluir" icon="🗑️" size="sm" variant="danger" style={{ flex: 1 }} onPress={() => onDelete(row)} />
                      </View>
                    </Card>
                  </View>
                );
              })}
            </View>
          )}
        </>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  tools: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 4 },
  card: { flex: 1, gap: 12, borderRadius: radius.lg },
  top: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  details: { gap: 4, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.linha },
  actions: { flexDirection: 'row', gap: 8, marginTop: 'auto' },
});
