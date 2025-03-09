
import { 
  MedicalReport, 
  MedicalAnalysis, 
  Biomarker, 
  BiomarkerValue,
  SymptomRecord,
  AnatomicalMapping,
  ExtractedBiomarker,
  Patient
} from '@/types/medicalData';
import { OpenAIService } from './openaiService';

export class DataSyncService {
  /**
   * Processes a medical report, analyzes it, and syncs all extracted data
   */
  static async processMedicalReport(
    report: MedicalReport, 
    currentPatient: Patient
  ): Promise<{
    updatedPatient: Patient;
    analysis: MedicalAnalysis;
  }> {
    try {
      // 1. Analyze the report
      const analysis = await OpenAIService.analyzeMedicalReport(report);
      
      // 2. Update the report with analysis ID
      const updatedReport = {
        ...report,
        analyzed: true,
        analysisId: analysis.id
      };
      
      // 3. Create updated biomarkers from the analysis
      const updatedBiomarkers = this.syncBiomarkers(
        analysis.extractedBiomarkers,
        currentPatient.biomarkers
      );
      
      // 4. Update symptom records if needed
      const updatedSymptoms = this.syncSymptoms(
        updatedBiomarkers,
        currentPatient.symptoms
      );
      
      // 5. Update anatomical mappings
      const updatedMappings = this.syncAnatomicalMappings(
        updatedBiomarkers,
        currentPatient.anatomicalMappings
      );
      
      // 6. Prepare the updated patient object
      const updatedPatient: Patient = {
        ...currentPatient,
        biomarkers: updatedBiomarkers,
        symptoms: updatedSymptoms,
        anatomicalMappings: updatedMappings,
        reports: [updatedReport, ...currentPatient.reports.filter(r => r.id !== report.id)],
        analyses: [analysis, ...currentPatient.analyses]
      };
      
      return {
        updatedPatient,
        analysis
      };
    } catch (error) {
      console.error('Error in processing medical report:', error);
      throw new Error('Failed to process medical report');
    }
  }
  
  /**
   * Synchronizes biomarkers with newly extracted values
   */
  private static syncBiomarkers(
    extractedBiomarkers: ExtractedBiomarker[],
    existingBiomarkers: Biomarker[]
  ): Biomarker[] {
    const timestamp = new Date().toISOString();
    const result = [...existingBiomarkers];
    
    // Process each extracted biomarker
    extractedBiomarkers.forEach(extracted => {
      // Try to find matching existing biomarker
      const existingIndex = result.findIndex(
        b => b.name.toLowerCase() === extracted.name.toLowerCase()
      );
      
      const newValue: BiomarkerValue = {
        value: extracted.value,
        unit: extracted.unit,
        normalRange: extracted.normalRange || 'Unknown',
        status: extracted.status || 'normal',
        timestamp,
        trend: 'stable' // Default value, will be updated if historical data exists
      };
      
      if (existingIndex >= 0) {
        // Update existing biomarker
        const existing = result[existingIndex];
        
        // Determine trend
        const previousValue = existing.latestValue.value;
        if (typeof previousValue === 'number' && typeof extracted.value === 'number') {
          newValue.trend = previousValue < extracted.value 
            ? 'increasing' 
            : previousValue > extracted.value 
              ? 'decreasing' 
              : 'stable';
        }
        
        // Update the biomarker
        result[existingIndex] = {
          ...existing,
          latestValue: newValue,
          historicalValues: [newValue, ...existing.historicalValues]
        };
      } else {
        // Create new biomarker
        const newBiomarker: Biomarker = {
          id: `bio-${Date.now()}-${Math.round(Math.random() * 1000)}`,
          name: extracted.name,
          category: this.categorizeBiomarker(extracted.name),
          description: this.getDefaultDescription(extracted.name),
          latestValue: newValue,
          historicalValues: [newValue],
          relatedSymptoms: this.getRelatedSymptoms(extracted.name),
          affectedBodyParts: this.getAffectedBodyParts(extracted.name),
          recommendations: this.getDefaultRecommendations(extracted.name, extracted.status || 'normal')
        };
        
        result.push(newBiomarker);
      }
    });
    
    return result;
  }
  
