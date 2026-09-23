import { CrudForm } from '@/src/components/CrudForm';
import { categorias } from '@/src/collections/categorias';

export default function CadastrarCategoria() {
  return <CrudForm def={categorias} />;
}
