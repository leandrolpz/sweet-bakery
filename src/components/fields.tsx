import { useState } from 'react';
import { Image, Pressable, StyleSheet, Switch, View } from 'react-native';
import { colors, radius } from '@/src/constants/theme';
import { FieldDef, Option, Row, findOption } from '@/src/collections/types';
import { useCollection } from '@/src/hooks/useCollection';
import { maskDate, maskPhone, safeColor, todayBr } from '@/src/utils/format';
import { Box, Chip, FieldShell, SelectModal } from './inputs';
import { OrderItemsField } from './OrderItemsField';
import { Button } from './ui/Button';
import { T } from './ui/Text';

export type FieldRendererProps = {
  field: FieldDef;
  form: Record<string, any>;
  error?: string;
  isEdit: boolean;
  setValue: (key: string, value: any) => void;
  patch: (values: Record<string, any>) => void;
};

/** Escolhe o componente certo para cada tipo de campo definido na collection. */
export function FieldRenderer(props: FieldRendererProps) {
  const { field, form, error, isEdit, setValue, patch } = props;
  const value = form[field.key];
  const set = (v: any) => setValue(field.key, v);
  const invalid = !!error;

  switch (field.type) {
    case 'orderItems':
      return (
        <OrderItemsField
          field={field}
          items={Array.isArray(value) ? value : []}
          total={form.total}
          error={error}
          isEdit={isEdit}
          onChange={(items, total) => patch({ [field.key]: items, total: String(total) })}
        />
      );

    case 'boolean':
      // A linha inteira é clicável (alvo de toque grande), mas só o Switch é anunciado/focável.
      return (
        <Pressable accessible={false} focusable={false} onPress={() => set(!value)} style={s.switchRow}>
          <View style={{ flex: 1 }}>
            <T v="label">{field.label}</T>
            {field.hint ? <T v="small" color={colors.textoSuave}>{field.hint}</T> : null}
          </View>
          <Switch
            value={!!value}
            onValueChange={set}
            accessibilityLabel={field.label}
            trackColor={{ false: colors.campo, true: colors.morango }}
            thumbColor="#fff"
          />
        </Pressable>
      );

    case 'select': {
      const current = findOption(field.options, value);
      const opts: Option[] =
        value && !current ? [...(field.options ?? []), { value: String(value), label: String(value) }] : field.options ?? [];
      return (
        <FieldShell field={field} error={error}>
          <View style={s.chips}>
            {opts.map((o) => (
              <Chip
                key={o.value}
                label={o.label}
                emoji={o.emoji}
                selected={(current?.value ?? String(value ?? '')) === o.value}
                onPress={() => set(o.value)}
              />
            ))}
          </View>
        </FieldShell>
      );
    }

    case 'relation':
      return <RelationField {...props} value={value} />;

    case 'color': {
      const palette = field.palette ?? [];
      return (
        <FieldShell field={field} error={error}>
          <Box
            value={String(value ?? '')}
            onChangeText={set}
            placeholder="#C92F60"
            autoCapitalize="none"
            autoCorrect={false}
            invalid={invalid}
            suffix={<View style={[s.swatchPreview, { backgroundColor: safeColor(value, 'transparent') }]} />}
          />
          <View style={s.chips}>
            {palette.map((c) => (
              <Pressable
                key={c}
                onPress={() => set(c)}
                accessibilityRole="button"
                accessibilityLabel={`Usar cor ${c}`}
                style={[s.swatch, { backgroundColor: c }, String(value).toLowerCase() === c.toLowerCase() && s.swatchOn]}
              />
            ))}
          </View>
        </FieldShell>
      );
    }

    case 'emoji':
      return (
        <FieldShell field={field} error={error}>
          <Box value={String(value ?? '')} onChangeText={set} placeholder="Ícone" invalid={invalid} style={{ fontSize: 22 }} />
          <View style={s.chips}>
            {(field.suggestions ?? []).map((e) => (
              <Pressable
                key={e}
                onPress={() => set(e)}
                accessibilityRole="button"
                accessibilityLabel={`Usar ${e}`}
                style={[s.emoji, value === e && s.emojiOn]}
              >
                <T style={{ fontSize: 22 }}>{e}</T>
              </Pressable>
            ))}
          </View>
        </FieldShell>
      );

    case 'image':
      return (
        <FieldShell field={field} error={error}>
          <Box
            value={String(value ?? '')}
            onChangeText={set}
            placeholder="https://…"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            invalid={invalid}
          />
          <ImagePreview uri={String(value ?? '')} />
        </FieldShell>
      );

    case 'date':
      return (
        <FieldShell field={field} error={error}>
          <Box
            value={String(value ?? '')}
            onChangeText={(t) => set(maskDate(t))}
            placeholder="DD/MM/AAAA"
            keyboardType="number-pad"
            invalid={invalid}
            suffix={<Button label="Hoje" size="sm" variant="ghost" onPress={() => set(todayBr())} />}
          />
        </FieldShell>
      );

    case 'money':
    case 'number':
      return (
        <FieldShell field={field} error={error}>
          <Box
            prefix={field.type === 'money' ? 'R$' : undefined}
            value={String(value ?? '')}
            onChangeText={set}
            placeholder={field.placeholder ?? (field.type === 'money' ? '0,00' : '0')}
            keyboardType="decimal-pad"
            invalid={invalid}
          />
        </FieldShell>
      );

    default: {
      // text | textarea | email | phone
      const multiline = field.type === 'textarea';
      return (
        <FieldShell field={field} error={error}>
          <Box
            value={String(value ?? '')}
            onChangeText={(t) => set(field.type === 'phone' ? maskPhone(t) : t)}
            placeholder={field.placeholder}
            multiline={multiline}
            invalid={invalid}
            keyboardType={field.type === 'email' ? 'email-address' : field.type === 'phone' ? 'phone-pad' : 'default'}
            autoCapitalize={field.type === 'email' ? 'none' : field.capitalize ?? 'sentences'}
            autoCorrect={field.type !== 'email'}
          />
          {field.fill ? <FillLink field={field} onFill={set} /> : null}
        </FieldShell>
      );
    }
  }
}

