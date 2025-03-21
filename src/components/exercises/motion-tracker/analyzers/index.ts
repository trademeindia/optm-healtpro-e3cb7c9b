
import { squatAnalyzer } from './squat-analyzer';
import { lungeAnalyzer } from './lunge-analyzer';
import { pushupAnalyzer } from './pushup-analyzer';
import { plankAnalyzer } from './plank-analyzer';

// Map of exercise types to their analyzers
export const exerciseAnalyzers = {
  squat: squatAnalyzer,
  lunge: lungeAnalyzer,
  pushup: pushupAnalyzer,
  plank: plankAnalyzer
};
