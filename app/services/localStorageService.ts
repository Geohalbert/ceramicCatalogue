import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pottery } from '../store/types';

const POTTERY_STORAGE_KEY = '@pottery_items';

/**
 * Fetch all pottery items from local storage
 */
export const fetchLocalPotteryItems = async (): Promise<Pottery[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(POTTERY_STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Error fetching local pottery items:', error);
    return [];
  }
};

/**
 * Save pottery items to local storage
 */
export const saveLocalPotteryItems = async (items: Pottery[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(items);
    await AsyncStorage.setItem(POTTERY_STORAGE_KEY, jsonValue);
  } catch (error) {
    console.error('Error saving local pottery items:', error);
    throw error;
  }
};

/**
 * Add a pottery item to local storage
 */
export const addLocalPotteryItem = async (pottery: Omit<Pottery, 'id'>): Promise<Pottery> => {
  try {
    const items = await fetchLocalPotteryItems();
    const newPottery: Pottery = {
      ...pottery,
      id: Date.now().toString(),
    };
    items.push(newPottery);
    await saveLocalPotteryItems(items);
    return newPottery;
  } catch (error) {
    console.error('Error adding local pottery item:', error);
    throw error;
  }
};

/**
 * Update a pottery item in local storage
 */
export const updateLocalPotteryItem = async (pottery: Pottery): Promise<Pottery> => {
  try {
    const items = await fetchLocalPotteryItems();
    const index = items.findIndex(item => item.id === pottery.id);
    
    if (index !== -1) {
      items[index] = pottery;
      await saveLocalPotteryItems(items);
      return pottery;
    }
    
    throw new Error('Pottery item not found');
  } catch (error) {
    console.error('Error updating local pottery item:', error);
    throw error;
  }
};

/**
 * Delete a pottery item from local storage
 */
export const deleteLocalPotteryItem = async (id: string): Promise<void> => {
  try {
    const items = await fetchLocalPotteryItems();
    const filteredItems = items.filter(item => item.id !== id);
    await saveLocalPotteryItems(filteredItems);
  } catch (error) {
    console.error('Error deleting local pottery item:', error);
    throw error;
  }
};

/**
 * Clear all pottery items from local storage
 */
export const clearLocalPotteryItems = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(POTTERY_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing local pottery items:', error);
    throw error;
  }
};

