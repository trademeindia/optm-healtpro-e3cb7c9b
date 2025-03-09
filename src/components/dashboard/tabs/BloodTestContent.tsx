
import React from 'react';

const BloodTestContent: React.FC = () => {
  return (
    <>
      <p className="text-sm text-muted-foreground mb-6">Blood test results and lab reports</p>
      
      <div className="border rounded-lg overflow-hidden">
        <div className="grid grid-cols-5 bg-muted p-3 text-sm font-medium">
          <div>Test Name</div>
          <div>Value</div>
          <div>Normal Range</div>
          <div>Date</div>
          <div>Status</div>
        </div>
        <div className="divide-y">
          <div className="grid grid-cols-5 p-3 text-sm hover:bg-gray-50">
            <div>Hemoglobin</div>
            <div>14.2 g/dL</div>
            <div>13.5-17.5 g/dL</div>
            <div>Jun 10, 2023</div>
            <div><span className="px-2 py-0.5 rounded-full bg-green-100 text-green-800 text-xs">Normal</span></div>
          </div>
          <div className="grid grid-cols-5 p-3 text-sm hover:bg-gray-50">
            <div>Fasting Blood Sugar</div>
            <div>116 mg/dL</div>
            <div>70-99 mg/dL</div>
            <div>Jun 10, 2023</div>
            <div><span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 text-xs">Elevated</span></div>
          </div>
          <div className="grid grid-cols-5 p-3 text-sm hover:bg-gray-50">
            <div>Cholesterol (Total)</div>
            <div>195 mg/dL</div>
            <div>&lt; 200 mg/dL</div>
            <div>Jun 10, 2023</div>
            <div><span className="px-2 py-0.5 rounded-full bg-green-100 text-green-800 text-xs">Normal</span></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BloodTestContent;
