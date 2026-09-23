import { CrudForm } from '@/src/components/CrudForm';
import { pagamentos } from '@/src/collections/pagamentos';

export default function CadastrarPagamento() {
  return <CrudForm def={pagamentos} />;
}
