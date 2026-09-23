import { getApps, initializeApp } from 'firebase/app';
import { getFirestore, initializeFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCzrL36UE6LdAhb5vkK7aoNtZ9iXoWwRHA',
  authDomain: 'sweet-bakery-2a724.firebaseapp.com',
  projectId: 'sweet-bakery-2a724',
  storageBucket: 'sweet-bakery-2a724.firebasestorage.app',
  messagingSenderId: '157659751772',
  appId: '1:157659751772:web:9efc6503626762d22a8d99',
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// Long polling automático evita travamentos do Firestore em redes/dispositivos móveis.
// initializeFirestore só pode rodar uma vez (o Fast Refresh recarrega o módulo) — daí o fallback.
function createDb() {
  try {
    return initializeFirestore(app, { experimentalAutoDetectLongPolling: true });
  } catch {
    return getFirestore(app);
  }
}

export const db = createDb();
