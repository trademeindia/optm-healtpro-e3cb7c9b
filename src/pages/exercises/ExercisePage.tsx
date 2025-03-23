
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import useExercises from '@/hooks/useExercises';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';
import ExerciseContent from './components/ExerciseContent';
import ProgressTracking from './components/ProgressTracking';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, BarChart3, FolderHeart } from 'lucide-react';

const ExercisePage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useIsMobile();
  const [showMonitor, setShowMonitor] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
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

  // Set default selected exercise if none is selected
  useEffect(() => {
    if (exercises.length > 0 && !selectedExercise) {
      setSelectedExercise(exercises[0]);
    }
  }, [exercises, selectedExercise, setSelectedExercise]);

  const filteredExercises = filterExercisesByCategory(activeCategory);

  const handleCategoryFilter = (category: string | null) => {
    setActiveCategory(category);
  };

  const handleStartExercise = (exerciseId: string) => {
    startExercise(exerciseId);
    setShowMonitor(true);
    toast.success("Starting exercise session", {
      description: "Get ready for your guided workout"
    });
  };

  const handleFinishExercise = () => {
    if (selectedExercise) {
      markExerciseCompleted(selectedExercise.id);
      toast.success("Exercise completed!", {
        description: "Great job! Your progress has been saved."
      });
    }
    setShowMonitor(false);
  };
  
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-background content-visible">
          <div className="container mx-auto max-w-7xl">
            <Card className="mb-6 border-b-4 border-b-primary/40 shadow-sm">
              <CardHeader className="pb-3 pt-4">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Activity className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-2xl font-bold tracking-tight">Exercise Therapy</CardTitle>
                </div>
                <p className="text-muted-foreground mt-1">
                  Personalized exercises with AI-powered posture monitoring for your recovery journey
                </p>
              </CardHeader>
            </Card>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Main content area */}
              <div className="lg:col-span-8 space-y-6 visible-content">
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
              
              {/* Right sidebar with progress tracking */}
              {!isMobile && !showMonitor && (
                <div className="lg:col-span-4 space-y-6 visible-content">
                  <Card className="border-b-4 border-b-blue-500/40 shadow-sm mb-6">
                    <CardHeader className="pb-3 pt-4">
                      <div className="flex items-center gap-2">
                        <div className="bg-blue-500/10 p-2 rounded-full">
                          <BarChart3 className="h-4 w-4 text-blue-500" />
                        </div>
                        <CardTitle className="text-lg">Progress Tracking</CardTitle>
                      </div>
                    </CardHeader>
                  </Card>
                  <ProgressTracking 
                    muscleGroups={muscleGroups}
                    progressData={progressData}
                  />
                </div>
              )}
              
              {/* Responsive design - show progress below content on mobile */}
              {isMobile && !showMonitor && (
                <div className="col-span-1 space-y-6 mt-6 visible-content">
                  <Card className="border-b-4 border-b-blue-500/40 shadow-sm mb-6">
                    <CardHeader className="pb-3 pt-4">
                      <div className="flex items-center gap-2">
                        <div className="bg-blue-500/10 p-2 rounded-full">
                          <BarChart3 className="h-4 w-4 text-blue-500" />
                        </div>
                        <CardTitle className="text-lg">Progress Tracking</CardTitle>
                      </div>
                    </CardHeader>
                  </Card>
                  <ProgressTracking 
                    muscleGroups={muscleGroups}
                    progressData={progressData}
                  />
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ExercisePage;
