import { ReactNode, useState } from 'react';
import { ActivityIndicator, Image, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { colors, radius } from '@/src/constants/theme';
import { useLayout } from '@/src/hooks/useLayout';
import type { ThumbDef } from '@/src/collections/types';
import { T } from './Text';
import { Icon } from './Icon';

export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[s.card, style]}>{children}</View>;
}

export function Badge({ label, color, bg }: { label: string; color: string; bg: string }) {
  return (
    <View style={[s.badge, { backgroundColor: bg }]}>
      <T v="tiny" color={color}>{label}</T>
    </View>
  );
}

/** Miniatura: foto (URL), emoji ou iniciais. Se a foto falhar, cai para o emoji. */
export function Thumb({ thumb, size = 56 }: { thumb: ThumbDef; size?: number }) {
  const [failed, setFailed] = useState(false);
  const box = { width: size, height: size, borderRadius: size * 0.3, backgroundColor: thumb.bg ?? colors.morangoSuave };
  if (thumb.imageUrl && !failed) {
    return (
      <Image
        source={{ uri: thumb.imageUrl }}
        onError={() => setFailed(true)}
        style={[box, { backgroundColor: colors.morangoSuave }]}
        accessibilityIgnoresInvertColors
      />
    );
  }
  if (thumb.emoji && /^[a-z-]+$/.test(thumb.emoji)) {
    return <View style={[box, s.center]}><Icon name={thumb.emoji as any} size={size * 0.5} /></View>;
  }
  return (
    <View style={[box, s.center]}>
      <T style={{ fontSize: size * 0.48, lineHeight: size * 0.6, color: thumb.color ?? colors.morangoEscuro }}>
        {thumb.emoji ?? thumb.text ?? '-'}
      </T>
    </View>
  );
}

export function Loading({ text = 'Carregando…' }: { text?: string }) {
  return (
    <View style={[s.center, { padding: 48, gap: 12 }]}>
      <ActivityIndicator size="large" color={colors.morango} />
      <T color={colors.textoSuave}>{text}</T>
    </View>
  );
}

export function EmptyState({
  emoji, icon, title, text, children,
}: { emoji?: string; icon?: string; title: string; text?: string; children?: ReactNode }) {
  return (
    <View style={s.empty}>
      {icon ? <Icon name={icon as any} size={52} /> : emoji ? <T style={{ fontSize: 52, lineHeight: 64 }}>{emoji}</T> : null}
      <T v="title" style={{ textAlign: 'center' }}>{title}</T>
      {text ? <T color={colors.textoSuave} style={{ textAlign: 'center', maxWidth: 420 }}>{text}</T> : null}
      {children ? <View style={{ marginTop: 8 }}>{children}</View> : null}
    </View>
  );
}

export function Banner({ kind = 'error', children }: { kind?: 'error' | 'info'; children: ReactNode }) {
  const err = kind === 'error';
  return (
    <View
      accessibilityRole="alert"
      style={[s.banner, { backgroundColor: err ? colors.perigoSuave : colors.azulSuave }]}
    >
      <T v="bodyStrong" color={err ? colors.perigo : colors.azul}>{children}</T>
    </View>
  );
}

export function PageHeader({ title, subtitle, right }: { title: string; subtitle?: string; right?: ReactNode }) {
  const { isPhone } = useLayout();
  return (
    <View style={[s.header, { flexDirection: isPhone ? 'column' : 'row' }]}>
      <View style={{ flex: 1, gap: 4 }}>
        <T v="display" style={isPhone ? { fontSize: 27, lineHeight: 33 } : undefined} accessibilityRole="header">
          {title}
        </T>
        {subtitle ? <T color={colors.textoSuave}>{subtitle}</T> : null}
      </View>
      {right}
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: colors.superficie,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.linha,
    padding: 18,
  },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill },
  center: { alignItems: 'center', justifyContent: 'center' },
  empty: { alignItems: 'center', gap: 8, paddingVertical: 48, paddingHorizontal: 16 },
  banner: { borderRadius: radius.md, padding: 14 },
  header: { gap: 16, marginBottom: 20, alignItems: 'flex-start' },
});
