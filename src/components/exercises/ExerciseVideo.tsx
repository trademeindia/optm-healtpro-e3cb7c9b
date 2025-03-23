
import React, { useState } from 'react';
import { Exercise } from '@/types/exercise.types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';

interface ExerciseVideoProps {
  exercise: Exercise;
}

const ExerciseVideo: React.FC<ExerciseVideoProps> = ({ exercise }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  
  const enterFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };
  
  // Handle video events
  const handleVideoEnded = () => {
    setIsPlaying(false);
  };
  
  return (
    <Card className="overflow-hidden border shadow-sm">
      <div className="aspect-video relative bg-black flex items-center justify-center group">
        {exercise.videoUrl ? (
          <>
            <video 
              ref={videoRef}
              className="w-full h-full object-contain" 
              poster={exercise.thumbnailUrl || '/placeholder.svg'} 
              onEnded={handleVideoEnded}
              muted={isMuted}
            >
              <source src={exercise.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            {/* Video overlay with controls */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end">
              <div className="p-4 flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white"
                    onClick={togglePlay}
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white"
                    onClick={toggleMute}
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                </div>
                
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white"
                  onClick={enterFullscreen}
                >
                  <Maximize className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Initial play button overlay */}
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Button 
                  size="icon" 
                  variant="secondary" 
                  className="h-14 w-14 rounded-full opacity-90 hover:opacity-100"
                  onClick={togglePlay}
                >
                  <Play className="h-6 w-6" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center p-6 w-full">
            <img 
              src={exercise.thumbnailUrl || '/placeholder.svg'} 
              alt={exercise.title} 
              className="max-h-64 mx-auto mb-4 object-contain"
            />
            <p className="text-muted-foreground text-sm">
              Video demonstration not available for this exercise
            </p>
          </div>
        )}
      </div>
      
      <CardContent className="p-4 bg-muted/10">
        <p className="text-sm text-muted-foreground">
          This video demonstrates the correct form and technique for the {exercise.title.toLowerCase()} exercise. 
          Watch carefully before attempting.
        </p>
      </CardContent>
    </Card>
  );
};

export default ExerciseVideo;
