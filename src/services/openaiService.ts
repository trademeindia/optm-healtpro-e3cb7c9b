
import OpenAI from 'openai';
import { ExtractedBiomarker, MedicalAnalysis, MedicalReport } from '@/types/medicalData';

// Initialize OpenAI client
// In production, use environment variables for the API key
const openai = new OpenAI({
  apiKey: 'sk-demo-key-replace-in-production',
  dangerouslyAllowBrowser: true // Only for demo, use server-side in production
});

export class OpenAIService {
  /**
   * Analyzes a medical report using OpenAI to extract biomarkers and insights
   */
  static async analyzeMedicalReport(report: MedicalReport): Promise<MedicalAnalysis> {
    try {
      console.log(`Analyzing medical report: ${report.id}`);

      let content = report.content;
      
      // For file uploads that might contain image data
      if (report.source === 'upload' && report.fileType?.includes('image')) {
        // In a real implementation, we would send the image to OpenAI
        // For demo purposes, we're using placeholder content
        content = `[Image-based medical report content would be processed here]`;
      }

      // Structure the prompt for biomarker extraction
      const prompt = `
        As a medical AI assistant, analyze this medical report and extract the following:
        1. All biomarkers mentioned with their values, units, and normal ranges
        2. A summary of the report
        3. Key findings (max 5 points)
        4. Recommendations based on the findings (max 3)
        
        Medical Report:
        ${content}
        
        Format your response as a JSON object with these keys:
        {
          "summary": "Brief summary of the report",
          "keyFindings": ["Finding 1", "Finding 2", ...],
          "recommendations": ["Recommendation 1", "Recommendation 2", ...],
          "extractedBiomarkers": [
            {
              "name": "Biomarker name",
              "value": "numerical or string value",
              "unit": "measurement unit",
              "normalRange": "normal range if mentioned",
              "status": "one of: normal, elevated, low, critical"
            },
            ...
          ]
        }
      `;

      // DEMO MODE: In production, this would be a real API call to OpenAI
      // For demo purposes, we'll simulate a response based on the report type
      const simulatedResponse = this.generateSimulatedResponse(report.reportType);
      
      return {
        id: `analysis-${Date.now()}`,
        reportId: report.id,
        timestamp: new Date().toISOString(),
        summary: simulatedResponse.summary,
        keyFindings: simulatedResponse.keyFindings,
        recommendations: simulatedResponse.recommendations,
        extractedBiomarkers: simulatedResponse.extractedBiomarkers,
      };
      
      /* PRODUCTION CODE (commented out for demo):
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a medical AI assistant that extracts structured data from medical reports."
          },
          { 
            role: "user", 
            content: prompt 
          }
        ],
        response_format: { type: "json_object" }
      });
      
      const analysisData = JSON.parse(response.choices[0].message.content || '{}');
      
      return {
        id: `analysis-${Date.now()}`,
        reportId: report.id,
        timestamp: new Date().toISOString(),
        summary: analysisData.summary || "No summary available",
        keyFindings: analysisData.keyFindings || [],
        recommendations: analysisData.recommendations || [],
        extractedBiomarkers: analysisData.extractedBiomarkers || [],
      };
      */
    } catch (error) {
      console.error('Error analyzing medical report:', error);
      // Return a basic analysis object on error
      return {
        id: `analysis-error-${Date.now()}`,
        reportId: report.id,
        timestamp: new Date().toISOString(),
        summary: "Analysis failed. Please try again.",
        keyFindings: ["Analysis error occurred"],
        recommendations: ["Contact technical support"],
        extractedBiomarkers: [],
      };
    }
  }

