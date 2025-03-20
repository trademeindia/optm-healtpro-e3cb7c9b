
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import PatientAnalysisReport from '@/components/analysis/PatientAnalysisReport';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';

const AnalysisPage: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  
  const handleRefreshAnalysis = async () => {
    setRefreshing(true);
    // Simulate API call to refresh analysis
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Analysis refreshed successfully');
    } catch (error) {
      toast.error('Failed to refresh analysis');
      console.error('Error refreshing analysis:', error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Patient Analysis</h1>
              <Button 
                variant="outline" 
                onClick={handleRefreshAnalysis} 
                disabled={refreshing}
                className="flex items-center gap-2"
              >
                <RefreshCcw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh Analysis'}
              </Button>
            </div>
            
            <PatientAnalysisReport />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AnalysisPage;
