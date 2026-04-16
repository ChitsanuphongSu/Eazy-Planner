import { db } from '../firebase';
import { 
  collection, doc, setDoc, updateDoc, deleteDoc, 
  onSnapshot, getDoc, query, where, orderBy 
} from 'firebase/firestore';

// Todo Operations
export function subscribeToTasks(userId, callback) {
  const ref = collection(db, `users/${userId}/tasks`);
  return onSnapshot(ref, snapshot => {
    const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Sort logic usually applied in UI, but we can do it here if needed
    callback(tasks.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
  });
}

export function saveTask(userId, task) {
  const ref = doc(db, `users/${userId}/tasks/${task.id}`);
  return setDoc(ref, task);
}

export function updateTask(userId, taskId, data) {
  const ref = doc(db, `users/${userId}/tasks/${taskId}`);
  return updateDoc(ref, data);
}

export function deleteTask(userId, taskId) {
  const ref = doc(db, `users/${userId}/tasks/${taskId}`);
  return deleteDoc(ref);
}

// Same logic can be mapped out for Schedule and Calendar
export function subscribeToCollection(userId, collectionName, callback) {
  const ref = collection(db, `users/${userId}/${collectionName}`);
  return onSnapshot(ref, snapshot => {
    const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(items);
  });
}

export function saveDocument(userId, collectionName, data) {
  const ref = doc(db, `users/${userId}/${collectionName}/${data.id}`);
  return setDoc(ref, data);
}

export function updateDocument(userId, collectionName, id, data) {
  const ref = doc(db, `users/${userId}/${collectionName}/${id}`);
  return updateDoc(ref, data);
}

export function deleteDocument(userId, collectionName, id) {
  const ref = doc(db, `users/${userId}/${collectionName}/${id}`);
  return deleteDoc(ref);
}

// User Settings
export function subscribeToSettings(userId, collectionName, documentName, callback, defaultSettings) {
  const ref = doc(db, `users/${userId}/${collectionName}/${documentName}`);
  return onSnapshot(ref, docSnap => {
     if (docSnap.exists()) {
       callback(docSnap.data());
     } else {
       callback(defaultSettings);
       setDoc(ref, defaultSettings);
     }
  });
}

export function updateSettings(userId, collectionName, documentName, data) {
  const ref = doc(db, `users/${userId}/${collectionName}/${documentName}`);
  return updateDoc(ref, data);
}
