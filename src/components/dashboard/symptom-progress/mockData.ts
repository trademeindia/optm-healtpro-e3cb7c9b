
import { ChartData } from './types';

export const getSymptomsMockData = (): ChartData[] => {
  return [{
    symptomName: 'Shoulder Pain',
    color: '#FF8787',
    data: [{
      name: 'Jun 1',
      date: '2023-06-01',
      value: 8
    }, {
      name: 'Jun 3',
      date: '2023-06-03',
      value: 7
    }, {
      name: 'Jun 5',
      date: '2023-06-05',
      value: 7
    }, {
      name: 'Jun 7',
      date: '2023-06-07',
      value: 6
    }, {
      name: 'Jun 9',
      date: '2023-06-09',
      value: 5
    }, {
      name: 'Jun 11',
      date: '2023-06-11',
      value: 4
    }, {
      name: 'Jun 13',
      date: '2023-06-13',
      value: 3
    }, {
      name: 'Jun 15',
      date: '2023-06-15',
      value: 2
    }]
  }, {
    symptomName: 'Back Pain',
    color: '#5D5FEF',
    data: [{
      name: 'Jun 1',
      date: '2023-06-01',
      value: 3
    }, {
      name: 'Jun 3',
      date: '2023-06-03',
      value: 4
    }, {
      name: 'Jun 5',
      date: '2023-06-05',
      value: 5
    }, {
      name: 'Jun 7',
      date: '2023-06-07',
      value: 5
    }, {
      name: 'Jun 9',
      date: '2023-06-09',
      value: 4
    }, {
      name: 'Jun 11',
      date: '2023-06-11',
      value: 3
    }, {
      name: 'Jun 13',
      date: '2023-06-13',
      value: 2
    }, {
      name: 'Jun 15',
      date: '2023-06-15',
      value: 1
    }]
  }, {
    symptomName: 'Headache',
    color: '#F97316',
    data: [{
      name: 'Jun 1',
      date: '2023-06-01',
      value: 2
    }, {
      name: 'Jun 3',
      date: '2023-06-03',
      value: 3
    }, {
      name: 'Jun 5',
      date: '2023-06-05',
      value: 6
    }, {
      name: 'Jun 7',
      date: '2023-06-07',
      value: 4
    }, {
      name: 'Jun 9',
      date: '2023-06-09',
      value: 2
    }, {
      name: 'Jun 11',
      date: '2023-06-11',
      value: 0
    }, {
      name: 'Jun 13',
      date: '2023-06-13',
      value: 1
    }, {
      name: 'Jun 15',
      date: '2023-06-15',
      value: 0
    }]
  }];
};
