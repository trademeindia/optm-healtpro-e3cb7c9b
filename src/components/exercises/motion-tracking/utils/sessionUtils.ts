
// Re-export all session-related functionality from the newly refactored files
export { createSession } from './sessionCreation';
export { saveDetectionData, getOfflineQueueStatus } from './saveDetectionData';
export { completeSession } from './sessionCompletion';
export { forceSync } from './offlineQueueManager';
