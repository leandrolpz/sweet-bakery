import { CrudList } from '@/src/components/CrudList';
import { pedidos } from '@/src/collections/pedidos';

export default function ListarPedido() {
  return <CrudList def={pedidos} />;
}
