
import { 
  OptmPatientData, 
  OptmAnalysisResult, 
  MusculoskeletalBiomarkers, 
  AnatomicalMeasurements, 
  MobilityMeasurements,
  ImagingData,
  ImprovementCategory,
  BIOMARKER_REFERENCE_RANGES
} from '@/types/optm-health';

/**
 * Calculate improvement category based on percentage
 */
export const calculateImprovementCategory = (percentChange: number): ImprovementCategory => {
  if (percentChange >= 30) return 'significant';
  if (percentChange >= 15) return 'moderate';
  if (percentChange > 0) return 'minimal';
  if (percentChange === 0) return 'no-change';
  return 'deterioration';
};

/**
 * Calculate improvement percentage between two values
 * For metrics where lower is better (like inflammatory markers), the formula is different
 */
export const calculateImprovement = (currentValue: number, previousValue: number, lowerIsBetter = true): number => {
  if (previousValue === 0) return 0; // Avoid division by zero
  
  if (lowerIsBetter) {
    // For metrics where lower values are better (like CRP, inflammation markers)
    return ((previousValue - currentValue) / previousValue) * 100;
  } else {
    // For metrics where higher values are better (like mobility angles)
    return ((currentValue - previousValue) / previousValue) * 100;
  }
};

/**
 * Determine if a biomarker is within normal range
 */
export const getBiomarkerStatus = (
  biomarker: keyof MusculoskeletalBiomarkers, 
  value: number
): 'normal' | 'elevated' | 'low' => {
  const range = BIOMARKER_REFERENCE_RANGES[biomarker];
  if (!range) return 'normal';
  
  if (value < range.min) return 'low';
  if (value > range.max) return 'elevated';
  return 'normal';
};

/**
 * Format reference range as a string
 */
export const formatReferenceRange = (biomarker: keyof MusculoskeletalBiomarkers): string => {
  const range = BIOMARKER_REFERENCE_RANGES[biomarker];
  if (!range) return 'Not available';
  
  return `${range.min} - ${range.max} ${range.unit}`;
};

/**
 * Generate notes for biomarker analysis based on value and improvement
 */
export const generateBiomarkerNotes = (
  biomarker: keyof MusculoskeletalBiomarkers,
  value: number,
  improvement: ImprovementCategory,
  improvementPercentage: number
): string => {
  const status = getBiomarkerStatus(biomarker, value);
  const range = BIOMARKER_REFERENCE_RANGES[biomarker];
  
  if (!range) return 'Insufficient data for analysis';
  
  let notes = '';
  
  // Add status description
  if (status === 'normal') {
    notes += `${biomarker.toUpperCase()} is within normal range. `;
  } else if (status === 'elevated') {
    notes += `${biomarker.toUpperCase()} is elevated above normal range. `;
  } else {
    notes += `${biomarker.toUpperCase()} is below normal range. `;
  }
  
  // Add improvement description
  if (improvement === 'significant') {
    notes += `Showing significant improvement (${improvementPercentage.toFixed(1)}%).`;
  } else if (improvement === 'moderate') {
    notes += `Showing moderate improvement (${improvementPercentage.toFixed(1)}%).`;
  } else if (improvement === 'minimal') {
    notes += `Showing minimal improvement (${improvementPercentage.toFixed(1)}%).`;
  } else if (improvement === 'no-change') {
    notes += `No significant change observed.`;
  } else {
    notes += `Shows deterioration (${Math.abs(improvementPercentage).toFixed(1)}% worse).`;
  }
  
  // Add biomarker-specific notes
  switch (biomarker) {
    case 'crp':
      notes += ' CRP is a general marker of inflammation.';
      break;
    case 'il6':
      notes += ' IL-6 plays a role in both pro- and anti-inflammatory responses.';
      break;
    case 'tnfAlpha':
      notes += ' TNF-α is a key inflammatory mediator.';
      break;
    case 'mmp9':
    case 'mmp13':
      notes += ' MMPs are involved in tissue remodeling and repair.';
      break;
    case 'ckMm':
      notes += ' CK-MM indicates muscle damage or recovery.';
      break;
    // Add other biomarker-specific notes as needed
  }
  
  return notes;
};

/**
 * Generate summary for anatomical measurement analysis
 */
