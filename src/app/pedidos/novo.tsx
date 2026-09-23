import { CrudForm } from '@/src/components/CrudForm';
import { pedidos } from '@/src/collections/pedidos';

export default function CadastrarPedido() {
  return <CrudForm def={pedidos} />;
}
