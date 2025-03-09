
export const generateAIAnswer = async (question: string): Promise<{ answer: string; sources: string[] }> => {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Generate more detailed contextual answers based on the question content
  let answer = "";
  let sources: string[] = [];
  
  if (question.toLowerCase().includes("cholesterol") || question.toLowerCase().includes("ldl")) {
    answer = "Based on your lipid panel, your LDL cholesterol is slightly elevated at 130 mg/dL (optimal <100 mg/dL). This isn't immediately dangerous but warrants attention through diet modification, exercise, and possibly follow-up testing in 3-6 months. Reducing saturated fats and increasing soluble fiber may help lower LDL levels naturally.";
    sources = ["American Heart Association", "Mayo Clinic", "National Lipid Association"];
  } else if (question.toLowerCase().includes("diet") || question.toLowerCase().includes("food") || question.toLowerCase().includes("eat")) {
    answer = "Based on your results, consider a diet rich in soluble fiber (oats, beans, fruits), omega-3 fatty acids (fatty fish, walnuts), and plant sterols. Limit saturated fats and trans fats. The Mediterranean diet has strong evidence supporting heart health. For more personalized advice, consider consulting with a registered dietitian.";
    sources = ["Harvard Health Publication", "Cleveland Clinic", "American College of Cardiology"];
  } else if (question.toLowerCase().includes("vitamin") || question.toLowerCase().includes("supplement")) {
    answer = "Your Vitamin D level is 45 ng/mL, which is within the sufficient range (30-50 ng/mL). Continue your current supplementation if any. Omega-3 supplements may be beneficial if your triglycerides are elevated. For other supplements, consult with your healthcare provider as needs vary based on individual health factors.";
    sources = ["National Institutes of Health", "Endocrine Society", "American Association of Clinical Endocrinology"];
  } else if (question.toLowerCase().includes("exercise") || question.toLowerCase().includes("physical")) {
    answer = "Regular physical activity can help manage your cholesterol levels. Aim for at least 150 minutes of moderate-intensity exercise weekly (e.g., brisk walking, swimming) or 75 minutes of vigorous activity. Resistance training 2-3 times per week is also beneficial. Your healthy blood pressure suggests your current activity level is beneficial.";
    sources = ["American College of Sports Medicine", "CDC", "World Health Organization"];
  } else {
    answer = "This is important to discuss with your healthcare provider at your next appointment. They can provide personalized advice based on your complete medical history and examination. Consider writing down specific concerns to discuss during your visit. For urgent medical questions, please call our expert assistance line.";
    sources = ["Medical Literature"];
  }
  
  return { answer, sources };
};
