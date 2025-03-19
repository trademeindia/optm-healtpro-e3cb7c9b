
import { MedicalRecord, MedicalReport } from '../types';

export const useRecordsFilter = (
  records: MedicalRecord[],
  reports: MedicalReport[],
  searchTerm: string,
  recordType: string,
  sortBy: 'date' | 'name',
  sortOrder: 'asc' | 'desc'
) => {
  // Filter records
  const filteredRecords = records.filter(record => {
    const matchesSearch = record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (record.notes || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = recordType === 'all' || record.type === recordType;
    return matchesSearch && matchesType;
  });

  // Filter reports
  const filteredReports = reports.filter(report => {
    return report.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Sort records
  const sortedRecords = [...filteredRecords].sort((a, b) => {
    if (sortBy === 'date') {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    } else {
      return sortOrder === 'asc' 
        ? a.name.localeCompare(b.name) 
        : b.name.localeCompare(a.name);
    }
  });

  // Sort reports
  const sortedReports = [...filteredReports].sort((a, b) => {
    if (sortBy === 'date') {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    } else {
      return sortOrder === 'asc' 
        ? a.title.localeCompare(b.title) 
        : b.title.localeCompare(a.title);
    }
  });

  // Combine sorted data for "all" tab
  const combinedData = [
    ...sortedRecords.map(record => ({
      id: record.id,
      name: record.name,
      date: record.date,
      type: record.recordType || record.type,
      isReport: false
    })),
    ...sortedReports.map(report => ({
      id: report.id,
      name: report.title,
      date: report.date,
      type: report.fileType,
      isReport: true
    }))
  ].sort((a, b) => {
    if (sortBy === 'date') {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    } else {
      return sortOrder === 'asc' 
        ? a.name.localeCompare(b.name) 
        : b.name.localeCompare(a.name);
    }
  });

  return {
    filteredRecords,
    filteredReports,
    sortedRecords,
    sortedReports,
    combinedData
  };
};
