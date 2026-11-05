import { readFileSync } from 'node:fs';
import { initializeApp } from 'firebase/app';
import { doc, getFirestore, setDoc } from 'firebase/firestore';

const leer = (ruta) => JSON.parse(readFileSync(new URL(ruta, import.meta.url), 'utf8'));

const db = getFirestore(initializeApp(leer('../src/app/services/firebase.config.json')));
const datos = leer('../db.json');

try {
  for (const coleccion of ['usuarios', 'productos']) {
    for (const { id, ...item } of datos[coleccion]) {
      await setDoc(doc(db, coleccion, id), item);
    }
    console.log(`${coleccion}: ${datos[coleccion].length} documentos migrados`);
  }
  process.exit(0);
} catch (error) {
  console.error(`No se pudo migrar: ${error.message}`);
  process.exit(1);
}
