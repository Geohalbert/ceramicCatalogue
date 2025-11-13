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

/**
 * Remove undefined values from an object
 * Firestore doesn't accept undefined, only null or omit the field
 */
const removeUndefinedFields = <T extends Record<string, any>>(obj: T): Partial<T> => {
  const cleaned: any = {};
  for (const key in obj) {
    if (obj[key] !== undefined) {
      cleaned[key] = obj[key];
    }
  }
  return cleaned;
};

/**
 * Get the user's pottery collection path
 */
const getUserPotteryCollection = (userId: string) => {
  return collection(db, 'users', userId, 'pottery');
};

/**
 * Fetch all pottery items from Firestore for a specific user
 */
export const fetchPotteryItems = async (userId: string): Promise<Pottery[]> => {
  try {
    const potteryCollection = getUserPotteryCollection(userId);
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
 * Fetch a single pottery item by ID for a specific user
 */
export const fetchPotteryById = async (userId: string, id: string): Promise<Pottery | null> => {
  try {
    const docRef = doc(db, 'users', userId, 'pottery', id);
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
 * Add a new pottery item to Firestore for a specific user
 */
export const addPotteryItem = async (userId: string, pottery: Omit<Pottery, 'id'>): Promise<string> => {
  try {
    const potteryCollection = getUserPotteryCollection(userId);
    // Remove undefined values before saving to Firestore
    const cleanedPottery = removeUndefinedFields(pottery);
    const docRef = await addDoc(potteryCollection, {
      ...cleanedPottery,
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
 * Update an existing pottery item in Firestore for a specific user
 */
export const updatePotteryItem = async (userId: string, pottery: Pottery): Promise<void> => {
  try {
    const docRef = doc(db, 'users', userId, 'pottery', pottery.id);
    const { id, ...updateData } = pottery;
    // Remove undefined values before saving to Firestore
    const cleanedUpdateData = removeUndefinedFields(updateData);
    await updateDoc(docRef, {
      ...cleanedUpdateData,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating pottery item:', error);
    throw error;
  }
};

/**
 * Delete a pottery item from Firestore for a specific user
 */
export const deletePotteryItem = async (userId: string, id: string): Promise<void> => {
  try {
    const docRef = doc(db, 'users', userId, 'pottery', id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting pottery item:', error);
    throw error;
  }
};

