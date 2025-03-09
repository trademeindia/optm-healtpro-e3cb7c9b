
import React from 'react';

const MedicationsContent: React.FC = () => {
  return (
    <>
      <p className="text-sm text-muted-foreground mb-6">Current medications and prescriptions</p>
      
      <div className="space-y-4">
        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium">Naproxen</h4>
              <p className="text-sm text-muted-foreground">500mg twice daily</p>
            </div>
            <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs">Anti-inflammatory</span>
          </div>
          <div className="mt-3 pt-3 border-t grid grid-cols-3 text-sm">
            <div>
              <p className="text-muted-foreground">Start Date</p>
              <p className="font-medium">Jun 5, 2023</p>
            </div>
            <div>
              <p className="text-muted-foreground">Duration</p>
              <p className="font-medium">30 days</p>
            </div>
            <div>
              <p className="text-muted-foreground">Status</p>
              <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-800 text-xs">Active</span>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium">Calcium Supplements</h4>
              <p className="text-sm text-muted-foreground">1000mg once daily</p>
            </div>
            <span className="px-2 py-1 rounded-full bg-purple-100 text-purple-800 text-xs">Supplement</span>
          </div>
          <div className="mt-3 pt-3 border-t grid grid-cols-3 text-sm">
            <div>
              <p className="text-muted-foreground">Start Date</p>
              <p className="font-medium">Jun 7, 2023</p>
            </div>
            <div>
              <p className="text-muted-foreground">Duration</p>
              <p className="font-medium">90 days</p>
            </div>
            <div>
              <p className="text-muted-foreground">Status</p>
              <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-800 text-xs">Active</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MedicationsContent;
