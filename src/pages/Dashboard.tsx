
import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Activity, Thermometer, Droplet, Brain, Microscope } from 'lucide-react';

import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import AnatomyModel from '@/components/3d/AnatomyModel';
import BiomarkerCard from '@/components/dashboard/BiomarkerCard';
import HealthMetric from '@/components/dashboard/HealthMetric';
import PatientProfile from '@/components/dashboard/PatientProfile';
import ActivityTracker from '@/components/dashboard/ActivityTracker';
import TreatmentPlan from '@/components/dashboard/TreatmentPlan';

const Dashboard: React.FC = () => {
  // Mock data for anatomy model hotspots
  const hotspots = [
    {
      id: 'shoulder',
      x: 30,
      y: 20,
      color: '#FF8787',
      label: 'Shoulder',
      description: 'Calcific tendinitis of the shoulder. Inflammation of the tendons in the shoulder joint.',
      icon: '+'
    },
    {
      id: 'neck',
      x: 50,
      y: 12,
      color: '#2D7FF9',
      label: 'Neck',
      description: 'Normal range of motion. No significant issues detected.',
      icon: '+'
    },
    {
      id: 'lumbar',
      x: 50,
      y: 40,
      color: '#F0C728',
      label: 'Lumbar Region',
      description: 'Mild inflammation detected. Recommended for further assessment.',
      icon: '+'
    }
  ];

  // Mock data for activity tracking
  const activityData = [
    { day: 'Mon', value: 8500 },
    { day: 'Tue', value: 9200 },
    { day: 'Wed', value: 7800 },
    { day: 'Thu', value: 8100 },
    { day: 'Fri', value: 10200 },
    { day: 'Sat', value: 6500 },
    { day: 'Sun', value: 7300 }
  ];

  // Mock data for treatment tasks
  const treatmentTasks = [
    {
      id: '1',
      title: 'Heat therapy - 15 minutes',
      time: '08:00 AM',
      completed: true
    },
    {
      id: '2',
      title: 'Stretching exercises - Series A',
      time: '11:30 AM',
      completed: true
    },
    {
      id: '3',
      title: 'Apply anti-inflammatory cream',
      time: '02:00 PM',
      completed: false
    },
    {
      id: '4',
      title: 'Resistance band exercises',
      time: '05:00 PM',
      completed: false
    }
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Patient Dashboard</h1>
            <p className="text-muted-foreground">
              View patient health data and treatment progress
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column */}
            <div className="lg:col-span-1 space-y-6">
              <PatientProfile
                name="Nikolas Pascal"
                age={32}
                gender="Male"
                address="800 Bay St, San Francisco, CA 94133"
                phone="(555) 123-4567"
                email="nikolas.p@example.com"
              />
              
              <ActivityTracker
                title="Activity (Steps)"
                data={activityData}
                unit="steps/day"
                currentValue={8152}
              />
              
              <TreatmentPlan
                title="Today's Treatment Plan"
                date="Jun 15, 2023"
                tasks={treatmentTasks}
                progress={50}
              />
            </div>
            
            {/* Middle column - Anatomy Model */}
            <div className="lg:col-span-1 glass-morphism rounded-2xl p-6 flex flex-col">
              <h3 className="text-lg font-semibold mb-2">Interactive Anatomy</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Click on hotspots to view detailed information
              </p>
              
              <div className="flex-1 relative">
                <AnatomyModel
                  image="/lovable-uploads/b60c3153-1d31-447c-a492-29234c29898a.png"
                  hotspots={hotspots}
                />
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button className="bg-primary/10 text-primary rounded-lg py-2 text-sm font-medium">
                  View X-Rays
                </button>
                <button className="bg-secondary text-secondary-foreground rounded-lg py-2 text-sm font-medium">
                  View Reports
                </button>
              </div>
            </div>
            
            {/* Right column */}
            <div className="lg:col-span-1 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <HealthMetric
                  title="Heart Rate"
                  value={72}
                  unit="bpm"
                  change={-3}
                  changeLabel="vs last week"
                  icon={<Heart className="w-4 h-4" />}
                  color="bg-medical-red/10 text-medical-red"
                />
                
                <HealthMetric
                  title="Blood Pressure"
                  value="120/80"
                  unit="mmHg"
                  change={0}
                  changeLabel="stable"
                  icon={<Activity className="w-4 h-4" />}
                  color="bg-medical-blue/10 text-medical-blue"
                />
                
                <HealthMetric
                  title="Temperature"
                  value={98.6}
                  unit="°F"
                  change={0.2}
                  changeLabel="vs yesterday"
                  icon={<Thermometer className="w-4 h-4" />}
                  color="bg-medical-yellow/10 text-medical-yellow"
                />
                
                <HealthMetric
                  title="Oxygen"
                  value={98}
                  unit="%"
                  change={1}
                  changeLabel="vs last check"
                  icon={<Droplet className="w-4 h-4" />}
                  color="bg-medical-green/10 text-medical-green"
                />
              </div>
              
              <BiomarkerCard
                name="C-Reactive Protein (CRP)"
                value={5.5}
                unit="mg/L"
                normalRange="0.0 - 8.0"
                status="normal"
                lastUpdated="Jun 10, 2023"
              />
              
              <BiomarkerCard
                name="Interleukin-6 (IL-6)"
                value={12.8}
                unit="pg/mL"
                normalRange="0.0 - 7.0"
                status="elevated"
                lastUpdated="Jun 10, 2023"
              />
              
              <BiomarkerCard
                name="TNF-α"
                value={3.7}
                unit="pg/mL"
                normalRange="0.0 - 8.1"
                status="normal"
                lastUpdated="Jun 10, 2023"
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
