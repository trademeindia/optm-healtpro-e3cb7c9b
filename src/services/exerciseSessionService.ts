
import { ExerciseSession } from '@/components/exercises/body-tracker/types';

/**
 * Save exercise session data
 * @param session The exercise session to save
 */
export const saveExerciseSession = async (session: ExerciseSession): Promise<void> => {
  // For now, we'll just simulate saving to localStorage
  try {
    // Get existing sessions from localStorage
    const existingSessions = JSON.parse(localStorage.getItem('exercise_sessions') || '[]');
    
    // Add the new session
    const updatedSessions = [session, ...existingSessions];
    
    // Save back to localStorage
    localStorage.setItem('exercise_sessions', JSON.stringify(updatedSessions));
    
    console.log('Session saved successfully', session);
    return Promise.resolve();
  } catch (error) {
    console.error('Error saving exercise session:', error);
    return Promise.reject(error);
  }
};

/**
 * Get all saved exercise sessions
 */
export const getExerciseSessions = async (): Promise<ExerciseSession[]> => {
  try {
    const sessions = JSON.parse(localStorage.getItem('exercise_sessions') || '[]');
    return Promise.resolve(sessions);
  } catch (error) {
    console.error('Error getting exercise sessions:', error);
    return Promise.reject(error);
  }
};

/**
 * Delete an exercise session
 * @param sessionId ID of the session to delete
 */
export const deleteExerciseSession = async (sessionId: string): Promise<void> => {
  try {
    const existingSessions = JSON.parse(localStorage.getItem('exercise_sessions') || '[]');
    const updatedSessions = existingSessions.filter((session: ExerciseSession) => 
      session.timestamp !== sessionId
    );
    
    localStorage.setItem('exercise_sessions', JSON.stringify(updatedSessions));
    return Promise.resolve();
  } catch (error) {
    console.error('Error deleting exercise session:', error);
    return Promise.reject(error);
  }
};
