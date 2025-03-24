
/**
 * Human.js library integration
 * Provides pose detection and analysis functionality
 */

import * as Human from '@vladmandic/human';
import { humanConfig } from './config';

// Create global Human.js instance
export const human = new Human.Human(humanConfig);

// Create and export standardized interface
export * from './angles';
export * from './biomarkers';
export * from './config';
export * from './types';
