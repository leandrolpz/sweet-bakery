import { useLocalSearchParams } from 'expo-router';
import { CrudForm } from '@/src/components/CrudForm';
import { pedidos } from '@/src/collections/pedidos';

export default function AlterarPedido() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <CrudForm key={id} def={pedidos} id={id} />;
}
