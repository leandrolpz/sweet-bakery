import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { COLLECTIONS } from '@/src/collections';
import { Card, PageHeader } from '@/src/components/ui/blocks';
import { Button } from '@/src/components/ui/Button';
import { Icon } from '@/src/components/ui/Icon';
import { T } from '@/src/components/ui/Text';
import { colors, radius } from '@/src/constants/theme';
import { useCollection } from '@/src/hooks/useCollection';
import { useLayout } from '@/src/hooks/useLayout';
import { money } from '@/src/utils/format';

function Stat({ icon, value, label }: { icon: 'schedule' | 'cake'; value: string; label: string }) {
  return <View style={s.stat}><Icon name={icon} size={25} /><View><T v="heading" color={colors.morangoEscuro} style={{ fontSize: 24, lineHeight: 30 }}>{value}</T><T v="small" color={colors.textoSuave}>{label}</T></View></View>;
}

export default function Painel() {
  const { contentWidth } = useLayout();
  const cols = contentWidth >= 1000 ? 3 : contentWidth >= 620 ? 2 : 1;
  const produtos = useCollection('produtos');
  const pedidos = useCollection('pedidos');
  const open = pedidos.rows.filter((order) => String(order.status).toLowerCase() !== 'delivered').length;

  return <View><View style={s.stats}><Stat icon="schedule" value={String(open)} label="Pedidos em andamento" /><Stat icon="cake" value={String(produtos.rows.length)} label="Produtos no cardápio" /></View><T v="title" style={{ marginTop: 28, marginBottom: 12 }}>Seus cadastros</T><View style={s.grid}>{COLLECTIONS.map((collection) => <View key={collection.key} style={{ width: `${100 / cols}%`, padding: 8 }}><Card style={{ gap: 14 }}><View style={s.cardTop}><View style={s.cardIcon}><Icon name={collection.emoji as any} size={26} /></View><View style={{ flex: 1 }}><T v="heading">{collection.label}</T><T v="small" color={colors.textoSuave}>{collection.description}</T></View></View><View style={{ flexDirection: 'row', gap: 8 }}><Link href={`/${collection.key}/novo` as any} asChild><Button label="Cadastrar" icon="add" size="sm" style={{ flex: 1 }} /></Link><Link href={`/${collection.key}` as any} asChild><Button label="Listar" icon="edit" size="sm" variant="secondary" style={{ flex: 1 }} /></Link></View></Card></View>)}</View></View>;
}

const s = StyleSheet.create({ stats: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 }, stat: { flexGrow: 1, flexBasis: 150, flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: radius.lg, backgroundColor: colors.morangoSuave }, grid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -8 }, cardTop: { flexDirection: 'row', alignItems: 'center', gap: 12 }, cardIcon: { width: 52, height: 52, borderRadius: 16, backgroundColor: colors.morangoSuave, alignItems: 'center', justifyContent: 'center' } });