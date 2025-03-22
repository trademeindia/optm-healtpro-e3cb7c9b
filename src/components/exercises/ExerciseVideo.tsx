
import React from 'react';
import { Play, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface ExerciseVideoProps {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: number;
  difficulty: string;
  muscleGroups: string[];
  status?: 'completed' | 'in-progress' | null;
  onStart: () => void;
}

const ExerciseVideo: React.FC<ExerciseVideoProps> = ({
  id,
  title,
  description,
  thumbnailUrl,
  videoUrl,
  duration,
  difficulty,
  muscleGroups,
  status,
  onStart
}) => {
  // Format duration in minutes and seconds
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <div className="aspect-video relative overflow-hidden bg-muted">
          <img 
            src={thumbnailUrl} 
            alt={title}
            className="object-cover w-full h-full"
          />
          
          {status === 'completed' && (
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="bg-green-500 text-white">
                Completed
              </Badge>
            </div>
          )}
          
          {status === 'in-progress' && (
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="bg-blue-500 text-white">
                In Progress
              </Badge>
            </div>
          )}
        </div>
      </div>
      
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
          <Badge variant="outline">{difficulty}</Badge>
        </div>
        <CardDescription className="flex items-center gap-1 text-xs">
          <Clock className="h-3 w-3" />
          <span>{formatDuration(duration)}</span>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-4 pb-0">
        <p className="text-sm text-muted-foreground">{description}</p>
        
        <div className="flex flex-wrap gap-1 mt-2">
          {muscleGroups.map((muscle, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {muscle}
            </Badge>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="p-4">
        <Button 
          onClick={onStart} 
          className="w-full flex items-center justify-center gap-2"
        >
          <Play className="h-4 w-4" />
          <span>Start Exercise</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ExerciseVideo;
