import { CrudForm } from '@/src/components/CrudForm';
import { clientes } from '@/src/collections/clientes';

export default function CadastrarCliente() {
  return <CrudForm def={clientes} />;
}
