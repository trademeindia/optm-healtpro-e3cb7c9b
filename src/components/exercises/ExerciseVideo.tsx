
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlayCircle, Dumbbell, Clock } from 'lucide-react';

interface ExerciseVideoProps {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  thumbnailUrl: string;
  videoUrl: string;
  muscleGroups: string[];
  onStart: () => void;
  status: 'completed' | 'in-progress' | 'not-started';
}

const ExerciseVideo: React.FC<ExerciseVideoProps> = ({
  id,
  title,
  description,
  duration,
  difficulty,
  thumbnailUrl,
  videoUrl,
  muscleGroups,
  onStart,
  status
}) => {
  // Get badge color based on difficulty
  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-blue-100 text-blue-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status indicator
  const getStatusIndicator = () => {
    switch (status) {
      case 'completed':
        return <div className="w-2 h-2 rounded-full bg-green-500"></div>;
      case 'in-progress':
        return <div className="w-2 h-2 rounded-full bg-amber-500"></div>;
      default:
        return <div className="w-2 h-2 rounded-full bg-gray-300"></div>;
    }
  };

  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <div className="relative">
        <img 
          src={thumbnailUrl} 
          alt={title} 
          className="h-48 w-full object-cover"
        />
        <div className="absolute top-2 right-2 flex gap-2">
          <Badge variant="secondary" className={getDifficultyColor()}>
            {difficulty}
          </Badge>
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{title}</CardTitle>
          {getStatusIndicator()}
        </div>
        <CardDescription className="line-clamp-2">
          {description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2 grow">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Dumbbell className="h-4 w-4" />
            <span>{muscleGroups.join(', ')}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button 
          onClick={onStart} 
          className="w-full flex items-center gap-2"
        >
          <PlayCircle className="h-4 w-4" />
          Start Exercise
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ExerciseVideo;
