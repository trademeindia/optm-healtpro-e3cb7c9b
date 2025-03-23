
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Internal state for offline queue management
let offlineQueue: Array<any> = [];
let isProcessingQueue = false;

/**
 * Process offline queue of detection data
 */
export async function processOfflineQueue(): Promise<boolean> {
  if (isProcessingQueue || offlineQueue.length === 0) return false;
  
  isProcessingQueue = true;
  console.log(`Processing offline queue: ${offlineQueue.length} items`);
  
  try {
    // Check connection
    const { error: pingError } = await supabase.from('analysis_sessions').select('id').limit(1);
    
    if (pingError) {
      console.log('Still offline, keeping queue for later processing');
      isProcessingQueue = false;
      return false;
    }
    
    // Process queue in batches
    const batchSize = 10;
    while (offlineQueue.length > 0) {
      const batch = offlineQueue.splice(0, batchSize);
      
      for (const item of batch) {
        try {
          await supabase.from('body_analysis').insert(item);
        } catch (error) {
          console.error('Error processing queue item:', error);
        }
      }
      
      // Wait briefly between batches
      if (offlineQueue.length > 0) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    console.log('Offline queue processed successfully');
    toast.success('Synced offline data with server');
    return true;
  } catch (error) {
    console.error('Error processing offline queue:', error);
    return false;
  } finally {
    isProcessingQueue = false;
  }
}

/**
 * Add an item to the offline queue
 */
export function addToOfflineQueue(item: any): void {
  offlineQueue.push(item);
}

/**
 * Get the offline queue status
 */
export function getOfflineQueueStatus() {
  return {
    itemsCount: offlineQueue.length,
    isProcessing: isProcessingQueue
  };
}

/**
 * Force sync of offline queue
 */
export async function forceSync(): Promise<boolean> {
  if (offlineQueue.length === 0) return true;
  
  try {
    return await processOfflineQueue();
  } catch (error) {
    console.error('Error in forceSync:', error);
    return false;
  }
}
