
export interface Document {
  id: string;
  name: string;
  type: string;
  date: string;
  size: string;
}

export interface ClinicDocumentsProps {
  documents?: Document[];
  className?: string;
  onUpload?: () => void;
  onViewAll?: () => void;
  patientId?: string;
}
