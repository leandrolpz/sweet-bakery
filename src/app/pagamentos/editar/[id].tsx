import { useLocalSearchParams } from 'expo-router';
import { CrudForm } from '@/src/components/CrudForm';
import { pagamentos } from '@/src/collections/pagamentos';

export default function AlterarPagamento() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <CrudForm key={id} def={pagamentos} id={id} />;
}
