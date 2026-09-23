import type { ReactNode } from 'react';

export type Row = { id: string; [key: string]: any };

export type Option = { value: string; label: string; emoji?: string; color?: string; bg?: string };

export type FieldType =
  | 'text' | 'textarea' | 'email' | 'phone'
  | 'number' | 'money'
  | 'select' | 'relation' | 'boolean'
  | 'color' | 'emoji' | 'image' | 'date'
  | 'orderItems';

export type FieldDef = {
  /** Nome do campo no Firestore (NÃO alterar: são os campos já existentes). */
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  hint?: string;
  /** Campo ocupa metade da linha em telas largas. */
  half?: boolean;
  /** Não aparece no formulário, mas é gravado (ex.: total do pedido, calculado). */
  hidden?: boolean;
  capitalize?: 'words' | 'sentences' | 'none';
  min?: number;
  max?: number;
  options?: Option[];                       // select
  palette?: string[];                       // color
  suggestions?: string[];                   // emoji
  defaultValue?: () => any;
  validate?: (value: any, form: Record<string, any>) => string | null;
  /** Escolha de outro registro (ex.: categoria do produto). Grava o id. */
  relation?: {
    collection: string;
    label: (row: Row) => string;
    sublabel?: (row: Row) => string;
    emoji?: (row: Row) => string;
    /** Ao escolher, pode preencher outros campos do formulário. */
    onPick?: (row: Row, ctx: { isEdit: boolean }) => Record<string, any>;
  };
  /** Atalho para copiar um dado de outro registro para este campo de texto. */
  fill?: { collection: string; buttonLabel: string; label: (row: Row) => string; apply: (row: Row) => string };
};

export type ThumbDef = { emoji?: string; text?: string; imageUrl?: string; bg?: string; color?: string };
export type ListCtx = { lookups: Record<string, Row[]> };
export type BadgeDef = { label: string; color: string; bg: string };

export type ListDef = {
  title: (r: Row, ctx: ListCtx) => string;
  subtitle?: (r: Row, ctx: ListCtx) => string;
  thumb?: (r: Row, ctx: ListCtx) => ThumbDef;
  badge?: (r: Row) => BadgeDef | null;
  /** Valor em destaque à direita (preço, total…). */
  value?: (r: Row) => string;
  details?: (r: Row, ctx: ListCtx) => [string, string][];
};

export type CollectionDef = {
  /** Nome da collection no Firestore. */
  key: string;
  label: string;
  singular: string;
  emoji: string;
  description: string;
  feminine: boolean;
  fields: FieldDef[];
  list: ListDef;
  /** Collections extras necessárias para montar a listagem (ex.: categorias nos produtos). */
  lookups?: string[];
  sort?: (a: Row, b: Row) => number;
  /** Filtro rápido por chips (ex.: status do pedido). */
  filter?: { key: string; options: Option[] };
  /** Aviso mostrado antes de excluir (ex.: "usada por 3 produtos"). */
  deleteWarning?: (row: Row) => Promise<string | null>;
  formPreview?: (form: Record<string, any>) => ReactNode;
};

/** Encontra a opção pelo valor OU pelo rótulo (aceita dados antigos, sem diferenciar maiúsculas). */
export function findOption(options: Option[] | undefined, value: unknown): Option | undefined {
  const v = String(value ?? '').trim().toLowerCase();
  if (!v) return undefined;
  return options?.find((o) => o.value.toLowerCase() === v || o.label.toLowerCase() === v);
}
