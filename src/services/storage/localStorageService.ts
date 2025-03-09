
/**
 * Service to handle localStorage operations as a temporary solution
 * until the proper Supabase schema is set up
 */

/**
 * Store data in localStorage with a prefixed key
 */
export const storeInLocalStorage = (key: string, data: any): void => {
  try {
    // Get existing data
    const existingData = localStorage.getItem(`medical_${key}`);
    let dataArray = existingData ? JSON.parse(existingData) : [];
    
    // Add new data
    if (Array.isArray(dataArray)) {
      // Replace if item with same ID exists
      const index = dataArray.findIndex((item: any) => item.id === data.id);
      if (index !== -1) {
        dataArray[index] = data;
      } else {
        dataArray.push(data);
      }
    } else {
      dataArray = [data];
    }
    
    // Store updated array
    localStorage.setItem(`medical_${key}`, JSON.stringify(dataArray));
  } catch (error) {
    console.error(`Error storing ${key} in localStorage:`, error);
  }
};

/**
 * Get data from localStorage with a prefixed key
 */
export const getFromLocalStorage = (key: string): any[] => {
  try {
    const data = localStorage.getItem(`medical_${key}`);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Error retrieving ${key} from localStorage:`, error);
    return [];
  }
};

/**
 * Get a specific item by ID from localStorage
 */
export const getItemByIdFromLocalStorage = (key: string, id: string): any | null => {
  try {
    const items = getFromLocalStorage(key);
    return items.find((item: any) => item.id === id) || null;
  } catch (error) {
    console.error(`Error retrieving item by ID from localStorage:`, error);
    return null;
  }
};
