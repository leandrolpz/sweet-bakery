import { CrudForm } from '@/src/components/CrudForm';
import { produtos } from '@/src/collections/produtos';

export default function CadastrarProduto() {
  return <CrudForm def={produtos} />;
}