export const generateAnatomicalNotes = (
  measurementName: string,
  improvement: ImprovementCategory,
  improvementPercentage: number
): string => {
  let notes = '';
  
  if (improvement === 'significant') {
    notes += `${measurementName} shows significant improvement (${improvementPercentage.toFixed(1)}%).`;
  } else if (improvement === 'moderate') {
    notes += `${measurementName} shows moderate improvement (${improvementPercentage.toFixed(1)}%).`;
  } else if (improvement === 'minimal') {
    notes += `${measurementName} shows minimal improvement (${improvementPercentage.toFixed(1)}%).`;
  } else if (improvement === 'no-change') {
    notes += `${measurementName} shows no significant change.`;
  } else {
    notes += `${measurementName} shows deterioration (${Math.abs(improvementPercentage).toFixed(1)}% worse).`;
  }
  
  // Add measurement-specific notes
  if (measurementName.includes('CTM')) {
    notes += ' Cervical translational measurement reflects neck alignment.';
  } else if (measurementName.includes('CCM')) {
    notes += ' Cervical circumference relates to soft tissue changes.';
  } else if (measurementName.includes('CAP')) {
    notes += ' Arm circumference indicates muscle mass and potential swelling.';
  } else if (measurementName.includes('CBP')) {
    notes += ' Brachial circumference relates to upper arm tissue status.';
  }
  
  return notes;
};

/**
 * Generate summary for mobility analysis
 */
export const generateMobilityNotes = (
  movementName: string,
  improvement: ImprovementCategory,
  improvementPercentage: number,
  currentValue: number
): string => {
  let notes = '';
  
  if (improvement === 'significant') {
    notes += `${movementName} shows significant improvement (${improvementPercentage.toFixed(1)}%).`;
  } else if (improvement === 'moderate') {
    notes += `${movementName} shows moderate improvement (${improvementPercentage.toFixed(1)}%).`;
  } else if (improvement === 'minimal') {
    notes += `${movementName} shows minimal improvement (${improvementPercentage.toFixed(1)}%).`;
  } else if (improvement === 'no-change') {
    notes += `${movementName} shows no significant change.`;
  } else {
    notes += `${movementName} shows deterioration (${Math.abs(improvementPercentage).toFixed(1)}% worse).`;
  }
  
  // Add reference to normal ranges
  if (movementName.includes('Knee Flexion')) {
    const normalRange = '135-150 degrees';
    notes += ` Normal range is ${normalRange}.`;
    if (currentValue < 135) {
      notes += ` Current value is below normal range.`;
    }
  } else if (movementName.includes('Knee Extension')) {
    notes += ` Full extension is 0 degrees (neutral position).`;
    if (currentValue > 5) {
      notes += ` Current value indicates extension deficit.`;
    }
  } else if (movementName.includes('Pelvic Tilt')) {
    notes += ` Normal anterior pelvic tilt is between 4-7 degrees.`;
  }
  
  return notes;
};

/**
 * Generate personalized treatment recommendations based on analysis results
 */
