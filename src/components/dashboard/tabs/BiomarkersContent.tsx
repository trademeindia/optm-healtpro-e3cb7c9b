
import React from 'react';

const BiomarkersContent: React.FC = () => {
  return (
    <>
      <p className="text-sm text-muted-foreground mb-6">Key biomarkers and health metrics</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-3 w-3 rounded-full bg-red-500"></div>
            <h4 className="font-medium">Fasting Blood Sugar</h4>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <span className="text-2xl font-bold">116</span>
              <span className="text-sm text-muted-foreground ml-1">mg/dL</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-muted-foreground">Normal: 70-99 mg/dL</span>
              <div className="flex items-center mt-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-red-500">
                  <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 12H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 16V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-xs ml-1 text-red-500">+17%</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
            <h4 className="font-medium">HbA1c</h4>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <span className="text-2xl font-bold">5.5</span>
              <span className="text-sm text-muted-foreground ml-1">%</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-muted-foreground">Normal: &lt; 5.7%</span>
              <div className="flex items-center mt-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-green-500">
                  <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 12H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-xs ml-1 text-green-500">Stable</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-3 w-3 rounded-full bg-blue-500"></div>
            <h4 className="font-medium">Blood Pressure</h4>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <span className="text-2xl font-bold">120/80</span>
              <span className="text-sm text-muted-foreground ml-1">mmHg</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-muted-foreground">Normal: &lt; 120/80 mmHg</span>
              <div className="flex items-center mt-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-green-500">
                  <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 12H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-xs ml-1 text-green-500">Stable</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BiomarkersContent;
