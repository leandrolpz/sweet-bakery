import { useLocalSearchParams } from 'expo-router';
import { CrudForm } from '@/src/components/CrudForm';
import { produtos } from '@/src/collections/produtos';

export default function AlterarProduto() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <CrudForm key={id} def={produtos} id={id} />;
}
