import { useLocalSearchParams } from 'expo-router';
import { CrudForm } from '@/src/components/CrudForm';
import { clientes } from '@/src/collections/clientes';

export default function AlterarCliente() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <CrudForm key={id} def={clientes} id={id} />;
}