  /**
   * Generates a simulated response for demo purposes
   * In production, this would be replaced with actual OpenAI API calls
   */
  private static generateSimulatedResponse(reportType: string): {
    summary: string;
    keyFindings: string[];
    recommendations: string[];
    extractedBiomarkers: ExtractedBiomarker[];
  } {
    // Default response
    let response = {
      summary: "Comprehensive health screening shows overall good health with some areas for improvement.",
      keyFindings: [
        "All vital signs within normal ranges",
        "Cholesterol levels slightly elevated",
        "Vitamin D levels lower than optimal",
        "Blood pressure optimal",
        "Fasting glucose normal"
      ],
      recommendations: [
        "Consider dietary changes to reduce cholesterol",
        "Vitamin D supplementation recommended",
        "Follow up in 6 months for routine monitoring"
      ],
      extractedBiomarkers: [
        {
          name: "Total Cholesterol",
          value: 210,
          unit: "mg/dL",
          normalRange: "<200 mg/dL",
          status: "elevated"
        },
        {
          name: "HDL Cholesterol",
          value: 55,
          unit: "mg/dL",
          normalRange: ">40 mg/dL",
          status: "normal"
        },
        {
          name: "LDL Cholesterol",
          value: 130,
          unit: "mg/dL",
          normalRange: "<100 mg/dL",
          status: "elevated"
        },
        {
          name: "Triglycerides",
          value: 120,
          unit: "mg/dL",
          normalRange: "<150 mg/dL",
          status: "normal"
        },
        {
          name: "Vitamin D",
          value: 25,
          unit: "ng/mL",
          normalRange: "30-50 ng/mL",
          status: "low"
        },
        {
          name: "Fasting Glucose",
          value: 92,
          unit: "mg/dL",
          normalRange: "70-99 mg/dL",
          status: "normal"
        },
        {
          name: "Blood Pressure",
          value: "120/80",
          unit: "mmHg",
          normalRange: "<130/80 mmHg",
          status: "normal"
        }
      ]
    };

    // Customize based on report type
    if (reportType.toLowerCase().includes('blood')) {
      response = {
        summary: "Complete blood count shows healthy red and white blood cell levels with slight anemia indicated.",
        keyFindings: [
          "Hemoglobin slightly below normal range",
          "White blood cell count normal, indicating no active infection",
          "Platelet count within normal range",
          "Red blood cell morphology normal",
          "Iron saturation lower than optimal"
        ],
        recommendations: [
          "Consider iron supplementation",
          "Increase dietary intake of iron-rich foods",
          "Follow up in 3 months to reassess hemoglobin levels"
        ],
        extractedBiomarkers: [
          {
            name: "Hemoglobin",
            value: 11.8,
            unit: "g/dL",
            normalRange: "12.0-15.5 g/dL",
            status: "low"
          },
          {
            name: "White Blood Cell Count",
            value: 7.5,
            unit: "10^3/µL",
            normalRange: "4.5-11.0 10^3/µL",
            status: "normal"
          },
          {
            name: "Platelet Count",
            value: 250,
            unit: "10^3/µL",
            normalRange: "150-450 10^3/µL",
            status: "normal"
          },
          {
            name: "Iron",
            value: 65,
            unit: "µg/dL",
            normalRange: "65-175 µg/dL",
            status: "normal"
          },
          {
            name: "Ferritin",
            value: 20,
            unit: "ng/mL",
            normalRange: "20-250 ng/mL",
            status: "low"
          },
          {
            name: "Iron Saturation",
            value: 18,
            unit: "%",
            normalRange: "20-50%",
            status: "low"
          },
          {
            name: "Red Blood Cell Count",
            value: 4.2,
            unit: "10^6/µL",
            normalRange: "4.0-5.2 10^6/µL",
            status: "normal"
          }
        ]
      };
    } else if (reportType.toLowerCase().includes('thyroid')) {
      response = {
        summary: "Thyroid function test indicates subclinical hypothyroidism with elevated TSH and normal T4 levels.",
        keyFindings: [
          "TSH levels elevated above normal range",
          "Free T4 within normal parameters",
          "T3 levels normal",
          "Anti-TPO antibodies elevated, suggesting autoimmune thyroiditis",
          "Thyroglobulin levels normal"
        ],
        recommendations: [
          "Consider thyroid hormone replacement therapy consultation",
          "Monitor for clinical symptoms of hypothyroidism",
          "Follow up testing in 3 months"
        ],
        extractedBiomarkers: [
          {
            name: "TSH",
            value: 6.8,
            unit: "mIU/L",
            normalRange: "0.4-4.0 mIU/L",
            status: "elevated"
          },
          {
            name: "Free T4",
            value: 1.2,
            unit: "ng/dL",
            normalRange: "0.8-1.8 ng/dL",
            status: "normal"
          },
          {
            name: "Free T3",
            value: 3.2,
            unit: "pg/mL",
            normalRange: "2.3-4.2 pg/mL",
            status: "normal"
          },
          {
            name: "Anti-TPO Antibodies",
            value: 120,
            unit: "IU/mL",
            normalRange: "<35 IU/mL",
            status: "elevated"
          },
          {
            name: "Thyroglobulin",
            value: 15,
            unit: "ng/mL",
            normalRange: "1.40-29.2 ng/mL",
            status: "normal"
          }
        ]
      };
    }

    return response;
  }
}
