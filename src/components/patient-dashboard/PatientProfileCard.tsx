
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Heart, Activity } from 'lucide-react';

interface PatientProfileCardProps {
  name: string;
  patientId: string;
  age: number;
  avatarUrl?: string;
}

const PatientProfileCard: React.FC<PatientProfileCardProps> = ({
  name,
  patientId,
  age,
  avatarUrl
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden border-0 shadow-md bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/3 bg-gradient-to-r from-primary/5 to-primary/10 p-6 flex flex-col items-center justify-center">
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt={name} 
                  className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-md"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center text-4xl font-bold text-primary">
                  {name.charAt(0)}
                </div>
              )}
              <h2 className="text-xl font-bold mt-4 text-center">{name}</h2>
              <p className="text-sm text-muted-foreground">ID: {patientId}</p>
              <p className="text-sm font-medium">Age: {age}</p>
            </div>
            
            <div className="w-full md:w-2/3 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-rose-50 dark:bg-rose-900/20">
                  <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-800/30 flex items-center justify-center">
                    <Heart className="h-5 w-5 text-rose-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Heart Rate</p>
                    <p className="text-lg font-bold flex items-baseline gap-1">
                      72 <span className="text-xs font-normal text-muted-foreground">bpm</span>
                    </p>
                    <span className="inline-block px-1.5 py-0.5 text-xs rounded bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400">
                      Normal
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-800/30 flex items-center justify-center">
                    <Activity className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Blood Pressure</p>
                    <p className="text-lg font-bold flex items-baseline gap-1">
                      120/80 <span className="text-xs font-normal text-muted-foreground">mmHg</span>
                    </p>
                    <span className="inline-block px-1.5 py-0.5 text-xs rounded bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400">
                      Normal
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PatientProfileCard;
