
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import ExerciseContent from './components/ExerciseContent';
import ProgressTracking from './components/ProgressTracking';
import { toast } from 'sonner';
import useExercises from '@/hooks/useExercises';

const ExercisePage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showMonitor, setShowMonitor] = useState(false);
  
  const {
    exercises,
    muscleGroups,
    progressData,
    selectedExercise,
    setSelectedExercise,
    markExerciseCompleted,
    startExercise,
    filterExercisesByCategory
  } = useExercises();
  
  const filteredExercises = filterExercisesByCategory(activeCategory);
  
  const handleStartExercise = (exerciseId: string) => {
    startExercise(exerciseId);
    setShowMonitor(true);
    
    toast.info("AI posture monitoring is now active.", {
      duration: 3000
    });
  };
  
  const handleFinishExercise = () => {
    if (selectedExercise) {
      markExerciseCompleted(selectedExercise.id);
      toast.success("Great job! Your progress has been updated.", {
        duration: 3000
      });
    }
    setShowMonitor(false);
    setSelectedExercise(null);
  };
  
  const handleCategoryFilter = (category: string | null) => {
    setActiveCategory(category);
  };
  
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mb-6 pl-10 lg:pl-0">
            <h1 className="text-2xl font-bold">Exercise Therapy</h1>
            <p className="text-sm text-muted-foreground">
              Personalized exercises with AI-powered posture monitoring
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Main content - exercises and posture monitor */}
            <div className="lg:col-span-8 space-y-6">
              <ExerciseContent 
                showMonitor={showMonitor}
                selectedExercise={selectedExercise}
                filteredExercises={filteredExercises}
                activeCategory={activeCategory}
                onCategoryFilter={handleCategoryFilter}
                onStartExercise={handleStartExercise}
                onFinishExercise={handleFinishExercise}
                setShowMonitor={setShowMonitor}
              />
            </div>
            
            {/* Right column - progress tracking */}
            <div className="lg:col-span-4 space-y-6">
              <ProgressTracking 
                muscleGroups={muscleGroups}
                progressData={progressData}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ExercisePage;
