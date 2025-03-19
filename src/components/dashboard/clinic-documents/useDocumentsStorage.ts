
import { useState, useEffect, useCallback } from 'react';
import { getFromLocalStorage, storeInLocalStorage } from '@/services/storage/localStorageService';
import { Document } from './types';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

export const useDocumentsStorage = (patientId?: string) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [documentType, setDocumentType] = useState('all');
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const loadDocuments = useCallback(() => {
    try {
      // Get documents from localStorage
      const storedDocuments = getFromLocalStorage('clinic_documents');
      
      // Filter for current patient if patientId is provided
      const filteredDocuments = patientId
        ? storedDocuments.filter((doc: any) => doc.patientId === patientId)
        : storedDocuments;
      
      setDocuments(filteredDocuments);
    } catch (error) {
      console.error('Error loading documents:', error);
      setDocuments([]);
    }
  }, [patientId]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const addDocument = (document: Omit<Document, 'id' | 'createdAt'>) => {
    try {
      const newDocument = {
        ...document,
        id: uuidv4(),
        createdAt: new Date().toISOString()
      };

      const storedDocuments = getFromLocalStorage('clinic_documents');
      storeInLocalStorage('clinic_documents', [...storedDocuments, newDocument]);
      
      loadDocuments();
      return true;
    } catch (error) {
      console.error('Error adding document:', error);
      return false;
    }
  };

  const deleteDocument = (id: string) => {
    try {
      const storedDocuments = getFromLocalStorage('clinic_documents');
      const updatedDocuments = storedDocuments.filter((doc: any) => doc.id !== id);
      
      storeInLocalStorage('clinic_documents', updatedDocuments);
      loadDocuments();
      
      toast.success('Document deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document');
      return false;
    }
  };

  // Filter and sort documents
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = documentType === 'all' || doc.type === documentType;
    return matchesSearch && matchesType;
  });

  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
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
    documents: sortedDocuments,
    searchTerm,
    setSearchTerm,
    documentType,
    setDocumentType,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    addDocument,
    deleteDocument,
    loadDocuments
  };
};
