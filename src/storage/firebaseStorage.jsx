import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { signInAnonymously } from 'firebase/auth';
import { storage, auth } from './firebaseConfig';

let _authReady = false;

async function ensureFirebaseAuth() {
  if (_authReady && auth.currentUser) return;
  if (!auth.currentUser) {
    await signInAnonymously(auth);
  }
  _authReady = true;
}

function extractPathFromUrl(url) {
  try {
    const decoded = decodeURIComponent(url);
    const match = decoded.match(/\/o\/(.*?)\?/); // .../o/<path>?alt=...
    return match?.[1] ?? null;
  } catch {
    return null;
  }
}

export async function uploadFileToFirebase(file, folder = 'board') {
  if (!file) return null;

  await ensureFirebaseAuth();

  const safeName = `${Date.now()}_${Math.random().toString(36).slice(2)}_${file.name}`;
  const fileRef = ref(storage, `${folder}/${safeName}`);

  await uploadBytes(fileRef, file, {
    contentType: file.type || 'application/octet-stream',
  });

  const url = await getDownloadURL(fileRef);
  return url;
}

export async function deleteFileUrl(fileUrl) {
  if (!fileUrl) return;

  await ensureFirebaseAuth();

  const path = extractPathFromUrl(fileUrl);
  if (!path) return;

  const fileRef = ref(storage, path);
  await deleteObject(fileRef);
}
