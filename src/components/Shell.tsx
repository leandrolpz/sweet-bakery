import { ReactNode, useEffect, useRef, useState } from 'react';
import {
  Animated, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, useWindowDimensions, View,
} from 'react-native';
import { Link, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLLECTIONS } from '@/src/collections';
import { colors, radius, SIDEBAR_WIDTH } from '@/src/constants/theme';
import { useLayout } from '@/src/hooks/useLayout';
import { Awning } from './ui/Awning';
import { T } from './ui/Text';

const ACCENT = '#FF8FB0'; // rosa claro, legível sobre o chocolate

function Brand() {
  return (
    <View style={s.brand}>
      <T style={{ fontSize: 30, lineHeight: 36 }}>🧁</T>
      <View>
        <T v="title" color="#fff" style={{ lineHeight: 26 }}>Sweet Bakery</T>
        <T v="small" color={colors.noCacauSuave}>Sistema da confeitaria</T>
      </View>
    </View>
  );
}

function MenuLink({ href, label, icon, active, indent }: { href: string; label: string; icon?: string; active: boolean; indent?: boolean }) {
  // Link asChild só aceita `style` como objeto simples (nem função, nem array): por isso flatten + hover por estado.
  const [hover, setHover] = useState(false);
  return (
    <Link href={href as any} asChild>
      <Pressable
        accessibilityRole="link"
        accessibilityState={{ selected: active }}
        onHoverIn={() => setHover(true)}
        onHoverOut={() => setHover(false)}
        style={StyleSheet.flatten([
          s.item,
          indent && { paddingLeft: 52 },
          (active || hover) && { backgroundColor: active ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)' },
        ])}
      >
        {active ? <View style={s.activeBar} /> : null}
        {icon ? <T style={{ fontSize: 20, width: 28 }}>{icon}</T> : null}
        <T v={indent ? 'body' : 'bodyStrong'} color={active ? '#fff' : colors.noCacau}>{label}</T>
      </Pressable>
    </Link>
  );
}

