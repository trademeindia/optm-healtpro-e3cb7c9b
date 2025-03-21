
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExerciseType } from './types';

interface TutorialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exerciseType?: ExerciseType;
}

const TutorialDialog: React.FC<TutorialDialogProps> = ({ 
  open, 
  onOpenChange,
  exerciseType = ExerciseType.SQUAT
}) => {
  // Exercise-specific tutorial content
  const getTutorialContent = () => {
    switch (exerciseType) {
      case ExerciseType.SQUAT:
        return {
          title: "How to Perform a Proper Squat",
          description: "Learn how to execute squats with correct form",
          steps: [
            "Stand with feet shoulder-width apart, toes slightly pointed outward",
            "Keep your chest up and back straight throughout the movement",
            "Bend your knees and push your hips back as if sitting in a chair",
            "Lower until your thighs are parallel to the ground (or as deep as comfortable)",
            "Push through your heels to return to the starting position"
          ],
          tips: [
            "Keep your knees in line with your toes (don't let them collapse inward)",
            "Maintain weight in your heels, not your toes",
            "Keep your spine in a neutral position throughout the movement",
            "Breathe in as you lower, and exhale as you rise"
          ]
        };
      case ExerciseType.LUNGE:
        return {
          title: "How to Perform a Proper Lunge",
          description: "Learn how to execute lunges with correct form",
          steps: [
            "Stand tall with feet hip-width apart",
            "Take a step forward with one leg",
            "Lower your body until both knees form 90-degree angles",
            "Keep your front knee aligned with your ankle",
            "Push through your front heel to return to the starting position"
          ],
          tips: [
            "Keep your torso upright, avoid leaning forward",
            "Keep your front knee aligned over your ankle, not pushing past your toes",
            "Maintain a stable core throughout the movement",
            "Lower your back knee towards the floor without touching it"
          ]
        };
      case ExerciseType.PUSHUP:
        return {
          title: "How to Perform a Proper Push-up",
          description: "Learn how to execute push-ups with correct form",
          steps: [
            "Start in a plank position with hands slightly wider than shoulder-width",
            "Keep your body in a straight line from head to heels",
            "Lower your chest toward the floor by bending your elbows",
            "Keep elbows at about a 45-degree angle from your body",
            "Push back up to the starting position"
          ],
          tips: [
            "Keep your core engaged to maintain a straight body line",
            "Don't let your hips sag or pike up",
            "Look slightly ahead rather than directly at the floor",
            "Fully extend your arms at the top without locking elbows"
          ]
        };
      case ExerciseType.PLANK:
        return {
          title: "How to Perform a Proper Plank",
          description: "Learn how to hold a plank with correct form",
          steps: [
            "Position your forearms on the ground with elbows aligned below shoulders",
            "Extend your legs behind you with toes on the ground",
            "Keep your body in a straight line from head to heels",
            "Engage your core, glutes, and quad muscles",
            "Hold the position while maintaining proper breathing"
          ],
          tips: [
            "Don't let your hips sag down or pike up",
            "Keep your neck neutral — don't drop your head or look up",
            "Breathe normally throughout the hold",
            "Focus on quality over quantity — maintain form"
          ]
        };
      default:
        return {
          title: "Exercise Tutorial",
          description: "Follow these steps for proper form",
          steps: ["Stand with proper posture", "Follow the exercise guidance", "Move slowly with control"],
          tips: ["Focus on form over speed", "Breathe steadily throughout"]
        };
    }
  };
  
  const content = getTutorialContent();
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{content.title}</DialogTitle>
          <DialogDescription>{content.description}</DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div>
            <h4 className="text-sm font-semibold mb-2">Step-by-Step Guide:</h4>
            <ol className="list-decimal pl-5 space-y-2">
              {content.steps.map((step, index) => (
                <li key={index} className="text-sm">{step}</li>
              ))}
            </ol>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold mb-2">Form Tips:</h4>
            <ul className="list-disc pl-5 space-y-2">
              {content.tips.map((tip, index) => (
                <li key={index} className="text-sm">{tip}</li>
              ))}
            </ul>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Got it</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TutorialDialog;