export const generateRecommendations = (
  analysisResult: Partial<OptmAnalysisResult>,
  patientData: OptmPatientData
): OptmAnalysisResult['recommendations'] => {
  const recommendations: OptmAnalysisResult['recommendations'] = [];
  
  // Analyze biomarkers for recommendations
  const inflammatoryIssues = analysisResult.biomarkerAnalysis?.filter(b => 
    (b.marker === 'crp' || b.marker === 'il6' || b.marker === 'tnfAlpha') && 
    b.status === 'elevated'
  );
  
  if (inflammatoryIssues && inflammatoryIssues.length > 0) {
    recommendations.push({
      category: 'medication',
      description: 'Consider anti-inflammatory protocol based on elevated inflammatory markers',
      priority: 'high'
    });
    
    recommendations.push({
      category: 'lifestyle',
      description: 'Recommend anti-inflammatory diet modifications and stress reduction techniques',
      priority: 'medium'
    });
  }
  
  // Analyze mobility for exercise recommendations
  const mobilityIssues = analysisResult.mobilityAnalysis?.filter(m =>
    m.improvement === 'minimal' || m.improvement === 'no-change' || m.improvement === 'deterioration'
  );
  
  if (mobilityIssues && mobilityIssues.length > 0) {
    // Knee-specific recommendations
    if (mobilityIssues.some(m => m.movement.includes('Knee'))) {
      recommendations.push({
        category: 'exercise',
        description: 'Implement progressive knee mobility protocol with focus on controlled ROM exercises',
        priority: 'high'
      });
    }
    
    // Pelvic-specific recommendations
    if (mobilityIssues.some(m => m.movement.includes('Pelvic'))) {
      recommendations.push({
        category: 'exercise',
        description: 'Add core stabilization and pelvic alignment exercises to treatment plan',
        priority: 'medium'
      });
    }
  }
  
  // Add follow-up recommendations based on overall status
  if (analysisResult.overallProgress?.status === 'significant' || 
      analysisResult.overallProgress?.status === 'moderate') {
    recommendations.push({
      category: 'follow-up',
      description: 'Schedule follow-up assessment in 4 weeks to monitor continued progress',
      priority: 'medium'
    });
  } else {
    recommendations.push({
      category: 'follow-up',
      description: 'Schedule follow-up assessment in 2 weeks to evaluate response to updated protocol',
      priority: 'high'
    });
  }
  
  // Add standard recommendations based on treatment stage
  if (patientData.treatmentStage === 'initial' || patientData.treatmentStage === 'early') {
    recommendations.push({
      category: 'exercise',
      description: 'Begin with gentle range of motion exercises focusing on proper form and pain-free movement',
      priority: 'high'
    });
  } else if (patientData.treatmentStage === 'intermediate') {
    recommendations.push({
      category: 'exercise',
      description: 'Progress to moderate resistance training with attention to proper biomechanics',
      priority: 'high'
    });
  } else if (patientData.treatmentStage === 'advanced') {
    recommendations.push({
      category: 'exercise',
      description: 'Implement functional movement patterns that simulate daily activities and sport-specific motions',
      priority: 'high'
    });
  } else if (patientData.treatmentStage === 'maintenance') {
    recommendations.push({
      category: 'lifestyle',
      description: 'Maintain home exercise program with periodic clinical reassessment',
      priority: 'medium'
    });
  }
  
  return recommendations;
};

/**
 * Generate a comprehensive analysis of OPTM patient data
 */
