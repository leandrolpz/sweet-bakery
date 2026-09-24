import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import type { CollectionDef, FieldDef, Row } from '@/src/collections/types';
import { createRecord, getRecord, updateRecord } from '@/src/services/firestore';
import { brToIso, capitalize, isoToBr, numberToInput, parseNumber } from '@/src/utils/format';
import { CollectionTabs } from './CollectionTabs';
import { useToast } from './Feedback';
import { FieldRenderer } from './fields';
import { Banner, Card, EmptyState, Loading, PageHeader } from './ui/blocks';
import { Button } from './ui/Button';

type Form = Record<string, any>;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Valor inicial do campo no formulário (tudo vira texto, exceto boolean e itens). */
function toForm(f: FieldDef, row?: Row) {
  const v = row?.[f.key];
  switch (f.type) {
    case 'boolean': return row ? Boolean(v) : Boolean(f.defaultValue?.() ?? false);
    case 'orderItems': return Array.isArray(v) ? v : [];
    case 'number':
    case 'money': return row ? numberToInput(v) : f.defaultValue?.() ?? '';
    case 'date': return row ? isoToBr(v) : f.defaultValue?.() ?? '';
    default: return row ? String(v ?? '') : f.defaultValue?.() ?? '';
  }
}

function validate(def: CollectionDef, form: Form): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const f of def.fields) {
    const v = form[f.key];
    const empty = f.type === 'orderItems' ? !v?.length : f.type === 'boolean' ? false : String(v ?? '').trim() === '';

    if (empty) {
      if (f.required && !f.hidden) {
        errors[f.key] = f.type === 'orderItems' ? 'Adicione pelo menos um produto ao pedido.'
          : f.type === 'select' || f.type === 'relation' ? 'Escolha uma opção.' : 'Preencha este campo.';
      }
      continue;
    }
    let msg: string | null = null;
    if (f.type === 'email' && !EMAIL.test(String(v).trim())) msg = 'Digite um e-mail válido, como nome@email.com.';
    if (f.type === 'number' || f.type === 'money') {
      const n = parseNumber(v);
      if (n === null) msg = 'Digite um número válido.';
      else if (f.min !== undefined && n < f.min) msg = `O valor mínimo é ${f.min}.`;
      else if (f.max !== undefined && n > f.max) msg = `O valor máximo é ${f.max}.`;
    }
    if (f.type === 'date') {
      if (!/^\d{2}\/\d{2}\/\d{4}$/.test(String(v))) msg = 'Use o formato DD/MM/AAAA.';
      else if (brToIso(String(v)) === null) msg = 'Essa data não existe.';
    }
    msg = msg ?? f.validate?.(v, form) ?? null;
    if (msg) errors[f.key] = msg;
  }
  return errors;
}

/** Converte o formulário no documento que vai para o Firestore, respeitando os tipos originais. */
function toDoc(def: CollectionDef, form: Form, original?: Row) {
  const data: Record<string, any> = {};
  for (const f of def.fields) {
    const v = form[f.key];
    switch (f.type) {
      case 'number':
      case 'money': data[f.key] = parseNumber(v) ?? 0; break;
      case 'boolean': data[f.key] = !!v; break;
      case 'orderItems':
        data[f.key] = (v as any[]).map((i) => ({ produtoId_REF: i.product?.id ?? i.produtoId_REF ?? '', amount: Number(i.quantity ?? i.amount ?? 1), price: Number(i.product?.price ?? i.price ?? 0) }));
        break;
      case 'date': data[f.key] = brToIso(String(v), original?.[f.key]) ?? ''; break;
      default: data[f.key] = String(v ?? '').trim();
    }
  }
  return data;
}

/** Tela CADASTRAR (sem id) ou ALTERAR (com id) de uma collection. */
export function CrudForm({ def, id }: { def: CollectionDef; id?: string }) {
  const router = useRouter();
  const toast = useToast();
  const isEdit = !!id;

  const [original, setOriginal] = useState<Row | undefined>();
  const [form, setForm] = useState<Form>(() => Object.fromEntries(def.fields.map((f) => [f.key, toForm(f)])));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(isEdit);
  const [notFound, setNotFound] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    let alive = true;
    getRecord(def.key, id)
      .then((row) => {
        if (!alive) return;
        if (!row) return setNotFound(true);
        setOriginal(row);
        setForm(Object.fromEntries(def.fields.map((f) => [f.key, toForm(f, row)])));
      })
      .catch(() => alive && setNotFound(true))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [def, id]);

  const setValue = (key: string, value: any) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => { if (!e[key]) return e; const { [key]: _drop, ...rest } = e; return rest; });
  };
  const patch = (values: Form) => {
    setForm((f) => ({ ...f, ...values }));
    setErrors((e) => Object.fromEntries(Object.entries(e).filter(([k]) => !(k in values))));
  };

  const goList = () => router.replace(`/${def.key}` as any);

  async function save() {
    const found = validate(def, form);
    setErrors(found);
    if (Object.keys(found).length) return;

    setSaving(true);
    try {
      const data = toDoc(def, form, original);
      if (isEdit) {
        await updateRecord(def.key, id!, data);
        toast.success('Alterações salvas!');
      } else {
        await createRecord(def.key, data);
        toast.success(`${capitalize(def.singular)} ${def.feminine ? 'cadastrada' : 'cadastrado'} com sucesso!`);
      }
      goList();
    } catch {
      toast.error('Não foi possível salvar. Verifique a conexão e tente de novo.');
    } finally {
      setSaving(false);
    }
  }

  const title = isEdit ? `Alterar ${def.singular}` : `Cadastrar ${def.singular}`;
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <View>
      <PageHeader title={title} subtitle={isEdit ? undefined : def.description} />
      <CollectionTabs def={def} />

      {loading ? (
        <Loading />
      ) : notFound ? (
        <Card>
          <EmptyState icon="search" title={`${capitalize(def.singular)} não encontrad${def.feminine ? 'a' : 'o'}`} text="Ele pode ter sido excluído por outra pessoa.">
            <Button label="Voltar para a lista" variant="secondary" onPress={goList} />
          </EmptyState>
        </Card>
      ) : (
        <Card style={{ padding: 20, gap: 20 }}>
          {def.formPreview ? <View>{def.formPreview(form)}</View> : null}

          <View style={s.fields}>
            {def.fields.filter((f) => !f.hidden).map((f) => (
              <View key={f.key} style={f.half ? s.half : s.full}>
                <FieldRenderer field={f} form={form} error={errors[f.key]} isEdit={isEdit} setValue={setValue} patch={patch} />
              </View>
            ))}
          </View>

          {hasErrors ? <Banner>Revise os campos destacados em vermelho.</Banner> : null}

          <View style={s.actions}>
            <Button label={isEdit ? 'Salvar alterações' : title} loading={saving} onPress={save} style={{ flexGrow: 1 }} />
            <Button label="Cancelar" variant="secondary" onPress={goList} disabled={saving} />
          </View>
        </Card>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  fields: { flexDirection: 'row', flexWrap: 'wrap', gap: 20 },
  full: { flexBasis: '100%', flexGrow: 1 },
  half: { flexBasis: 260, flexGrow: 1, minWidth: 0 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
});
