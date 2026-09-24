import { ReactNode, useEffect, useState } from 'react';
import {
  Modal, Platform, Pressable, ScrollView, StyleSheet, TextInput, TextInputProps, View,
} from 'react-native';
import { colors, radius } from '@/src/constants/theme';
import type { FieldDef, Option } from '@/src/collections/types';
import { norm } from '@/src/utils/format';
import { Loading } from './ui/blocks';
import { T } from './ui/Text';
import { Icon } from './ui/Icon';

const noOutline = Platform.OS === 'web' ? ({ outlineStyle: 'none', outlineWidth: 0 } as any) : undefined;

/** Rótulo + campo + dica/erro. */
export function FieldShell({ field, error, children }: { field: FieldDef; error?: string; children: ReactNode }) {
  return (
    <View style={{ gap: 6 }}>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
        <T v="label">{field.label}</T>
        {!field.required ? <T v="small" color={colors.textoSuave}>opcional</T> : null}
      </View>
      {children}
      {field.hint && !error ? <T v="small" color={colors.textoSuave}>{field.hint}</T> : null}
      {error ? <T v="small" color={colors.perigo} accessibilityRole="alert">{error}</T> : null}
    </View>
  );
}

/** Caixa de texto padrão do sistema. */
export function Box({
  invalid, prefix, suffix, multiline, style, onFocus, onBlur, ...rest
}: TextInputProps & { invalid?: boolean; prefix?: ReactNode; suffix?: ReactNode }) {
  const [focus, setFocus] = useState(false);
  return (
    <View
      style={[
        s.box,
        focus && s.boxFocus,
        invalid && s.boxInvalid,
        multiline && { alignItems: 'flex-start' },
      ]}
    >
      {prefix ? (typeof prefix === 'string' ? <T v="bodyStrong" color={colors.textoSuave}>{prefix}</T> : prefix) : null}
      <TextInput
        {...rest}
        multiline={multiline}
        placeholderTextColor="#A98891"
        onFocus={(e) => { setFocus(true); onFocus?.(e); }}
        onBlur={(e) => { setFocus(false); onBlur?.(e); }}
        style={[s.input, multiline && s.multiline, noOutline, style]}
      />
      {suffix}
    </View>
  );
}

export function Chip({
  label, emoji, selected, onPress,
}: { label: string; emoji?: string; selected?: boolean; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      onPress={onPress}
      style={(st) => [
        s.chip,
        selected ? s.chipOn : (st as any).hovered ? { backgroundColor: colors.morangoSuave } : null,
      ]}
    >
      <T v="label" color={selected ? '#fff' : colors.texto}>{emoji ? `${emoji}  ${label}` : label}</T>
    </Pressable>
  );
}

/** Lista pesquisável em janela — usada para escolher categoria, produto, cliente, pedido… */
export function SelectModal({
  visible, title, options, loading, emptyText, onSelect, onClose,
}: {
  visible: boolean;
  title: string;
  options: (Option & { sublabel?: string })[];
  loading?: boolean;
  emptyText?: string;
  onSelect: (o: Option) => void;
  onClose: () => void;
}) {
  const [q, setQ] = useState('');
  useEffect(() => { if (!visible) setQ(''); }, [visible]);
  const list = options.filter((o) => norm(`${o.label} ${(o as any).sublabel ?? ''}`).includes(norm(q)));

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={s.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Fechar" />
        <View style={s.sheet} accessibilityViewIsModal>
          <View style={s.sheetHead}>
            <T v="title" style={{ flex: 1 }}>{title}</T>
            <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Fechar" style={s.close}>
              <T v="heading" color={colors.textoSuave}>✕</T>
            </Pressable>
          </View>
          {options.length > 6 ? <Box value={q} onChangeText={setQ} placeholder="Buscar…" autoCorrect={false} prefix={<Icon name="search" size={19} />} /> : null}
          <ScrollView style={{ maxHeight: 380 }} keyboardShouldPersistTaps="handled">
            {loading ? (
              <Loading />
            ) : list.length === 0 ? (
              <T color={colors.textoSuave} style={{ padding: 16, textAlign: 'center' }}>
                {q ? 'Nada encontrado para essa busca.' : emptyText ?? 'Nenhum registro cadastrado.'}
              </T>
            ) : (
              list.map((o) => (
                <Pressable
                  key={o.value}
                  accessibilityRole="button"
                  onPress={() => onSelect(o)}
                  style={(st) => [s.option, (st as any).hovered || st.pressed ? { backgroundColor: colors.morangoSuave } : null]}
                >
                  {o.emoji ? <T style={{ fontSize: 24 }}>{o.emoji}</T> : null}
                  <View style={{ flex: 1 }}>
                    <T v="bodyStrong">{o.label}</T>
                    {(o as any).sublabel ? <T v="small" color={colors.textoSuave}>{(o as any).sublabel}</T> : null}
                  </View>
                </Pressable>
              ))
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  box: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: colors.superficie, borderRadius: radius.md,
    borderWidth: 1.5, borderColor: colors.campo, paddingHorizontal: 14, minHeight: 50,
  },
  boxFocus: { borderColor: colors.morango, backgroundColor: '#FFFDFD' },
  boxInvalid: { borderColor: colors.perigo, backgroundColor: '#FFF8F8' },
  input: { flex: 1, fontFamily: 'Nunito_400Regular', fontSize: 16, color: colors.texto, paddingVertical: 12 },
  multiline: { minHeight: 92, textAlignVertical: 'top' },
  chip: {
    paddingHorizontal: 14, minHeight: 40, justifyContent: 'center',
    borderRadius: radius.pill, borderWidth: 1.5, borderColor: colors.campo, backgroundColor: colors.superficie,
  },
  chipOn: { backgroundColor: colors.morango, borderColor: colors.morango },
  overlay: { flex: 1, backgroundColor: 'rgba(58,31,36,0.55)', alignItems: 'center', justifyContent: 'center', padding: 16 },
  sheet: { width: '100%', maxWidth: 520, backgroundColor: colors.superficie, borderRadius: radius.xl, padding: 20, gap: 12 },
  sheetHead: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  close: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  option: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: radius.md, minHeight: 52 },
});
