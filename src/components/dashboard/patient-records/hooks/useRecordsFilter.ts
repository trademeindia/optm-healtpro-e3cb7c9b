
import { useState, useEffect } from 'react';
import { RecordItem } from '../types';

export const useRecordsFilter = (
  sortedRecords: RecordItem[],
  sortedReports: RecordItem[]
) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('records');

  // Filter records based on search term
  const filteredRecords = sortedRecords.filter(record => 
    record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (record.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter reports based on search term
  const filteredReports = sortedReports.filter(report => 
    report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (report.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    searchTerm,
    setSearchTerm,
    filteredRecords,
    filteredReports,
    activeTab,
    setActiveTab
  };
};