  /**
   * Updates symptom records based on biomarker changes
   */
  private static syncSymptoms(
    biomarkers: Biomarker[],
    existingSymptoms: SymptomRecord[]
  ): SymptomRecord[] {
    const result = [...existingSymptoms];
    const timestamp = new Date().toISOString();
    
    // Find abnormal biomarkers
    const abnormalBiomarkers = biomarkers.filter(
      b => b.latestValue.status !== 'normal'
    );
    
    // Create or update symptom records for abnormal biomarkers
    abnormalBiomarkers.forEach(biomarker => {
      biomarker.relatedSymptoms.forEach(symptomName => {
        // Check if this symptom already exists
        const existingIndex = result.findIndex(
          s => s.symptomName.toLowerCase() === symptomName.toLowerCase()
        );
        
        // Calculate severity based on biomarker status (1-10 scale)
        let severity = 3; // Default for 'low'/'elevated'
        if (biomarker.latestValue.status === 'critical') {
          severity = 8;
        }
        
        if (existingIndex >= 0) {
          // Update existing symptom
          result[existingIndex] = {
            ...result[existingIndex],
            severity: Math.max(result[existingIndex].severity, severity),
            timestamp,
            // Add this biomarker to related biomarkers if not already there
            relatedBiomarkers: [
              ...new Set([
                ...result[existingIndex].relatedBiomarkers,
                biomarker.id
              ])
            ]
          };
        } else {
          // Create new symptom record
          const newSymptom: SymptomRecord = {
            id: `sym-${Date.now()}-${Math.round(Math.random() * 1000)}`,
            symptomName,
            severity,
            timestamp,
            relatedBiomarkers: [biomarker.id],
            notes: `Auto-generated based on ${biomarker.name} levels`
          };
          
          result.push(newSymptom);
        }
      });
    });
    
    return result;
  }
  
  /**
   * Updates anatomical mappings based on biomarker changes
   */
  private static syncAnatomicalMappings(
    biomarkers: Biomarker[],
    existingMappings: AnatomicalMapping[]
  ): AnatomicalMapping[] {
    const result = [...existingMappings];
    
    // Find abnormal biomarkers
    const abnormalBiomarkers = biomarkers.filter(
      b => b.latestValue.status !== 'normal'
    );
    
    // Update anatomical mappings
    abnormalBiomarkers.forEach(biomarker => {
      biomarker.affectedBodyParts.forEach(bodyPart => {
        // Check if this body part already has a mapping
        const existingIndex = result.findIndex(
          m => m.bodyPart.toLowerCase() === bodyPart.toLowerCase()
        );
        
        // Calculate severity based on biomarker status (1-10 scale)
        let severity = 4; // Default for 'low'/'elevated'
        if (biomarker.latestValue.status === 'critical') {
          severity = 9;
        }
        
        if (existingIndex >= 0) {
          // Update existing mapping
          result[existingIndex] = {
            ...result[existingIndex],
            severity: Math.max(result[existingIndex].severity, severity),
            // Add this biomarker to affected biomarkers if not already there
            affectedBiomarkers: [
              ...new Set([
                ...result[existingIndex].affectedBiomarkers,
                biomarker.id
              ])
            ]
          };
        } else {
          // Create new anatomical mapping with default coordinates
          const coordinates = this.getDefaultCoordinates(bodyPart);
          
          const newMapping: AnatomicalMapping = {
            bodyPart,
            coordinates,
            affectedBiomarkers: [biomarker.id],
            severity,
            notes: `Auto-generated based on ${biomarker.name} levels`
          };
          
          result.push(newMapping);
        }
      });
    });
    
    return result;
  }
  
