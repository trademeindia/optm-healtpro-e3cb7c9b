
import { MedicalAnalysis } from '@/types/medicalData';
import { openai } from './openaiClient';
import { normalizeStatus } from './statusUtils';
import { ParsedResponse } from './types';

const extractReportAnalysis = async (reportContent: string): Promise<MedicalAnalysis> => {
  try {
    const prompt = `Analyze the following medical report and extract key information:
  
  ${reportContent}
  
  Provide a concise summary, list the key findings, suggest recommendations, and extract specific biomarker values with their units, normal ranges, and status.
  
  The response should be in JSON format:
  
  \`\`\`json
  {
  "summary": "A brief summary of the report's overall findings.",
  "keyFindings": ["Finding 1", "Finding 2", ...],
  "recommendations": ["Recommendation 1", "Recommendation 2", ...],
  "extractedBiomarkers": [
  {
  "name": "Biomarker Name",
  "value": "Value",
  "unit": "Unit",
  "normalRange": "Normal Range",
  "status": "normal | elevated | low | critical"
  },
  ...
  ]
  }
  \`\`\`
  `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are an AI assistant specialized in analyzing medical reports and extracting relevant information." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message?.content;

    if (!content) {
      throw new Error("No content returned from OpenAI.");
    }

    let parsedResponse: ParsedResponse;
    try {
      parsedResponse = JSON.parse(content) as ParsedResponse;
    } catch (error) {
      console.error("Failed to parse JSON response:", error);
      console.error("Raw content from OpenAI:", content);
      throw new Error("Failed to parse JSON response from OpenAI.");
    }

    // Map the response to our interface
    const analysis: Partial<MedicalAnalysis> = {
      summary: parsedResponse.summary,
      keyFindings: parsedResponse.keyFindings,
      recommendations: parsedResponse.recommendations,
      extractedBiomarkers: parsedResponse.extractedBiomarkers.map(biomarker => ({
        name: biomarker.name,
        value: biomarker.value,
        unit: biomarker.unit,
        normalRange: biomarker.normalRange,
        status: normalizeStatus(biomarker.status)
      }))
    };

    // Validate that required fields are present
    if (!analysis.summary || !analysis.keyFindings || !analysis.recommendations || !analysis.extractedBiomarkers) {
      console.error("Incomplete analysis data:", analysis);
      throw new Error("Incomplete analysis data received from OpenAI.");
    }

    return analysis as MedicalAnalysis;

  } catch (error) {
    console.error("Error in OpenAI Service:", error);
    throw error;
  }
};

export default extractReportAnalysis;
