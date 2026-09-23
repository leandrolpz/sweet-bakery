import { categorias } from './categorias';
import { clientes } from './clientes';
import { pagamentos } from './pagamentos';
import { pedidos } from './pedidos';
import { produtos } from './produtos';
import type { CollectionDef } from './types';

/** Ordem do menu: do cadastro-base (categorias) até o financeiro (pagamentos). */
export const COLLECTIONS: CollectionDef[] = [categorias, produtos, clientes, pedidos, pagamentos];

export { categorias, clientes, pagamentos, pedidos, produtos };
