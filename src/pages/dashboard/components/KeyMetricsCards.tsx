
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MessageSquare, Bell } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const KeyMetricsCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0 }}
      >
        <Card className="border border-border/30">
          <CardContent className="p-4 flex items-center">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-3xl font-bold">75</h3>
              <p className="text-muted-foreground text-sm">Total Appointments</p>
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
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
              <MessageSquare className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-3xl font-bold">357</h3>
              <p className="text-muted-foreground text-sm">Patients Treated</p>
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
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mr-4">
              <Bell className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <h3 className="text-3xl font-bold">65</h3>
              <p className="text-muted-foreground text-sm">Cancelled Sessions</p>
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
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-green-600">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <div>
              <h3 className="text-3xl font-bold">$128K</h3>
              <p className="text-muted-foreground text-sm">Total Revenue</p>
              <p className="text-xs text-green-600 flex items-center">
                <span className="mr-1">↑</span> 12% increase
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default KeyMetricsCards;
