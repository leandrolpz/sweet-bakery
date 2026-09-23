import { ActivityIndicator, Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { colors, radius } from '@/src/constants/theme';
import { T } from './Text';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';

const palette: Record<Variant, { bg: string; hover: string; fg: string; border: string }> = {
  primary: { bg: colors.morango, hover: colors.morangoEscuro, fg: '#fff', border: colors.morango },
  secondary: { bg: colors.superficie, hover: colors.morangoSuave, fg: colors.morangoEscuro, border: colors.campo },
  danger: { bg: colors.perigoSuave, hover: '#F9C9CE', fg: colors.perigo, border: colors.perigoSuave },
  ghost: { bg: 'transparent', hover: colors.morangoSuave, fg: colors.morangoEscuro, border: 'transparent' },
};

type Props = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  size?: 'md' | 'sm';
  icon?: string;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Button({ label, onPress, variant = 'primary', size = 'md', icon, disabled, loading, style }: Props) {
  const p = palette[variant];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled || loading}
      onPress={onPress}
      style={(state) => [
        s.base,
        size === 'sm' ? s.sm : s.md,
        {
          backgroundColor: state.pressed || (state as any).hovered ? p.hover : p.bg,
          borderColor: p.border,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={p.fg} />
      ) : (
        <View style={s.row}>
          {icon ? <T v="bodyStrong" style={{ fontSize: size === 'sm' ? 14 : 16 }}>{icon}</T> : null}
          <T v={size === 'sm' ? 'label' : 'bodyStrong'} color={p.fg}>{label}</T>
        </View>
      )}
    </Pressable>
  );
}

const s = StyleSheet.create({
  base: { borderRadius: radius.md, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  md: { minHeight: 48, paddingHorizontal: 20 },
  sm: { minHeight: 40, paddingHorizontal: 14 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});
