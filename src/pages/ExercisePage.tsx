
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Dumbbell, Activity, Filter, Target, ArrowLeft } from 'lucide-react';

import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import ExerciseVideo from '@/components/exercises/ExerciseVideo';
import PostureMonitor from '@/components/exercises/PostureMonitor';
import MuscleProgress from '@/components/exercises/MuscleProgress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';
import useExercises from '@/hooks/useExercises';

const ExercisePage: React.FC = () => {
  const { toast } = useToast();
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
    
    toast({
      title: "Exercise Started",
      description: "AI posture monitoring is now active.",
    });
  };
  
  const handleFinishExercise = () => {
    if (selectedExercise) {
      markExerciseCompleted(selectedExercise.id);
      toast({
        title: "Exercise Completed",
        description: "Great job! Your progress has been updated.",
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
              {showMonitor ? (
                <div className="space-y-4">
                  <Button 
                    variant="ghost" 
                    className="gap-2"
                    onClick={() => setShowMonitor(false)}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Exercises</span>
                  </Button>
                  
                  <PostureMonitor 
                    exerciseId={selectedExercise?.id || null}
                    exerciseName={selectedExercise?.title || null}
                    onFinish={handleFinishExercise}
                  />
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={activeCategory === null ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleCategoryFilter(null)}
                      className="gap-1"
                    >
                      <Activity className="h-4 w-4" />
                      <span>All Exercises</span>
                    </Button>
                    <Button
                      variant={activeCategory === 'rehabilitation' ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleCategoryFilter('rehabilitation')}
                      className="gap-1"
                    >
                      <Dumbbell className="h-4 w-4" />
                      <span>Rehabilitation</span>
                    </Button>
                    <Button
                      variant={activeCategory === 'strength' ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleCategoryFilter('strength')}
                      className="gap-1"
                    >
                      <Dumbbell className="h-4 w-4" />
                      <span>Strength</span>
                    </Button>
                    <Button
                      variant={activeCategory === 'flexibility' ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleCategoryFilter('flexibility')}
                      className="gap-1"
                    >
                      <Activity className="h-4 w-4" />
                      <span>Flexibility</span>
                    </Button>
                    <Button
                      variant={activeCategory === 'cardio' ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleCategoryFilter('cardio')}
                      className="gap-1"
                    >
                      <Activity className="h-4 w-4" />
                      <span>Cardio</span>
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredExercises.map((exercise) => (
                      <ExerciseVideo
                        key={exercise.id}
                        id={exercise.id}
                        title={exercise.title}
                        description={exercise.description}
                        videoUrl={exercise.videoUrl}
                        thumbnailUrl={exercise.thumbnailUrl}
                        duration={exercise.duration}
                        difficulty={exercise.difficulty}
                        muscleGroups={exercise.muscleGroups}
                        onStartExercise={handleStartExercise}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
            
            {/* Right column - progress tracking */}
            <div className="lg:col-span-4 space-y-6">
              <MuscleProgress 
                muscleGroups={muscleGroups}
                progressData={progressData}
              />
              
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Goals</CardTitle>
                  <CardDescription>Your exercise progress this week</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Exercise Sessions</span>
                      <span className="text-sm font-medium">2 of 5</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: '40%' }}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Minutes Exercised</span>
                      <span className="text-sm font-medium">45 of 120</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: '37.5%' }}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Different Muscle Groups</span>
                      <span className="text-sm font-medium">3 of 6</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: '50%' }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Doctor's Recommendations</CardTitle>
                  <CardDescription>Exercise notes from your provider</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 border rounded-lg bg-amber-50 dark:bg-yellow-900/20 text-sm">
                    <p className="font-medium text-amber-800 dark:text-amber-400 mb-1">Focus Areas</p>
                    <p className="text-amber-700 dark:text-amber-300/80">
                      Concentrate on lower back exercises and core strengthening. Start with low intensity and gradually increase.
                    </p>
                  </div>
                  
                  <div className="p-3 border rounded-lg bg-green-50 dark:bg-green-900/20 text-sm">
                    <p className="font-medium text-green-800 dark:text-green-400 mb-1">Frequency</p>
                    <p className="text-green-700 dark:text-green-300/80">
                      Aim for 3-5 sessions per week, 20-30 minutes each. Take rest days as needed if experiencing pain.
                    </p>
                  </div>
                  
                  <div className="p-3 border rounded-lg bg-red-50 dark:bg-red-900/20 text-sm">
                    <p className="font-medium text-red-800 dark:text-red-400 mb-1">Avoid</p>
                    <p className="text-red-700 dark:text-red-300/80">
                      High-impact activities, heavy lifting, and exercises that cause sharp pain in the lower back.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ExercisePage;