/** Menu principal: Início + uma opção por collection, cada uma com Cadastrar e Listar/Alterar/Excluir. */
function MenuList() {
  const path = usePathname();
  const activeKey = COLLECTIONS.find((c) => path === `/${c.key}` || path.startsWith(`/${c.key}/`))?.key;
  const [open, setOpen] = useState<Record<string, boolean>>(activeKey ? { [activeKey]: true } : {});
  useEffect(() => { if (activeKey) setOpen((o) => ({ ...o, [activeKey]: true })); }, [activeKey]);

  return (
    <View style={{ gap: 4 }}>
      <MenuLink href="/" label="Início" icon="🏠" active={path === '/'} />
      <T v="small" color={colors.noCacauSuave} style={s.menuTitle}>Cadastros</T>
      {COLLECTIONS.map((c) => {
        const isOpen = !!open[c.key];
        const onNew = path === `/${c.key}/novo`;
        const onList = activeKey === c.key && !onNew;
        return (
          <View key={c.key}>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ expanded: isOpen }}
              onPress={() => setOpen((o) => ({ ...o, [c.key]: !o[c.key] }))}
              style={(st) => [s.item, (st as any).hovered && { backgroundColor: 'rgba(255,255,255,0.06)' }]}
            >
              <T style={{ fontSize: 20, width: 28 }}>{c.emoji}</T>
              <T v="bodyStrong" color={activeKey === c.key ? '#fff' : colors.noCacau} style={{ flex: 1 }}>{c.label}</T>
              <T color={colors.noCacauSuave}>{isOpen ? '▾' : '▸'}</T>
            </Pressable>
            {isOpen ? (
              <View style={{ gap: 2, marginBottom: 6 }}>
                <MenuLink indent href={`/${c.key}/novo`} label={`Cadastrar ${c.singular}`} active={onNew} />
                <MenuLink indent href={`/${c.key}`} label="Listar / Alterar / Excluir" active={onList} />
              </View>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

function Sidebar() {
  return (
    <View style={s.sidebar}>
      <Brand />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <MenuList />
      </ScrollView>
    </View>
  );
}

/** Gaveta do menu para celular e tablet. */
function Drawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const panelW = Math.min(320, width * 0.86);
  const x = useRef(new Animated.Value(-panelW)).current;
  const [mounted, setMounted] = useState(open);
  const native = Platform.OS !== 'web';

  useEffect(() => {
    if (open) {
      setMounted(true);
      Animated.timing(x, { toValue: 0, duration: 220, useNativeDriver: native }).start();
    } else {
      Animated.timing(x, { toValue: -panelW, duration: 180, useNativeDriver: native }).start(({ finished }) => {
        if (finished) setMounted(false);
      });
    }
  }, [open, panelW, x, native]);

  if (!mounted) return null;
  return (
    <View style={[StyleSheet.absoluteFill, { zIndex: 50 }]}>
      <Pressable style={s.backdrop} onPress={onClose} accessibilityLabel="Fechar menu" />
      <Animated.View style={[s.panel, { width: panelW, paddingTop: insets.top + 16, transform: [{ translateX: x }] }]}>
        <View style={s.panelHead}>
          <View style={{ flex: 1 }}><Brand /></View>
          <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Fechar menu" style={s.iconBtn}>
            <T v="heading" color="#fff">✕</T>
          </Pressable>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
          <MenuList />
        </ScrollView>
      </Animated.View>
    </View>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  const { isDesktop, isPhone } = useLayout();
  const path = usePathname();
  const insets = useSafeAreaInsets();
  const [drawer, setDrawer] = useState(false);
  const scroll = useRef<ScrollView>(null);

  useEffect(() => {
    setDrawer(false);
    scroll.current?.scrollTo({ y: 0, animated: false });
  }, [path]);

  const page = (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Awning />
      <ScrollView
        ref={scroll}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: isPhone ? 16 : 32, paddingBottom: 72, alignItems: 'center' }}
      >
        <View style={{ width: '100%', maxWidth: 1080 }}>{children}</View>
      </ScrollView>
    </KeyboardAvoidingView>
  );

  if (isDesktop) {
    return (
      <View style={s.root}>
        <Sidebar />
        <View style={{ flex: 1 }}>{page}</View>
      </View>
    );
  }

  return (
    <View style={[s.root, { flexDirection: 'column' }]}>
      <StatusBar style="light" />
      <View style={[s.topbar, { paddingTop: insets.top }]}>
        <Pressable onPress={() => setDrawer(true)} accessibilityRole="button" accessibilityLabel="Abrir menu" style={s.iconBtn}>
          <T style={{ fontSize: 24, color: '#fff', lineHeight: 28 }}>☰</T>
        </Pressable>
        <T v="title" color="#fff" style={{ fontSize: 20 }}>🧁 Sweet Bakery</T>
      </View>
      {page}
      <Drawer open={drawer} onClose={() => setDrawer(false)} />
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, flexDirection: 'row', backgroundColor: colors.chantilly },
  sidebar: { width: SIDEBAR_WIDTH, backgroundColor: colors.cacau, paddingHorizontal: 14, paddingTop: 28 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 8, paddingBottom: 24 },
  menuTitle: { paddingHorizontal: 12, paddingTop: 18, paddingBottom: 6 },
  item: {
    flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 46, paddingHorizontal: 12,
    borderRadius: radius.md, overflow: 'hidden',
  },
  activeBar: { position: 'absolute', left: 0, top: 10, bottom: 10, width: 4, borderRadius: 2, backgroundColor: ACCENT },
  topbar: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.cacau, paddingHorizontal: 8, paddingBottom: 8 },
  iconBtn: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(58,31,36,0.55)' },
  panel: { position: 'absolute', left: 0, top: 0, bottom: 0, backgroundColor: colors.cacau, paddingHorizontal: 14 },
  panelHead: { flexDirection: 'row', alignItems: 'flex-start' },
});