function RelationField({ field, error, isEdit, patch, setValue, value }: FieldRendererProps & { value: any }) {
  const rel = field.relation!;
  const { rows, loading } = useCollection(rel.collection);
  const [open, setOpen] = useState(false);

  const options = rows.map((r) => ({
    value: r.id, label: rel.label(r), sublabel: rel.sublabel?.(r), emoji: rel.emoji?.(r),
  }));
  const current = options.find((o) => o.value === value);
  const text = current?.label ?? (value ? `${value} (registro não encontrado)` : field.placeholder ?? 'Toque para escolher');

  return (
    <FieldShell field={field} error={error}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${field.label}: ${text}`}
        onPress={() => setOpen(true)}
        style={[s.select, !!error && { borderColor: colors.perigo }]}
      >
        {current?.emoji ? <T style={{ fontSize: 20 }}>{current.emoji}</T> : null}
        <T style={{ flex: 1 }} color={current ? colors.texto : '#A98891'} numberOfLines={1}>{text}</T>
        <T color={colors.textoSuave}>▾</T>
      </Pressable>
      <SelectModal
        visible={open}
        title={field.label}
        options={options}
        loading={loading}
        emptyText="Nenhum registro cadastrado ainda."
        onClose={() => setOpen(false)}
        onSelect={(o) => {
          setValue(field.key, o.value);
          const row = rows.find((r: Row) => r.id === o.value);
          if (row && rel.onPick) patch(rel.onPick(row, { isEdit }));
          setOpen(false);
        }}
      />
    </FieldShell>
  );
}

function FillLink({ field, onFill }: { field: FieldDef; onFill: (v: string) => void }) {
  const fill = field.fill!;
  const { rows, loading } = useCollection(fill.collection);
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button label={fill.buttonLabel} size="sm" variant="ghost" onPress={() => setOpen(true)} style={{ alignSelf: 'flex-start' }} />
      <SelectModal
        visible={open}
        title={fill.buttonLabel}
        loading={loading}
        options={rows.map((r) => ({ value: r.id, label: fill.label(r), sublabel: fill.apply(r) }))}
        onClose={() => setOpen(false)}
        onSelect={(o) => {
          const row = rows.find((r) => r.id === o.value);
          if (row) onFill(fill.apply(row));
          setOpen(false);
        }}
      />
    </>
  );
}

function ImagePreview({ uri }: { uri: string }) {
  const [failed, setFailed] = useState<string | null>(null);
  if (!/^https?:\/\//i.test(uri.trim())) return null;
  if (failed === uri) {
    return <T v="small" color={colors.perigo}>Não foi possível carregar essa imagem. Confira o link.</T>;
  }
  return (
    <Image
      source={{ uri: uri.trim() }}
      onError={() => setFailed(uri)}
      style={s.preview}
      resizeMode="cover"
      accessibilityLabel="Prévia da imagem"
    />
  );
}

const s = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  switchRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, minHeight: 60,
    borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.campo, backgroundColor: colors.superficie,
  },
  select: {
    flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 50, paddingHorizontal: 14,
    borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.campo, backgroundColor: colors.superficie,
  },
  swatchPreview: { width: 26, height: 26, borderRadius: 13, borderWidth: 1, borderColor: colors.campo },
  swatch: { width: 36, height: 36, borderRadius: 18, borderWidth: 2, borderColor: colors.superficie },
  swatchOn: { borderColor: colors.cacau },
  emoji: {
    width: 46, height: 46, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: colors.linha, backgroundColor: colors.superficie,
  },
  emojiOn: { borderColor: colors.morango, backgroundColor: colors.morangoSuave },
  preview: { width: '100%', maxWidth: 320, height: 180, borderRadius: radius.md, backgroundColor: colors.morangoSuave },
});
