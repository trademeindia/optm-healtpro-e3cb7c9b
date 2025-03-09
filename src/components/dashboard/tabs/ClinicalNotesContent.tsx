
import React from 'react';

const ClinicalNotesContent: React.FC = () => {
  return (
    <>
      <p className="text-sm text-muted-foreground mb-6">Clinical notes and observations</p>
      
      <div className="space-y-4">
        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-medium">Initial Consultation Note</h4>
            <span className="text-xs text-muted-foreground">Jun 5, 2023</span>
          </div>
          <p className="text-sm">
            Patient presented with pain in the left shoulder. Pain is described as sharp and worsens with movement.
            X-ray shows calcific deposits in the supraspinatus tendon. Diagnosis: Calcific tendinitis of the left shoulder.
            Treatment plan includes NSAIDs, physical therapy, and calcium supplements.
          </p>
        </div>
        
        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-medium">Follow-up Visit</h4>
            <span className="text-xs text-muted-foreground">Jun 12, 2023</span>
          </div>
          <p className="text-sm">
            Patient reports moderate improvement in pain levels. Range of motion is still limited but improving.
            Continued with current medication regimen. Recommended continued physical therapy sessions.
            Will reassess in two weeks.
          </p>
        </div>
      </div>
    </>
  );
};

export default ClinicalNotesContent;
