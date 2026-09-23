import { StyleSheet, Text as RNText, TextProps } from 'react-native';
import { colors, fonts } from '@/src/constants/theme';

export type Variant = 'display' | 'title' | 'heading' | 'label' | 'body' | 'bodyStrong' | 'small' | 'tiny';

// Nunca usamos fontWeight: cada peso é uma família própria (evita "negrito falso" na web).
const variants = StyleSheet.create({
  display: { fontFamily: fonts.display, fontSize: 32, lineHeight: 38, letterSpacing: -0.4 },
  title: { fontFamily: fonts.displaySemi, fontSize: 24, lineHeight: 30 },
  heading: { fontFamily: fonts.bodyHeavy, fontSize: 17, lineHeight: 23 },
  label: { fontFamily: fonts.bodyBold, fontSize: 14, lineHeight: 20 },
  body: { fontFamily: fonts.body, fontSize: 15, lineHeight: 23 },
  bodyStrong: { fontFamily: fonts.bodyBold, fontSize: 15, lineHeight: 23 },
  small: { fontFamily: fonts.body, fontSize: 13, lineHeight: 19 },
  tiny: { fontFamily: fonts.bodyBold, fontSize: 12, lineHeight: 16 },
});

export function T({ v = 'body', color, style, ...rest }: TextProps & { v?: Variant; color?: string }) {
  return <RNText {...rest} style={[variants[v], { color: color ?? colors.texto }, style]} />;
}
