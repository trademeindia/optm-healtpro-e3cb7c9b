
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Map } from 'lucide-react';

interface PainLocationMapProps {
  className?: string;
}

// Fixed the TypeScript error by ensuring the component returns a JSX element
const PainLocationMap: React.FC<PainLocationMapProps> = ({ className }) => {
  return (
    <motion.div
      className={cn("glass-morphism rounded-2xl p-4 md:p-6", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Pain Location Map</h3>
          <p className="text-sm text-muted-foreground">
            Track pain locations and intensity
          </p>
        </div>
        <Map className="w-5 h-5 text-primary" />
      </div>
      
      <div className="relative w-full aspect-[4/5] bg-background/50 rounded-lg overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <img 
            src="/lovable-uploads/b60c3153-1d31-447c-a492-29234c29898a.png" 
            alt="Human body outline" 
            className="max-h-full max-w-full object-contain"
          />
          
          {/* Pain indicators */}
          <div className="absolute top-[25%] left-[38%] w-6 h-6 rounded-full bg-red-500/70 animate-pulse" 
               title="Severe shoulder pain"></div>
          <div className="absolute top-[45%] left-[52%] w-5 h-5 rounded-full bg-yellow-500/70 animate-pulse" 
               title="Moderate abdominal pain"></div>
          <div className="absolute top-[34%] right-[38%] w-4 h-4 rounded-full bg-blue-500/70 animate-pulse" 
               title="Mild right arm pain"></div>
        </div>
      </div>
      
      <div className="mt-4 flex justify-between">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500/70"></span>
          <span className="text-xs">Severe</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-yellow-500/70"></span>
          <span className="text-xs">Moderate</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-500/70"></span>
          <span className="text-xs">Mild</span>
        </div>
      </div>
    </motion.div>
  );
};

export default PainLocationMap;