  /**
   * Categorizes a biomarker based on its name
   */
  private static categorizeBiomarker(name: string): string {
    const lowerName = name.toLowerCase();
    
    if (lowerName.includes('glucose') || lowerName.includes('a1c') || lowerName.includes('insulin')) {
      return 'Blood Sugar';
    } else if (lowerName.includes('cholesterol') || lowerName.includes('ldl') || lowerName.includes('hdl') || lowerName.includes('triglyceride')) {
      return 'Lipids';
    } else if (lowerName.includes('vitamin')) {
      return 'Vitamins';
    } else if (lowerName.includes('tsh') || lowerName.includes('t3') || lowerName.includes('t4') || lowerName.includes('thyroid')) {
      return 'Thyroid';
    } else if (lowerName.includes('hemoglobin') || lowerName.includes('hematocrit') || lowerName.includes('rbc') || lowerName.includes('wbc') || lowerName.includes('platelet')) {
      return 'Blood Count';
    } else if (lowerName.includes('iron') || lowerName.includes('ferritin')) {
      return 'Iron';
    } else if (lowerName.includes('sodium') || lowerName.includes('potassium') || lowerName.includes('calcium') || lowerName.includes('magnesium')) {
      return 'Electrolytes';
    } else if (lowerName.includes('creatinine') || lowerName.includes('bun') || lowerName.includes('egfr')) {
      return 'Kidney';
    } else if (lowerName.includes('alt') || lowerName.includes('ast') || lowerName.includes('bilirubin') || lowerName.includes('albumin')) {
      return 'Liver';
    } else if (lowerName.includes('pressure') || lowerName.includes('heart') || lowerName.includes('pulse')) {
      return 'Cardiovascular';
    }
    
    return 'Other';
  }
  
  /**
   * Returns default description for a biomarker
   */
  private static getDefaultDescription(name: string): string {
    const lowerName = name.toLowerCase();
    
    if (lowerName.includes('glucose')) {
      return 'Blood glucose is the main sugar found in your blood and your body\'s main source of energy.';
    } else if (lowerName.includes('cholesterol')) {
      return 'Cholesterol is a waxy substance found in your blood. Your body needs cholesterol to build healthy cells, but high levels can increase your risk of heart disease.';
    } else if (lowerName.includes('vitamin d')) {
      return 'Vitamin D is essential for strong bones, because it helps the body use calcium from the diet.';
    } else if (lowerName.includes('tsh')) {
      return 'Thyroid Stimulating Hormone (TSH) is produced by the pituitary gland and regulates the production of thyroid hormones.';
    } else if (lowerName.includes('hemoglobin')) {
      return 'Hemoglobin is a protein in your red blood cells that carries oxygen to your body\'s organs and tissues.';
    }
    
    return `${name} is an important biomarker for monitoring health status.`;
  }
  
  /**
   * Returns related symptoms for a biomarker
   */
  private static getRelatedSymptoms(name: string): string[] {
    const lowerName = name.toLowerCase();
    
    if (lowerName.includes('glucose')) {
      return ['Increased thirst', 'Frequent urination', 'Fatigue'];
    } else if (lowerName.includes('cholesterol')) {
      return ['No clear symptoms', 'May contribute to heart disease'];
    } else if (lowerName.includes('vitamin d')) {
      return ['Fatigue', 'Bone pain', 'Muscle weakness'];
    } else if (lowerName.includes('tsh') || lowerName.includes('thyroid')) {
      return ['Fatigue', 'Weight changes', 'Cold intolerance', 'Hair loss'];
    } else if (lowerName.includes('hemoglobin') || lowerName.includes('iron')) {
      return ['Fatigue', 'Weakness', 'Pale skin', 'Shortness of breath'];
    } else if (lowerName.includes('pressure')) {
      return ['Headache', 'Dizziness', 'Blurred vision'];
    } else if (lowerName.includes('creatinine') || lowerName.includes('egfr')) {
      return ['Swelling', 'Fatigue', 'Urination changes'];
    }
    
    return [];
  }
  
