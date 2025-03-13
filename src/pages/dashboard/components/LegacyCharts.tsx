import React from 'react';
import { Download } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
interface LegacyChartsProps {
  handleSaveReport: () => void;
}
const LegacyCharts: React.FC<LegacyChartsProps> = ({
  handleSaveReport
}) => {
  return <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
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
              <img src="/lovable-uploads/6a9055bf-3ecd-49e9-90dd-d04351aefca4.png" alt="Chart Preview" className="max-h-full max-w-full object-contain opacity-20" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      
    </div>;
};
export default LegacyCharts;