
import { useCallback, useEffect } from 'react';
import { RecordItem } from '../types';
import { useRecordsLoading } from './useRecordsLoading';
import { useRecordsSorting } from './useRecordsSorting';
import { useRecordsOperations } from './useRecordsOperations';

export const useRecordActions = (patientId: string) => {
  const { records, reports, loadRecords } = useRecordsLoading(patientId);
  const { sortField, sortDirection, handleSort, sortItems } = useRecordsSorting();
  const { handleAddRecord, handleAddReport, handleDeleteRecord } = useRecordsOperations(patientId, loadRecords);

  // Load records when the component mounts or patientId changes
  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  const sortedRecords = sortItems(records);
  const sortedReports = sortItems(reports);

  return {
    records,
    reports,
    sortedRecords,
    sortedReports,
    sortField,
    sortDirection,
    loadRecords,
    handleSort,
    handleAddRecord,
    handleAddReport,
    handleDeleteRecord
  };
};
