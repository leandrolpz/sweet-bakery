import { useState } from 'react';
import { Link, usePathname } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors, radius } from '@/src/constants/theme';
import type { CollectionDef } from '@/src/collections/types';
import { useLayout } from '@/src/hooks/useLayout';
import { T } from './ui/Text';
import { Icon } from './ui/Icon';

/** Abas no topo de cada cadastro: deixa claro que existem duas telas (listar e cadastrar). */
function Tab({ href, label, icon, active, grow }: { href: string; label: string; icon: string; active: boolean; grow?: boolean }) {
  // Link asChild só aceita `style` como objeto simples (nem função, nem array): por isso flatten + hover por estado.
  const [hover, setHover] = useState(false);
  return (
    <Link href={href as any} asChild>
      <Pressable
        accessibilityRole="tab"
        accessibilityState={{ selected: active }}
        onHoverIn={() => setHover(true)}
        onHoverOut={() => setHover(false)}
        style={StyleSheet.flatten([s.tab, grow && { flex: 1, alignItems: 'center' as const }, active && s.tabOn, !active && hover && { backgroundColor: colors.morangoSuave }])}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}><Icon name={icon as any} size={17} /><T v="label" color={active ? '#fff' : colors.texto} numberOfLines={1}>{label}</T></View>
      </Pressable>
    </Link>
  );
}

export function CollectionTabs({ def }: { def: CollectionDef }) {
  const path = usePathname();
  const { isPhone } = useLayout();
  const onNew = path === `/${def.key}/novo`;
  // No celular os rótulos são curtos para caber lado a lado; o menu mantém os nomes completos.
  return (
    <View style={[s.wrap, isPhone && { alignSelf: 'stretch' }]} accessibilityRole="tablist">
      <Tab grow={isPhone} href={`/${def.key}`} icon="edit" label={isPhone ? 'Listar' : 'Listar / Alterar / Excluir'} active={!onNew} />
      <Tab grow={isPhone} href={`/${def.key}/novo`} icon="add" label={isPhone ? 'Cadastrar' : `Cadastrar ${def.singular}`} active={onNew} />
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    flexDirection: 'row', gap: 6, alignSelf: 'flex-start', marginBottom: 20,
    padding: 5, borderRadius: radius.pill, backgroundColor: colors.superficie, borderWidth: 1, borderColor: colors.linha,
  },
  tab: { paddingHorizontal: 16, minHeight: 42, justifyContent: 'center', borderRadius: radius.pill },
  tabOn: { backgroundColor: colors.morango },
});
