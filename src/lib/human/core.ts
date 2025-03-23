
import * as tf from '@tensorflow/tfjs';
import * as Human from '@vladmandic/human';
import { humanConfig } from './config';

// Configure TensorFlow.js - prefer WebGL for best performance
if (typeof window !== 'undefined') {
  tf.setBackend('webgl');
  console.log('TensorFlow backend:', tf.getBackend());
}

// Initialize Human instance
export const human = new Human.Human(humanConfig);

// Pre-warm model to avoid delay on first detection
export const warmupModel = async (): Promise<void> => {
  try {
    console.log('Warming up Human.js model...');
    await human.load();
    console.log('Human.js model loaded and ready');
    
    // Optional: run a dummy detection to fully warm up the model
    if (typeof document !== 'undefined') {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, 64, 64);
        await human.detect(canvas);
      }
    }
  } catch (error) {
    console.error('Error warming up Human.js model:', error);
  }
};
