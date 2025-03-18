
import { vi } from 'vitest';
import { 
  formatHealthMetric, 
  hasHealthData, 
  getChangeIndicator, 
  formatChange, 
  getChangeClass, 
  getChangeIcon,
  getMetricIcon
} from '../utils';
import { FitnessData } from '@/hooks/useFitnessIntegration';
import { Activity, Heart, Footprints, Flame, Navigation, Moon, Clock } from 'lucide-react';

describe('DeviceSync Utils', () => {
  describe('formatHealthMetric', () => {
    test('formats numeric values with units', () => {
      expect(formatHealthMetric(75, 'bpm')).toBe('75 bpm');
      expect(formatHealthMetric(10000, 'steps')).toBe('10000 steps');
      expect(formatHealthMetric(7.5, 'hours')).toBe('7.5 hours');
    });

    test('formats string values with units', () => {
      expect(formatHealthMetric('120/80', 'mmHg')).toBe('120/80 mmHg');
    });
  });

  describe('hasHealthData', () => {
    test('returns true when health data has keys', () => {
      const mockData: FitnessData = {
        heartRate: {
          name: 'Heart Rate',
          value: 72,
          unit: 'bpm',
          timestamp: '2023-01-01',
          source: 'Google Fit'
        }
      };
      expect(hasHealthData(mockData)).toBe(true);
    });

    test('returns false when health data is empty', () => {
      expect(hasHealthData({})).toBe(false);
    });
  });

  describe('getChangeIndicator', () => {
    test('returns positive for positive values', () => {
      expect(getChangeIndicator(5)).toBe('positive');
      expect(getChangeIndicator(0.1)).toBe('positive');
    });

    test('returns negative for negative values', () => {
      expect(getChangeIndicator(-5)).toBe('negative');
      expect(getChangeIndicator(-0.1)).toBe('negative');
    });

    test('returns neutral for zero', () => {
      expect(getChangeIndicator(0)).toBe('neutral');
    });
  });

  describe('formatChange', () => {
    test('formats positive change with a + prefix', () => {
      expect(formatChange(5)).toBe('+5%');
      expect(formatChange(10.5)).toBe('+10.5%');
    });

    test('formats negative change without a prefix', () => {
      expect(formatChange(-5)).toBe('-5%');
      expect(formatChange(-10.5)).toBe('-10.5%');
    });

    test('formats zero change', () => {
      expect(formatChange(0)).toBe('+0%');
    });
  });

  describe('getChangeClass', () => {
    test('returns green class for positive values', () => {
      expect(getChangeClass(5)).toBe('text-green-500');
    });

    test('returns red class for negative values', () => {
      expect(getChangeClass(-5)).toBe('text-red-500');
    });

    test('returns gray class for zero', () => {
      expect(getChangeClass(0)).toBe('text-gray-500');
    });
  });

  describe('getChangeIcon', () => {
    test('returns trending_up for positive values', () => {
      expect(getChangeIcon(5)).toBe('trending_up');
    });

    test('returns trending_down for negative values', () => {
      expect(getChangeIcon(-5)).toBe('trending_down');
    });

    test('returns remove for zero', () => {
      expect(getChangeIcon(0)).toBe('remove');
    });
  });

  describe('getMetricIcon', () => {
    test('returns Footprints icon for steps', () => {
      expect(getMetricIcon('steps')).toBe(Footprints);
    });

    test('returns Heart icon for heart rate', () => {
      expect(getMetricIcon('heart rate')).toBe(Heart);
    });

    test('returns Flame icon for calories', () => {
      expect(getMetricIcon('calories')).toBe(Flame);
    });

    test('returns Navigation icon for distance', () => {
      expect(getMetricIcon('distance')).toBe(Navigation);
    });

    test('returns Moon icon for sleep', () => {
      expect(getMetricIcon('sleep')).toBe(Moon);
    });

    test('returns Clock icon for active minutes', () => {
      expect(getMetricIcon('active minutes')).toBe(Clock);
    });

    test('returns Activity icon for unknown metric types', () => {
      expect(getMetricIcon('unknown')).toBe(Activity);
    });

    test('is case insensitive', () => {
      expect(getMetricIcon('STEPS')).toBe(Footprints);
      expect(getMetricIcon('Heart Rate')).toBe(Heart);
    });
  });
});
