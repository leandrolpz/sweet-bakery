import { CrudList } from '@/src/components/CrudList';
import { clientes } from '@/src/collections/clientes';

export default function ListarCliente() {
  return <CrudList def={clientes} />;
}
