
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Clock, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ExerciseVideoProps {
  id: string;
  title: string;
  description: string;
  duration?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  thumbnailUrl?: string;
  videoUrl?: string;
  muscleGroups?: string[];
  onStart?: () => void;
  status?: 'completed' | 'in-progress' | 'not-started';
}

const ExerciseVideo: React.FC<ExerciseVideoProps> = ({
  id,
  title,
  description,
  duration = "5 min",
  difficulty = "beginner",
  thumbnailUrl = "/placeholder-exercise.jpg",
  muscleGroups = [],
  onStart,
  status = "not-started"
}) => {
  // Map difficulty to color
  const difficultyColor = {
    beginner: "bg-green-100 text-green-800",
    intermediate: "bg-yellow-100 text-yellow-800",
    advanced: "bg-red-100 text-red-800"
  }[difficulty];

  // Map status to styles
  const statusStyles = {
    completed: {
      className: "bg-green-100 text-green-800",
      text: "Completed"
    },
    "in-progress": {
      className: "bg-blue-100 text-blue-800",
      text: "In Progress"
    },
    "not-started": {
      className: "bg-gray-100 text-gray-800",
      text: "Not Started"
    }
  }[status];

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative aspect-video bg-muted overflow-hidden">
        <img
          src={thumbnailUrl}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback for missing images
            (e.target as HTMLImageElement).src = "https://via.placeholder.com/640x360?text=Exercise";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {status === 'completed' && (
          <div className="absolute top-2 right-2 z-10">
            <Badge variant="secondary" className="bg-green-500 text-white">
              Completed
            </Badge>
          </div>
        )}
      </div>
      
      <CardHeader className="px-4 py-3 pb-0">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      
      <CardContent className="px-4 py-2">
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{duration}</span>
          </div>
          
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <BarChart className="h-3 w-3" />
            <span className={`capitalize px-1.5 py-0.5 rounded-full text-xs ${difficultyColor}`}>
              {difficulty}
            </span>
          </div>
        </div>
        
        {muscleGroups.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {muscleGroups.slice(0, 3).map((muscle) => (
              <Badge key={muscle} variant="outline" className="text-xs">
                {muscle}
              </Badge>
            ))}
            {muscleGroups.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{muscleGroups.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="px-4 py-3 pt-0">
        <Button 
          onClick={onStart} 
          className="w-full gap-2"
          variant={status === 'completed' ? "outline" : "default"}
        >
          <Play className="h-4 w-4" />
          {status === 'completed' ? 'Do Again' : 'Start Exercise'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ExerciseVideo;
