
import { initializeSampleAppointments } from './sampleAppointments';
import { getFromLocalStorage } from '../storage/localStorageService';

/**
 * Initialize calendar service and load sample data if needed
 */
export const initializeCalendarService = () => {
  try {
    // Check if appointments already exist
    const existingAppointments = getFromLocalStorage('appointments');
    
    // If no appointments exist, initialize with sample data
    if (existingAppointments.length === 0) {
      initializeSampleAppointments();
    }
    
    console.log('Calendar service initialized');
  } catch (error) {
    console.error('Error initializing calendar service:', error);
  }
};
