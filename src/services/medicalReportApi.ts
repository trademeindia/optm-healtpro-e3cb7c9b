
/**
 * Re-export medical report services from their modularized files
 * This file is maintained for backward compatibility
 */

import { MedicalReportService } from './reports/medicalReportService';
import { ReportInsightsService } from './reports/reportInsightsService';

/**
 * Legacy class that forwards to the new modular services
 * @deprecated Use MedicalReportService and ReportInsightsService directly
 */
export class MedicalReportService extends MedicalReportService {
  /**
   * @deprecated Use ReportInsightsService.generateInsightsFromAnalysis directly
   */
  static async generateInsightsFromAnalysis(...args: Parameters<typeof ReportInsightsService.generateInsightsFromAnalysis>) {
    return ReportInsightsService.generateInsightsFromAnalysis(...args);
  }
}

export { MedicalReportService, ReportInsightsService };
