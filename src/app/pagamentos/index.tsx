import { CrudList } from '@/src/components/CrudList';
import { pagamentos } from '@/src/collections/pagamentos';

export default function ListarPagamento() {
  return <CrudList def={pagamentos} />;
}
