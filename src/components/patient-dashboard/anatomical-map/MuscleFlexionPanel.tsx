
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, ArrowRight, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { formatDistanceToNow } from 'date-fns';
import { MuscleFlexion } from './types';

interface MuscleFlexionPanelProps {
  selectedMuscle: MuscleFlexion | null;
  muscleFlexions: MuscleFlexion[];
}

const getStatusColor = (status: MuscleFlexion['status']) => {
  switch (status) {
    case 'excessive':
    case 'overworked':
      return 'text-amber-500';
    case 'limited':
    case 'weak':
      return 'text-red-500';
    case 'normal':
    case 'healthy':
    default:
      return 'text-green-500';
  }
};

const getStatusLabel = (status: MuscleFlexion['status']) => {
  switch (status) {
    case 'excessive':
    case 'overworked':
      return 'Overactive';
    case 'limited':
    case 'weak':
      return 'Weak/Limited';
    case 'normal':
    case 'healthy':
    default:
      return 'Normal Function';
  }
};

const MuscleFlexionPanel: React.FC<MuscleFlexionPanelProps> = ({ selectedMuscle, muscleFlexions }) => {
  if (!selectedMuscle) return null;

  const relatedMuscles = muscleFlexions.filter(
    m => m.id !== selectedMuscle.id && m.region === selectedMuscle.region
  );

  return (
    <Card className="mt-4 border border-primary/10">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          Muscle Analysis: {selectedMuscle.muscle}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-muted-foreground">Flexion Level</span>
              <span className={`text-sm font-medium ${getStatusColor(selectedMuscle.status)}`}>
                {getStatusLabel(selectedMuscle.status)}
              </span>
            </div>
            <Progress value={selectedMuscle.flexionPercentage} className="h-2" />
          </div>

          <div className="text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>Last reading: {selectedMuscle.lastReading ? formatDistanceToNow(new Date(selectedMuscle.lastReading), { addSuffix: true }) : 'Unknown'}</span>
            </div>
          </div>

          {relatedMuscles.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Related Muscles</h4>
              <div className="space-y-2">
                {relatedMuscles.map(muscle => (
                  <div key={muscle.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <div>
                      <p className="font-medium text-sm">{muscle.muscle}</p>
                      <p className="text-xs text-muted-foreground">{muscle.muscleGroup}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className={`text-xs ${getStatusColor(muscle.status)}`}>
                        {getStatusLabel(muscle.status)}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MuscleFlexionPanel;
