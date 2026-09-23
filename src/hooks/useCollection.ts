import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/src/services/firebase';
import type { Row } from '@/src/collections/types';

/** Lê uma collection em tempo real: cadastrar, alterar ou excluir atualiza as telas sozinho. */
export function useCollection(name: string) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const unsubscribe = onSnapshot(
      collection(db, name),
      (snap) => {
        setRows(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Row));
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
    );
    return unsubscribe;
  }, [name]);

  return { rows, loading, error };
}
