import { useRouter } from 'expo-router';
import { EmptyState } from '@/src/components/ui/blocks';
import { Button } from '@/src/components/ui/Button';

export default function NotFound() {
  const router = useRouter();
  return (
    <EmptyState emoji="🍩" title="Página não encontrada" text="O endereço não existe. Use o menu para voltar ao sistema.">
      <Button label="Ir para o início" onPress={() => router.replace('/')} />
    </EmptyState>
  );
}