export const analyzeOptmPatientData = (
  currentData: OptmPatientData,
  previousData?: OptmPatientData
): OptmAnalysisResult => {
  // Initialize the analysis result
  const analysisResult: OptmAnalysisResult = {
    patientId: currentData.patientId,
    overallProgress: {
      status: 'no-change',
      summary: ''
    },
    biomarkerAnalysis: [],
    anatomicalAnalysis: [],
    mobilityAnalysis: [],
    imagingAnalysis: [],
    recommendations: [],
    createdAt: new Date().toISOString()
  };
  
  // Analyze biomarkers
  if (currentData.biomarkers) {
    Object.entries(currentData.biomarkers).forEach(([key, value]) => {
      const biomarker = key as keyof MusculoskeletalBiomarkers;
      
      // Skip if value is undefined
      if (value === undefined) return;
      
      const previousValue = previousData?.biomarkers?.[biomarker];
      
      // Determine if lower values are better for this biomarker (true for most inflammatory markers)
      const lowerIsBetter = ['crp', 'il6', 'tnfAlpha', 'mda', 'comp', 'mmp9', 'mmp13', 'dDimer', 'substanceP'].includes(biomarker);
      
      let improvementPercentage = 0;
      if (previousValue !== undefined) {
        improvementPercentage = calculateImprovement(value, previousValue, lowerIsBetter);
      }
      
      const improvement = calculateImprovementCategory(improvementPercentage);
      
      analysisResult.biomarkerAnalysis.push({
        marker: biomarker,
        value: value,
        referenceRange: formatReferenceRange(biomarker),
        status: getBiomarkerStatus(biomarker, value),
        improvement,
        improvementPercentage,
        notes: generateBiomarkerNotes(biomarker, value, improvement, improvementPercentage)
      });
    });
  }
  
  // Analyze anatomical measurements
  // Example for CTM
  if (currentData.anatomicalMeasurements?.ctm !== undefined) {
    const currentValue = currentData.anatomicalMeasurements.ctm;
    const previousValue = previousData?.anatomicalMeasurements?.ctm;
    
    if (previousValue !== undefined) {
      const improvementPercentage = calculateImprovement(currentValue, previousValue, true); // Lower is better for CTM
      const improvement = calculateImprovementCategory(improvementPercentage);
      
      analysisResult.anatomicalAnalysis.push({
        measurement: 'Cervical Translational Measurement (CTM)',
        current: currentValue,
        previous: previousValue,
        improvement,
        improvementPercentage,
        notes: generateAnatomicalNotes('CTM', improvement, improvementPercentage)
      });
    }
  }
  
  // Process circumference measurements (CCM, CAP, CBP)
  // This is a simplified example for CCM
  if (currentData.anatomicalMeasurements?.ccm && currentData.anatomicalMeasurements.ccm.length > 0) {
    currentData.anatomicalMeasurements.ccm.forEach((ccm, index) => {
      const previousCcm = previousData?.anatomicalMeasurements?.ccm?.[index];
      
      if (previousCcm) {
        const improvementPercentage = calculateImprovement(ccm.value, previousCcm.value, true); // Lower is generally better for circumference in inflammation
        const improvement = calculateImprovementCategory(improvementPercentage);
        
        analysisResult.anatomicalAnalysis.push({
          measurement: `Cervical Circumference (${ccm.location})`,
          current: ccm.value,
          previous: previousCcm.value,
          improvement,
          improvementPercentage,
          notes: generateAnatomicalNotes(`CCM at ${ccm.location}`, improvement, improvementPercentage)
        });
      }
    });
  }
  
  // Analyze mobility measurements
  if (currentData.mobilityMeasurements?.kneeFlexion) {
    const currentValue = currentData.mobilityMeasurements.kneeFlexion.value;
    const previousValue = previousData?.mobilityMeasurements?.kneeFlexion?.value;
    
    if (previousValue !== undefined) {
      const improvementPercentage = calculateImprovement(currentValue, previousValue, false); // Higher is better for knee flexion
      const improvement = calculateImprovementCategory(improvementPercentage);
      const side = currentData.mobilityMeasurements.kneeFlexion.side;
      
      analysisResult.mobilityAnalysis.push({
        movement: `Knee Flexion (${side})`,
        current: currentValue,
        previous: previousValue,
        improvement,
        improvementPercentage,
        notes: generateMobilityNotes(`Knee Flexion (${side})`, improvement, improvementPercentage, currentValue)
      });
    }
  }
  
  if (currentData.mobilityMeasurements?.kneeExtension) {
    const currentValue = currentData.mobilityMeasurements.kneeExtension.value;
    const previousValue = previousData?.mobilityMeasurements?.kneeExtension?.value;
    
    if (previousValue !== undefined) {
      const improvementPercentage = calculateImprovement(currentValue, previousValue, true); // Lower is better for knee extension (closer to 0°)
      const improvement = calculateImprovementCategory(improvementPercentage);
      const side = currentData.mobilityMeasurements.kneeExtension.side;
      
      analysisResult.mobilityAnalysis.push({
        movement: `Knee Extension (${side})`,
        current: currentValue,
        previous: previousValue,
        improvement,
        improvementPercentage,
        notes: generateMobilityNotes(`Knee Extension (${side})`, improvement, improvementPercentage, currentValue)
      });
    }
  }
  
  if (currentData.mobilityMeasurements?.pelvicTilt) {
    const currentValue = currentData.mobilityMeasurements.pelvicTilt.value;
    const previousValue = previousData?.mobilityMeasurements?.pelvicTilt?.value;
    
    if (previousValue !== undefined) {
      // For pelvic tilt, we want to be closer to normal range (4-7 degrees)
      const currentDeviation = Math.abs(currentValue - 5.5); // 5.5 is middle of normal range
      const previousDeviation = Math.abs(previousValue - 5.5);
      
      const improvementPercentage = ((previousDeviation - currentDeviation) / previousDeviation) * 100;
      const improvement = calculateImprovementCategory(improvementPercentage);
      
      analysisResult.mobilityAnalysis.push({
        movement: 'Pelvic Tilt Angle',
        current: currentValue,
        previous: previousValue,
        improvement,
        improvementPercentage,
        notes: generateMobilityNotes('Pelvic Tilt Angle', improvement, improvementPercentage, currentValue)
      });
    }
  }
  
  // Analyze imaging (simplified)
  if (currentData.imaging && currentData.imaging.length > 0) {
    // Group by body part to compare pre and post
    const imagingByBodyPart = new Map<string, ImagingData[]>();
    
    [...(previousData?.imaging || []), ...currentData.imaging].forEach(img => {
      if (!imagingByBodyPart.has(img.bodyPart)) {
        imagingByBodyPart.set(img.bodyPart, []);
      }
      imagingByBodyPart.get(img.bodyPart)?.push(img);
    });
    
    imagingByBodyPart.forEach((images, bodyPart) => {
      const preImage = images.find(img => img.stage === 'pre-treatment');
      const postImage = images.find(img => img.stage === 'post-treatment');
      
      if (preImage && postImage) {
        // In a real application, this would involve more sophisticated analysis
        // For now, we'll just add a placeholder
        analysisResult.imagingAnalysis.push({
          type: `${postImage.type.toUpperCase()} - ${bodyPart}`,
          findings: `Post-treatment ${postImage.type} of ${bodyPart} shows structural changes`,
          comparison: `Compared to pre-treatment imaging from ${new Date(preImage.date).toLocaleDateString()}`,
          improvement: 'moderate' // This would be determined by actual analysis
        });
      }
    });
  }
  
  // Calculate overall progress
  const calculateOverallProgress = (): ImprovementCategory => {
    // Collect all individual improvements
    const allImprovements = [
      ...analysisResult.biomarkerAnalysis.map(b => b.improvement),
      ...analysisResult.anatomicalAnalysis.map(a => a.improvement),
      ...analysisResult.mobilityAnalysis.map(m => m.improvement)
    ];
    
    // Count occurrences of each category
    const counts = {
      significant: allImprovements.filter(i => i === 'significant').length,
      moderate: allImprovements.filter(i => i === 'moderate').length,
      minimal: allImprovements.filter(i => i === 'minimal').length,
      'no-change': allImprovements.filter(i => i === 'no-change').length,
      deterioration: allImprovements.filter(i => i === 'deterioration').length
    };
    
    // Determine overall status based on prevalence
    if (counts.significant > counts.moderate && counts.significant > counts.minimal) {
      return 'significant';
    } else if (counts.moderate > counts.minimal) {
      return 'moderate';
    } else if (counts.minimal > counts['no-change'] && counts.minimal > counts.deterioration) {
      return 'minimal';
    } else if (counts['no-change'] > counts.deterioration) {
      return 'no-change';
    } else {
      return 'deterioration';
    }
  };
  
  // Generate overall progress summary
  const generateOverallSummary = (status: ImprovementCategory): string => {
    const patientName = currentData.name;
    const treatmentStage = currentData.treatmentStage;
    
    switch (status) {
      case 'significant':
        return `${patientName} shows significant improvement across multiple metrics in the ${treatmentStage} treatment stage. Biomarkers indicate reduced inflammation and tissue repair progression. Mobility and anatomical measurements confirm clinical progress.`;
      
      case 'moderate':
        return `${patientName} demonstrates moderate improvement in the ${treatmentStage} treatment stage. Several biomarkers are trending positively, and functional measurements show improved mobility.`;
      
      case 'minimal':
        return `${patientName} shows minimal improvement in the ${treatmentStage} treatment stage. Some positive changes in biomarkers and measurements, but progress is slower than expected.`;
      
      case 'no-change':
        return `${patientName} shows no significant change in most metrics during the ${treatmentStage} treatment stage. Treatment protocol may need adjustment to improve outcomes.`;
      
      case 'deterioration':
        return `${patientName} demonstrates deterioration in several key metrics during the ${treatmentStage} treatment stage. Urgent protocol revision and follow-up are recommended.`;
      
      default:
        return `${patientName} is currently in the ${treatmentStage} treatment stage. Insufficient data to determine overall progress.`;
    }
  };
  
  // Set overall progress
  const overallStatus = calculateOverallProgress();
  analysisResult.overallProgress = {
    status: overallStatus,
    summary: generateOverallSummary(overallStatus)
  };
  
  // Generate recommendations
  analysisResult.recommendations = generateRecommendations(analysisResult, currentData);
  
  return analysisResult;
};

