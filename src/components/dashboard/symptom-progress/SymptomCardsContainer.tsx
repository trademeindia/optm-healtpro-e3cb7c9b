
import React, { useState, useMemo } from 'react';
import SymptomCard from './SymptomCard';
import SymptomTrend from './SymptomTrend';
import { ChartData } from './types';
import { calculateTrend } from './utils';
import { ChevronDown, ChevronUp, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SymptomCardsContainerProps {
  symptoms: ChartData[];
}

type SortOption = 'severity' | 'name' | 'recent';
type SortDirection = 'asc' | 'desc';

const SymptomCardsContainer: React.FC<SymptomCardsContainerProps> = ({ symptoms }) => {
  const [expandedSymptom, setExpandedSymptom] = useState<number | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>('severity');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  
  const toggleExpand = (index: number) => {
    if (expandedSymptom === index) {
      setExpandedSymptom(null);
    } else {
      setExpandedSymptom(index);
    }
  };
  
  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };
  
  const sortedSymptoms = useMemo(() => {
    return [...symptoms].sort((a, b) => {
      let comparison = 0;
      
      if (sortOption === 'severity') {
        // Compare the last values for severity sorting
        const aLastValue = a.data[a.data.length - 1]?.value || 0;
        const bLastValue = b.data[b.data.length - 1]?.value || 0;
        comparison = aLastValue - bLastValue;
      } else if (sortOption === 'name') {
        comparison = a.symptomName.localeCompare(b.symptomName);
      } else if (sortOption === 'recent') {
        // Sort by the date of the most recent entry
        const aLastDate = new Date(a.data[a.data.length - 1]?.date || '').getTime();
        const bLastDate = new Date(b.data[b.data.length - 1]?.date || '').getTime();
        comparison = aLastDate - bLastDate;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [symptoms, sortOption, sortDirection]);
  
  return (
    <div className="space-y-3 mt-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">Symptom Details</h4>
        
        <div className="flex items-center gap-2">
          <Select 
            value={sortOption} 
            onValueChange={(value) => setSortOption(value as SortOption)}
          >
            <SelectTrigger className="h-8 text-xs w-[100px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="severity">Severity</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="recent">Recent</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8" 
            onClick={toggleSortDirection}
          >
            {sortDirection === 'asc' ? (
              <ArrowUp className="h-4 w-4" />
            ) : (
              <ArrowDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      
      {sortedSymptoms.map((symptom, index) => (
        <div key={index} className="bg-white/50 dark:bg-white/5 rounded-lg border border-border overflow-hidden">
          <div 
            className="p-3 flex justify-between items-center cursor-pointer hover:bg-secondary/20 transition-colors"
            onClick={() => toggleExpand(index)}
          >
            <SymptomCard symptom={symptom} index={index} />
            
            <button className="ml-2 text-muted-foreground p-1 rounded-full hover:bg-secondary">
              {expandedSymptom === index ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>
          
          {expandedSymptom === index && (
            <div className="px-3 pb-3">
              <SymptomTrend 
                symptom={symptom} 
                trend={calculateTrend(symptom)}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SymptomCardsContainer;
