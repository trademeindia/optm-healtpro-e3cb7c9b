
import { Biomarker as ComponentBiomarker } from './types';
import { Biomarker as DataBiomarker } from '@/data/mockBiomarkerData';

export const convertBiomarkerToComponentFormat = (biomarker: DataBiomarker): ComponentBiomarker => {
  return {
    ...biomarker,
    lastUpdated: biomarker.timestamp,
  };
};
