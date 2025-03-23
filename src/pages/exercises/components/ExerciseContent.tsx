
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Exercise } from '@/types/exercise.types'; 
import { Button } from '@/components/ui/button';
import ExerciseVideo from '@/components/exercises/ExerciseVideo';
import { Play, Filter, Info, ArrowRight } from 'lucide-react';
import MotionTracker from '@/components/exercises/motion-tracking';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ExerciseContentProps {
  filteredExercises: Exercise[];
  selectedExercise: Exercise | null;
  activeCategory: string | null;
  onCategoryFilter: (category: string | null) => void;
  onStartExercise: (exerciseId: string) => void;
  onFinishExercise: () => void;
  showMonitor: boolean;
  setShowMonitor: React.Dispatch<React.SetStateAction<boolean>>;
}

const ExerciseContent: React.FC<ExerciseContentProps> = ({ 
  filteredExercises, 
  selectedExercise, 
  activeCategory, 
  onCategoryFilter, 
  onStartExercise, 
  onFinishExercise, 
  showMonitor, 
  setShowMonitor 
}) => {
  const navigate = useNavigate();
  const [showMotionTracker, setShowMotionTracker] = React.useState(false);
  
  // Filter categories from exercises
  const categories = React.useMemo(() => {
    const allCategories = new Set<string>();
    filteredExercises.forEach(ex => {
      if (ex.category) allCategories.add(ex.category);
    });
    return Array.from(allCategories);
  }, [filteredExercises]);
  
  // Check if selectedExercise is null and handle it
  if (!selectedExercise) {
    return (
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Select an Exercise</CardTitle>
          <CardDescription>
            Choose an exercise from the list to get started with your personalized therapy
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredExercises.length > 0 ? (
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant={activeCategory === null ? "default" : "outline"} 
                  size="sm"
                  onClick={() => onCategoryFilter(null)}
                  className="mb-1"
                >
                  All Exercises
                </Button>
                {categories.map(category => (
                  <Button 
                    key={category}
                    variant={activeCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => onCategoryFilter(category)}
                    className="mb-1"
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Button>
                ))}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredExercises.map(exercise => (
                  <Card 
                    key={exercise.id} 
                    className={`overflow-hidden hover:shadow-md transition-shadow cursor-pointer border ${
                      exercise.completionStatus === 'completed' ? 'border-green-200' : 
                      exercise.completionStatus === 'in-progress' ? 'border-blue-200' : 'border-gray-200'
                    }`}
                    onClick={() => onStartExercise(exercise.id)}
                  >
                    <div className="aspect-video bg-muted relative">
                      <img 
                        src={exercise.thumbnailUrl || '/placeholder.svg'} 
                        alt={exercise.title}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Button size="sm" variant="secondary" className="gap-1">
                          <Play className="h-4 w-4" />
                          View Exercise
                        </Button>
                      </div>
                      {exercise.completionStatus && (
                        <Badge className={`absolute top-2 right-2 ${
                          exercise.completionStatus === 'completed' ? 'bg-green-500' : 
                          exercise.completionStatus === 'in-progress' ? 'bg-blue-500' : 'bg-gray-500'
                        }`}>
                          {exercise.completionStatus.replace('-', ' ')}
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold truncate">{exercise.title}</h3>
                      <div className="flex flex-wrap gap-1 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {exercise.difficulty}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {exercise.duration}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-muted/30 rounded-lg">
              <p className="text-muted-foreground">No exercises found for this category</p>
              <Button variant="outline" className="mt-4" onClick={() => onCategoryFilter(null)}>
                Show All Exercises
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
  
  const handleStartExercise = () => {
    setShowMotionTracker(true);
  };
  
  const handleFinishExercise = () => {
    setShowMotionTracker(false);
    onFinishExercise();
  };
  
  return (
    <div className="space-y-6">
      <Card className="border shadow-sm overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <CardTitle className="text-2xl">{selectedExercise.title}</CardTitle>
              <CardDescription>
                {selectedExercise.description.slice(0, 120)}
                {selectedExercise.description.length > 120 ? '...' : ''}
              </CardDescription>
            </div>
            
            {!showMotionTracker && (
              <Button 
                onClick={handleStartExercise} 
                className="gap-2"
              >
                <Play className="h-4 w-4" />
                Start Exercise
              </Button>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge variant="secondary" className="text-xs">
              {selectedExercise.difficulty}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {selectedExercise.duration}
            </Badge>
            {selectedExercise.muscleGroups.map((group) => (
              <Badge key={group} variant="outline" className="text-xs">
                {group}
              </Badge>
            ))}
            <Badge 
              variant="outline" 
              className={`text-xs ${
                selectedExercise.category === 'rehabilitation' ? 'border-blue-200 bg-blue-50 text-blue-700' :
                selectedExercise.category === 'strength' ? 'border-red-200 bg-red-50 text-red-700' :
                selectedExercise.category === 'flexibility' ? 'border-green-200 bg-green-50 text-green-700' :
                'border-gray-200 bg-gray-50 text-gray-700'
              }`}
            >
              {selectedExercise.category}
            </Badge>
          </div>
        </CardHeader>
      </Card>
      
      {showMotionTracker ? (
        <MotionTracker
          exerciseId={selectedExercise.id}
          exerciseName={selectedExercise.title}
          onFinish={handleFinishExercise}
        />
      ) : (
        <Tabs defaultValue="video" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="video">Video Demonstration</TabsTrigger>
            <TabsTrigger value="instructions">Instructions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="video" className="space-y-6">
            <ExerciseVideo exercise={selectedExercise} />
          </TabsContent>
          
          <TabsContent value="instructions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Exercise Instructions</CardTitle>
                <CardDescription>Follow these steps for proper form and technique</CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal pl-5 space-y-4">
                  <li className="pl-2">Position yourself in front of the camera so your full body is visible.</li>
                  <li className="pl-2">Follow the exercise demonstration video for proper form.</li>
                  <li className="pl-2">The AI will track your movements and provide real-time feedback.</li>
                  <li className="pl-2">Complete the recommended number of repetitions with good form.</li>
                  <li className="pl-2">Take breaks if needed and focus on quality over quantity.</li>
                </ol>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-6">
                <Button variant="outline" onClick={() => navigate(-1)}>Back to List</Button>
                <Button onClick={handleStartExercise} className="gap-2">
                  Start Exercise <ArrowRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default ExerciseContent;
