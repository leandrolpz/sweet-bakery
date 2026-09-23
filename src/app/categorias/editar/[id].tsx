import { useLocalSearchParams } from 'expo-router';
import { CrudForm } from '@/src/components/CrudForm';
import { categorias } from '@/src/collections/categorias';

export default function AlterarCategoria() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <CrudForm key={id} def={categorias} id={id} />;
}