/**
 * Prepare data for visualization in the dashboard
 */
export const prepareVisualizationData = (
  currentData: OptmPatientData,
  previousData?: OptmPatientData,
  analysisResult?: OptmAnalysisResult
) => {
  // Biomarker chart data
  const biomarkerChartData = Object.entries(currentData.biomarkers)
    .filter(([_, value]) => value !== undefined)
    .map(([key, value]) => {
      const biomarker = key as keyof MusculoskeletalBiomarkers;
      const range = BIOMARKER_REFERENCE_RANGES[biomarker];
      const previousValue = previousData?.biomarkers?.[biomarker];
      
      return {
        name: biomarker,
        current: value,
        previous: previousValue || 0,
        min: range?.min || 0,
        max: range?.max || 0
      };
    });
  
  // Anatomical measurement chart data
  const anatomicalChartData = [];
  
  // Add CTM data if available
  if (currentData.anatomicalMeasurements?.ctm !== undefined) {
    anatomicalChartData.push({
      name: 'CTM',
      current: currentData.anatomicalMeasurements.ctm,
      previous: previousData?.anatomicalMeasurements?.ctm || 0
    });
  }
  
  // Add CCM data if available
  if (currentData.anatomicalMeasurements?.ccm && currentData.anatomicalMeasurements.ccm.length > 0) {
    currentData.anatomicalMeasurements.ccm.forEach((ccm, index) => {
      anatomicalChartData.push({
        name: `CCM-${ccm.location}`,
        current: ccm.value,
        previous: previousData?.anatomicalMeasurements?.ccm?.[index]?.value || 0
      });
    });
  }
  
  // Mobility chart data
  const mobilityChartData = [];
  
  if (currentData.mobilityMeasurements?.kneeFlexion) {
    mobilityChartData.push({
      name: `Knee Flexion (${currentData.mobilityMeasurements.kneeFlexion.side})`,
      current: currentData.mobilityMeasurements.kneeFlexion.value,
      previous: previousData?.mobilityMeasurements?.kneeFlexion?.value || 0,
      target: 135 // Normal minimum knee flexion
    });
  }
  
  if (currentData.mobilityMeasurements?.kneeExtension) {
    mobilityChartData.push({
      name: `Knee Extension (${currentData.mobilityMeasurements.kneeExtension.side})`,
      current: currentData.mobilityMeasurements.kneeExtension.value,
      previous: previousData?.mobilityMeasurements?.kneeExtension?.value || 0,
      target: 0 // Target for full extension
    });
  }
  
  if (currentData.mobilityMeasurements?.pelvicTilt) {
    mobilityChartData.push({
      name: 'Pelvic Tilt',
      current: currentData.mobilityMeasurements.pelvicTilt.value,
      previous: previousData?.mobilityMeasurements?.pelvicTilt?.value || 0,
      target: 5.5 // Middle of normal range
    });
  }
  
  // Prepare radar chart data for composite view
  const radarChartData = [];
  
  // Normalize values for radar chart (0-100 scale)
  if (analysisResult) {
    // Biomarkers (convert to improvement percentage for visualization)
    analysisResult.biomarkerAnalysis.forEach(biomarker => {
      // Skip if improvement percentage is negative
      if (biomarker.improvementPercentage < 0) return;
      
      // Cap at 100% for visualization
      const normalizedValue = Math.min(biomarker.improvementPercentage, 100);
      
      radarChartData.push({
        metric: biomarker.marker,
        value: normalizedValue
      });
    });
    
    // Mobility
    analysisResult.mobilityAnalysis.forEach(mobility => {
      // Skip if improvement percentage is negative
      if (mobility.improvementPercentage < 0) return;
      
      // Cap at 100% for visualization
      const normalizedValue = Math.min(mobility.improvementPercentage, 100);
      
      radarChartData.push({
        metric: mobility.movement,
        value: normalizedValue
      });
    });
  }
  
  return {
    biomarkerChartData,
    anatomicalChartData,
    mobilityChartData,
    radarChartData,
    overallProgress: analysisResult?.overallProgress,
    recommendations: analysisResult?.recommendations
  };
};
