import {
  addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where,
} from 'firebase/firestore';
import { db } from '@/src/services/firebase';
import type { Row } from '@/src/collections/types';

/** O Firestore rejeita `undefined`; o round-trip por JSON remove essas chaves. */
const clean = <T,>(v: T): T => JSON.parse(JSON.stringify(v));

export async function createRecord(col: string, data: object) {
  const ref = await addDoc(collection(db, col), clean(data));
  return ref.id;
}

export async function updateRecord(col: string, id: string, data: object) {
  await updateDoc(doc(db, col, id), clean(data));
}

export async function deleteRecord(col: string, id: string) {
  await deleteDoc(doc(db, col, id));
}

export async function getRecord(col: string, id: string): Promise<Row | null> {
  const snap = await getDoc(doc(db, col, id));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Row) : null;
}

export async function countWhere(col: string, field: string, value: string) {
  const snap = await getDocs(query(collection(db, col), where(field, '==', value)));
  return snap.size;
}
