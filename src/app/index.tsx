import { Link } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { COLLECTIONS } from '@/src/collections';
import { Card, PageHeader } from '@/src/components/ui/blocks';
import { Button } from '@/src/components/ui/Button';
import { T } from '@/src/components/ui/Text';
import { colors, radius } from '@/src/constants/theme';
import { useCollection } from '@/src/hooks/useCollection';
import { useLayout } from '@/src/hooks/useLayout';
import { money } from '@/src/utils/format';

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Bom dia!' : h < 18 ? 'Boa tarde!' : 'Boa noite!';
}

function Stat({ emoji, value, label }: { emoji: string; value: string; label: string }) {
  return (
    <View style={s.stat}>
      <T style={{ fontSize: 26, lineHeight: 32 }}>{emoji}</T>
      <View>
        <T v="heading" color={colors.morangoEscuro} style={{ fontSize: 24, lineHeight: 30 }}>{value}</T>
        <T v="small" color={colors.textoSuave}>{label}</T>
      </View>
    </View>
  );
}

function CollectionCard({ def, count }: { def: (typeof COLLECTIONS)[number]; count?: number }) {
  return (
    <Card style={{ flex: 1, gap: 14 }}>
      <View style={s.cardTop}>
        <View style={s.cardIcon}><T style={{ fontSize: 28, lineHeight: 34 }}>{def.emoji}</T></View>
        <View style={{ flex: 1 }}>
          <T v="heading">{def.label}</T>
          <T v="small" color={colors.textoSuave}>{def.description}</T>
        </View>
        <View style={{ alignItems: 'center' }}>
          <T v="heading" color={colors.morango} style={{ fontSize: 24, lineHeight: 30 }}>{count ?? '–'}</T>
        </View>
      </View>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Link href={`/${def.key}/novo` as any} asChild>
          <Button label="Cadastrar" icon="＋" size="sm" style={{ flex: 1 }} />
        </Link>
        <Link href={`/${def.key}` as any} asChild>
          <Button label="Listar" icon="📋" size="sm" variant="secondary" style={{ flex: 1 }} />
        </Link>
      </View>
    </Card>
  );
}

export default function Home() {
  const { contentWidth } = useLayout();
  const cols = contentWidth >= 1000 ? 3 : contentWidth >= 620 ? 2 : 1;

  const categorias = useCollection('categorias');
  const produtos = useCollection('produtos');
  const clientes = useCollection('clientes');
  const pedidos = useCollection('pedidos');
  const pagamentos = useCollection('pagamentos');
  const counts: Record<string, number | undefined> = {
    categorias: categorias.loading ? undefined : categorias.rows.length,
    produtos: produtos.loading ? undefined : produtos.rows.length,
    clientes: clientes.loading ? undefined : clientes.rows.length,
    pedidos: pedidos.loading ? undefined : pedidos.rows.length,
    pagamentos: pagamentos.loading ? undefined : pagamentos.rows.length,
  };

  const revenue = pedidos.rows.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const open = pedidos.rows.filter((o) => String(o.status).toLowerCase() !== 'delivered').length;

  return (
    <View>
      <PageHeader title={greeting()} subtitle="O que vamos adoçar hoje? Escolha um cadastro para começar." />

      <View style={s.stats}>
        <Stat emoji="💰" value={money(revenue)} label="Total em pedidos" />
        <Stat emoji="⏳" value={String(open)} label="Pedidos em andamento" />
        <Stat emoji="🍰" value={String(produtos.rows.length)} label="Produtos no cardápio" />
      </View>

      <T v="title" style={{ marginTop: 28, marginBottom: 12 }}>Seus cadastros</T>
      <View style={[s.grid, { marginHorizontal: -8 }]}>
        {COLLECTIONS.map((c) => (
          <View key={c.key} style={{ width: `${100 / cols}%`, padding: 8 }}>
            <CollectionCard def={c} count={counts[c.key]} />
          </View>
        ))}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  stats: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  stat: {
    flexGrow: 1, flexBasis: 150, flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14,
    borderRadius: radius.lg, backgroundColor: colors.morangoSuave,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  cardIcon: { width: 52, height: 52, borderRadius: 16, backgroundColor: colors.morangoSuave, alignItems: 'center', justifyContent: 'center' },
});
