
import React from 'react';
import { Download } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface LegacyChartsProps {
  handleSaveReport: () => void;
}

const LegacyCharts: React.FC<LegacyChartsProps> = ({ handleSaveReport }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <Card className="lg:col-span-2 border border-border/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h3 className="text-lg font-semibold">Patient Activity</h3>
            <Button variant="outline" size="sm" className="gap-1" onClick={handleSaveReport}>
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Save Report</span>
            </Button>
          </div>
          <div className="h-80">
            {/* Chart would be rendered here - using a placeholder */}
            <div className="w-full h-full bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              <img 
                src="/lovable-uploads/6a9055bf-3ecd-49e9-90dd-d04351aefca4.png" 
                alt="Chart Preview" 
                className="max-h-full max-w-full object-contain opacity-20"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border border-border/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Patient Distribution</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="inline-block w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full border-8 border-red-500 relative">
                <span className="absolute inset-0 flex items-center justify-center text-sm sm:text-base md:text-lg font-bold">81%</span>
              </div>
              <p className="text-sm mt-2">Recurring</p>
            </div>
            <div className="text-center">
              <div className="inline-block w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full border-8 border-emerald-300 relative">
                <span className="absolute inset-0 flex items-center justify-center text-sm sm:text-base md:text-lg font-bold">22%</span>
              </div>
              <p className="text-sm mt-2">New Patients</p>
            </div>
            <div className="text-center">
              <div className="inline-block w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full border-8 border-blue-500 relative">
                <span className="absolute inset-0 flex items-center justify-center text-sm sm:text-base md:text-lg font-bold">62%</span>
              </div>
              <p className="text-sm mt-2">Referrals</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LegacyCharts;
