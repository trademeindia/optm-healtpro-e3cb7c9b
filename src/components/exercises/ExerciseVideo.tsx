
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Play, Pause, Dumbbell, Trophy, BarChart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExerciseVideoProps {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  muscleGroups: string[];
  onStartExercise: (exerciseId: string) => void;
}

const ExerciseVideo: React.FC<ExerciseVideoProps> = ({
  id,
  title,
  description,
  videoUrl,
  thumbnailUrl,
  duration,
  difficulty,
  muscleGroups,
  onStartExercise,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleTogglePlay = () => {
    if (!isPlaying) {
      onStartExercise(id);
    }
    setIsPlaying(!isPlaying);
  };
  
  const handleStartAIAnalysis = () => {
    onStartExercise(id);
  };

  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="relative" 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-video bg-muted overflow-hidden rounded-t-lg">
          {!isPlaying ? (
            <>
              <img 
                src={thumbnailUrl} 
                alt={title} 
                className="w-full h-full object-cover transition-opacity duration-300" 
                style={{ opacity: isHovered ? 0.8 : 1 }}
              />
              {isHovered && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <Play className="w-16 h-16 text-white" />
                </div>
              )}
            </>
          ) : (
            <video 
              src={videoUrl}
              controls
              autoPlay
              className="w-full h-full object-cover"
              onEnded={() => setIsPlaying(false)}
            >
              Your browser does not support the video tag.
            </video>
          )}
          <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 text-xs rounded-md">
            {duration}
          </div>
          <div className="absolute top-2 left-2">
            <span className={cn("px-2 py-1 text-xs rounded-md font-medium", getDifficultyColor())}>
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </span>
          </div>
        </div>
      </div>
      <CardHeader className="py-3">
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0 pb-2">
        <div className="flex flex-wrap gap-1">
          {muscleGroups.map((muscle) => (
            <span 
              key={muscle} 
              className="bg-primary/10 text-primary px-2 py-0.5 text-xs rounded-full"
            >
              {muscle}
            </span>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-0 pb-3 flex justify-between">
        <Button
          variant="outline"
          size="sm"
          className="gap-1"
          onClick={handleTogglePlay}
        >
          {isPlaying ? (
            <>
              <Pause className="h-4 w-4" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              <span>Watch Video</span>
            </>
          )}
        </Button>
        <Button
          variant="default"
          size="sm"
          className="gap-1"
          onClick={handleStartAIAnalysis}
        >
          <BarChart className="h-4 w-4" />
          <span>Start AI Analysis</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ExerciseVideo;
