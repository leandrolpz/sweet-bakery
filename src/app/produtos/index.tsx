import { CrudList } from '@/src/components/CrudList';
import { produtos } from '@/src/collections/produtos';

export default function ListarProduto() {
  return <CrudList def={produtos} />;
}
