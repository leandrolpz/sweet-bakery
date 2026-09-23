import { CrudList } from '@/src/components/CrudList';
import { categorias } from '@/src/collections/categorias';

export default function ListarCategoria() {
  return <CrudList def={categorias} />;
}