  /**
   * Returns affected body parts for a biomarker
   */
  private static getAffectedBodyParts(name: string): string[] {
    const lowerName = name.toLowerCase();
    
    if (lowerName.includes('glucose')) {
      return ['pancreas', 'kidneys', 'blood vessels'];
    } else if (lowerName.includes('cholesterol') || lowerName.includes('ldl') || lowerName.includes('hdl')) {
      return ['heart', 'blood vessels', 'liver'];
    } else if (lowerName.includes('vitamin d')) {
      return ['bones', 'muscles'];
    } else if (lowerName.includes('tsh') || lowerName.includes('thyroid')) {
      return ['thyroid', 'brain'];
    } else if (lowerName.includes('hemoglobin') || lowerName.includes('iron')) {
      return ['blood', 'bone marrow'];
    } else if (lowerName.includes('pressure')) {
      return ['heart', 'blood vessels', 'kidneys'];
    } else if (lowerName.includes('creatinine') || lowerName.includes('egfr')) {
      return ['kidneys'];
    } else if (lowerName.includes('alt') || lowerName.includes('ast') || lowerName.includes('bilirubin')) {
      return ['liver'];
    }
    
    return [];
  }
  
  /**
   * Returns default recommendations for a biomarker
   */
  private static getDefaultRecommendations(name: string, status: string): string[] {
    const lowerName = name.toLowerCase();
    
    if (status === 'normal') {
      return ['Continue current health practices', 'Regular monitoring at standard intervals'];
    }
    
    if (lowerName.includes('glucose') && status !== 'normal') {
      return [
        'Monitor diet and limit simple carbohydrates',
        'Regular physical activity',
        'Consider consulting with endocrinologist',
        'Regular glucose monitoring'
      ];
    } else if ((lowerName.includes('cholesterol') || lowerName.includes('ldl')) && status === 'elevated') {
      return [
        'Heart-healthy diet low in saturated fats',
        'Regular exercise',
        'Consider medication if levels remain high',
        'Follow up testing in 3-6 months'
      ];
    } else if (lowerName.includes('vitamin d') && status === 'low') {
      return [
        'Vitamin D supplementation',
        'Increased sun exposure (15-30 minutes daily)',
        'Dietary sources: fatty fish, egg yolks, fortified milk',
        'Retest levels in 3 months'
      ];
    } else if (lowerName.includes('tsh') && status === 'elevated') {
      return [
        'Consult with endocrinologist',
        'Consider thyroid hormone replacement therapy',
        'Regular thyroid function monitoring',
        'Monitor for symptoms of hypothyroidism'
      ];
    } else if ((lowerName.includes('hemoglobin') || lowerName.includes('iron')) && status === 'low') {
      return [
        'Iron supplementation',
        'Dietary sources: red meat, spinach, beans',
        'Vitamin C to enhance iron absorption',
        'Follow up testing in 3 months'
      ];
    }
    
    return [
      'Consult with healthcare provider',
      'Follow up testing recommended',
      'Monitor for changes in symptoms'
    ];
  }
  
  /**
   * Returns default coordinates for anatomical mapping
   */
  private static getDefaultCoordinates(bodyPart: string): { x: number; y: number } {
    const lowerPart = bodyPart.toLowerCase();
    
    // These coordinates are simplified for demo purposes
    // In a real implementation, these would be more precise mappings
    switch (lowerPart) {
      case 'heart':
        return { x: 50, y: 30 };
      case 'liver':
        return { x: 45, y: 40 };
      case 'kidneys':
        return { x: 50, y: 45 };
      case 'pancreas':
        return { x: 52, y: 42 };
      case 'thyroid':
        return { x: 50, y: 20 };
      case 'brain':
        return { x: 50, y: 10 };
      case 'bones':
        return { x: 50, y: 60 };
      case 'muscles':
        return { x: 70, y: 40 };
      case 'blood vessels':
        return { x: 60, y: 35 };
      case 'blood':
        return { x: 55, y: 50 };
      case 'bone marrow':
        return { x: 40, y: 65 };
      default:
        return { x: 50, y: 50 }; // Default center position
    }
  }
}
