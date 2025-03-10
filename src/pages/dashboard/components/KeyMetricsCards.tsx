
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MessageSquare, Bell } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { CardGrid } from '@/components/ui/card-grid';

const KeyMetricsCards: React.FC = () => {
  return (
    <CardGrid columns={4} gap="md" className="mb-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0 }}
      >
        <Card className="border border-border/30">
          <CardContent className="p-4 flex items-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-100 flex items-center justify-center mr-3 sm:mr-4 shrink-0">
              <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold">75</h3>
              <p className="text-muted-foreground text-xs sm:text-sm">Total Appointments</p>
              <p className="text-xs text-green-600 flex items-center">
                <span className="mr-1">↑</span> 17% increase
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="border border-border/30">
          <CardContent className="p-4 flex items-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100 flex items-center justify-center mr-3 sm:mr-4 shrink-0">
              <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold">357</h3>
              <p className="text-muted-foreground text-xs sm:text-sm">Patients Treated</p>
              <p className="text-xs text-blue-600 flex items-center">
                <span className="mr-1">↑</span> 22% increase
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card className="border border-border/30">
          <CardContent className="p-4 flex items-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amber-100 flex items-center justify-center mr-3 sm:mr-4 shrink-0">
              <Bell className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold">65</h3>
              <p className="text-muted-foreground text-xs sm:text-sm">Cancelled Sessions</p>
              <p className="text-xs text-red-600 flex items-center">
                <span className="mr-1">↑</span> 5% increase
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Card className="border border-border/30">
          <CardContent className="p-4 flex items-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-100 flex items-center justify-center mr-3 sm:mr-4 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 sm:h-6 sm:w-6 text-green-600">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold">$128K</h3>
              <p className="text-muted-foreground text-xs sm:text-sm">Total Revenue</p>
              <p className="text-xs text-green-600 flex items-center">
                <span className="mr-1">↑</span> 12% increase
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </CardGrid>
  );
};

export default KeyMetricsCards;
