import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Pottery } from '../store/types';

const COLLECTION_NAME = 'pottery';

/**
 * Fetch all pottery items from Firestore
 */
export const fetchPotteryItems = async (): Promise<Pottery[]> => {
  try {
    const potteryCollection = collection(db, COLLECTION_NAME);
    const q = query(potteryCollection, orderBy('dateCreated', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const items: Pottery[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Remove non-serializable Firestore timestamps before storing in Redux
      const { createdAt, updatedAt, ...serializableData } = data;
      items.push({
        id: doc.id,
        ...serializableData
      } as Pottery);
    });
    
    return items;
  } catch (error) {
    console.error('Error fetching pottery items:', error);
    throw error;
  }
};

/**
 * Fetch a single pottery item by ID
 */
export const fetchPotteryById = async (id: string): Promise<Pottery | null> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      // Remove non-serializable Firestore timestamps before storing in Redux
      const { createdAt, updatedAt, ...serializableData } = data;
      return {
        id: docSnap.id,
        ...serializableData
      } as Pottery;
    }
    return null;
  } catch (error) {
    console.error('Error fetching pottery item:', error);
    throw error;
  }
};

/**
 * Add a new pottery item to Firestore
 */
export const addPotteryItem = async (pottery: Omit<Pottery, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...pottery,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding pottery item:', error);
    throw error;
  }
};

/**
 * Update an existing pottery item in Firestore
 */
export const updatePotteryItem = async (pottery: Pottery): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, pottery.id);
    const { id, ...updateData } = pottery;
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating pottery item:', error);
    throw error;
  }
};

/**
 * Delete a pottery item from Firestore
 */
export const deletePotteryItem = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting pottery item:', error);
    throw error;
  }
};

