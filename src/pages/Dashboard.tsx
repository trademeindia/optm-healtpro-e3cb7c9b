
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, Activity, Thermometer, Droplet, Brain, Microscope, 
  Upload, FileText, Calendar, Clock, User, Plus, X, Search,
  Filter, ArrowUpDown, ChevronDown, ChevronRight, MoreHorizontal
} from 'lucide-react';

import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import AnatomyModel, { Hotspot } from '@/components/3d/AnatomyModel';
import BiomarkerCard from '@/components/dashboard/BiomarkerCard';
import HealthMetric from '@/components/dashboard/HealthMetric';
import PatientProfile from '@/components/dashboard/PatientProfile';
import ActivityTracker from '@/components/dashboard/ActivityTracker';
import TreatmentPlan from '@/components/dashboard/TreatmentPlan';
import SymptomTracker from '@/components/dashboard/SymptomTracker';
import PainLocationMap from '@/components/dashboard/PainLocationMap';
import SymptomProgressChart from '@/components/dashboard/SymptomProgressChart';
import PostureAnalysis from '@/components/dashboard/PostureAnalysis';
import PatientRecords from '@/components/dashboard/PatientRecords';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

const Dashboard: React.FC = () => {
  // Initial hotspots with correct type for status
  const initialHotspots: Hotspot[] = [
    {
      id: 'shoulder',
      x: 28,  
      y: 25,  
      z: 10,  
      color: '#FF8787',
      label: 'Deltoid Muscle',
      description: 'Calcific tendinitis detected. Inflammation of the tendons in the shoulder joint.',
      status: 'critical',
      icon: null
    },
    {
      id: 'chest',
      x: 50,
      y: 30,
      z: 5,
      color: '#2D7FF9',
      label: 'Pectoralis Major',
      description: 'Normal muscle tone. No significant issues detected.',
      status: 'normal',
      icon: null
    },
    {
      id: 'abs',
      x: 50,
      y: 45,
      z: -5,
      color: '#F0C728',
      label: 'Abdominal Muscles',
      description: 'Mild inflammation detected in the rectus abdominis. Recommended for further assessment.',
      status: 'warning',
      icon: null
    },
    {
      id: 'bicep',
      x: 32,
      y: 35,
      z: 0,
      color: '#4CAF50',
      label: 'Biceps Brachii',
      description: 'Minor strain detected. Rest and ice therapy recommended.',
      status: 'warning',
      icon: null
    },
    {
      id: 'quadriceps',
      x: 54,
      y: 60,
      z: 0,
      color: '#9C27B0',
      label: 'Quadriceps',
      description: 'Normal muscle function. Continue with regular strength training.',
      status: 'normal',
      icon: null
    }
  ];

  // State for hotspots
  const [hotspots, setHotspots] = useState<Hotspot[]>(initialHotspots);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedPatient, setSelectedPatient] = useState(0);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const { toast } = useToast();

  // Mock data for patients
  const patients = [
    {
      id: 1,
      name: "Nikolas Pascal",
      age: 32,
      gender: "Male",
      address: "800 Bay St, San Francisco, CA 94133",
      phone: "(555) 123-4567",
      email: "nikolas.p@example.com",
      condition: "Calcific tendinitis of the shoulder",
      icdCode: "M75.3",
      lastVisit: "Jun 10, 2023",
      nextVisit: "Jun 22, 2023"
    },
    {
      id: 2,
      name: "Emma Rodriguez",
      age: 45,
      gender: "Female",
      address: "1420 Park Ave, San Francisco, CA 94122",
      phone: "(555) 987-6543",
      email: "emma.r@example.com",
      condition: "Lumbar strain",
      icdCode: "M54.5",
      lastVisit: "Jun 05, 2023",
      nextVisit: "Jun 25, 2023"
    },
    {
      id: 3,
      name: "Marcus Johnson",
      age: 28,
      gender: "Male",
      address: "219 Ellis St, San Francisco, CA 94102",
      phone: "(555) 456-7890",
      email: "marcus.j@example.com",
      condition: "Sports-related knee injury",
      icdCode: "S83.9",
      lastVisit: "Jun 12, 2023",
      nextVisit: "Jun 19, 2023"
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

  // Mock data for documents
  const patientDocuments = [
    {
      id: "doc1",
      name: "X-Ray Report - Left Shoulder",
      type: "X-Ray",
      date: "Jun 5, 2023",
      uploadedBy: "Dr. Smith",
      size: "2.4 MB",
      thumbnailUrl: "/lovable-uploads/d8b182a9-ac94-4497-b6c9-770065e4e760.png",
    },
    {
      id: "doc2",
      name: "MRI Report - Shoulder",
      type: "MRI",
      date: "Jun 7, 2023",
      uploadedBy: "Dr. Johnson",
      size: "3.8 MB",
      thumbnailUrl: "/lovable-uploads/d8b182a9-ac94-4497-b6c9-770065e4e760.png",
    },
    {
      id: "doc3",
      name: "Blood Test Results",
      type: "Lab",
      date: "Jun 10, 2023",
      uploadedBy: "Dr. Wilson",
      size: "1.2 MB",
      thumbnailUrl: null,
    },
    {
      id: "doc4",
      name: "Treatment Plan - Phase 1",
      type: "Plan",
      date: "Jun 12, 2023",
      uploadedBy: "Dr. Smith",
      size: "0.8 MB",
      thumbnailUrl: null,
    }
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

  // Handler for adding a new hotspot
  const handleAddHotspot = (newHotspot: Hotspot) => {
    setHotspots(prev => [...prev, newHotspot]);
    
    // Update patient record in a real application
    console.log("Added hotspot to patient record:", newHotspot);
  };

  // Handler for deleting a hotspot
  const handleDeleteHotspot = (id: string) => {
    const hotspotToDelete = hotspots.find(h => h.id === id);
    setHotspots(prev => prev.filter(hotspot => hotspot.id !== id));
    
    // Update patient record in a real application
    if (hotspotToDelete) {
      console.log("Removed hotspot from patient record:", hotspotToDelete);
    }
  };

  // Handler for document upload
  const handleUploadDocument = () => {
    // This would connect to a real upload API in a production app
    toast({
      title: "Document Uploaded",
      description: "Your document has been successfully uploaded.",
    });
    setShowUploadDialog(false);
  };

  // Simulate automatic analysis of patient reports
  useEffect(() => {
    // This would typically be an API call to analyze patient reports
    const analyzeReports = () => {
      const mockReportResults = [
        {
          muscleGroup: 'Lower Back',
          issue: 'Mild lumbar strain',
          severity: 'warning',
          position: { x: 50, y: 50 }
        }
      ];

      // Check if we should add any new hotspots based on the analysis
      mockReportResults.forEach(result => {
        const existingHotspot = hotspots.find(h => h.label.includes(result.muscleGroup));
        
        if (!existingHotspot) {
          const newHotspot: Hotspot = {
            id: `auto-${Date.now()}`,
            x: result.position.x,
            y: result.position.y,
            z: 0,
            color: result.severity === 'critical' ? '#FF4D4F' : 
                   result.severity === 'warning' ? '#FAAD14' : '#52C41A',
            label: result.muscleGroup,
            description: result.issue,
            status: result.severity as 'normal' | 'warning' | 'critical',
          };
          
          setHotspots(prev => [...prev, newHotspot]);
          
          toast({
            title: 'Automatic Issue Detection',
            description: `New issue detected in ${result.muscleGroup}: ${result.issue}`,
            variant: result.severity === 'critical' ? 'destructive' : 'default',
          });
        }
      });
    };

    // Simulate analysis after component mounts
    const timer = setTimeout(() => {
      analyzeReports();
    }, 3000); // Delay to simulate processing time

    return () => clearTimeout(timer);
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 dark:bg-gray-900">
          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Doctor Dashboard</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage patient records, monitor health data, and track treatment progress
                </p>
              </div>
              
              <div className="flex items-center mt-4 md:mt-0 gap-2">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search patients, records..." 
                    className="pl-9 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  />
                </div>
                
                <Button 
                  className="gap-1.5" 
                  onClick={() => setShowUploadDialog(true)}
                >
                  <Upload className="h-4 w-4" />
                  <span className="hidden md:inline">Upload</span>
                </Button>
              </div>
            </div>
            
            <Tabs 
              defaultValue="overview" 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="mb-6 bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700">
                <TabsTrigger value="overview" className="rounded-md">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="patients" className="rounded-md">
                  Patients
                </TabsTrigger>
                <TabsTrigger value="reports" className="rounded-md">
                  Reports & Documents
                </TabsTrigger>
                <TabsTrigger value="analytics" className="rounded-md">
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="calendar" className="rounded-md">
                  Calendar
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
                  {/* Left sidebar - Patient selector */}
                  <div className="md:col-span-3 space-y-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold">Patients</h3>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        {patients.map((patient, index) => (
                          <div 
                            key={patient.id} 
                            className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors ${
                              selectedPatient === index 
                                ? "bg-primary/10 text-primary" 
                                : "hover:bg-gray-100 dark:hover:bg-gray-700"
                            }`}
                            onClick={() => setSelectedPatient(index)}
                          >
                            <div className="w-9 h-9 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-sm font-medium">
                              {patient.name.split(" ").map(n => n[0]).join("")}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{patient.name}</p>
                              <p className="text-xs text-muted-foreground truncate">
                                {patient.condition}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <Button variant="ghost" className="w-full mt-3 text-sm text-muted-foreground">
                        View All Patients
                      </Button>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                      <h3 className="font-semibold mb-3">Today's Schedule</h3>
                      
                      <div className="space-y-3">
                        <div className="border border-gray-100 dark:border-gray-700 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium">9:00 AM - 9:30 AM</span>
                          </div>
                          <p className="text-sm font-medium">Emma Rodriguez</p>
                          <p className="text-xs text-muted-foreground">Follow-up appointment</p>
                        </div>
                        
                        <div className="border border-gray-100 dark:border-gray-700 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium">11:15 AM - 12:00 PM</span>
                          </div>
                          <p className="text-sm font-medium">Marcus Johnson</p>
                          <p className="text-xs text-muted-foreground">Rehabilitation session</p>
                        </div>
                        
                        <div className="border border-gray-100 dark:border-gray-700 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium">3:30 PM - 4:15 PM</span>
                          </div>
                          <p className="text-sm font-medium">Nikolas Pascal</p>
                          <p className="text-xs text-muted-foreground">Treatment assessment</p>
                        </div>
                      </div>
                      
                      <Button variant="ghost" className="w-full mt-3 text-sm text-muted-foreground">
                        View Full Schedule
                      </Button>
                    </div>
                  </div>
                  
                  {/* Main content */}
                  <div className="md:col-span-9 space-y-6">
                    {/* Patient profile */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
                      <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                        <div className="flex-shrink-0">
                          <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xl font-semibold">
                            {patients[selectedPatient].name.split(" ").map(n => n[0]).join("")}
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                            <div>
                              <h2 className="text-2xl font-bold">{patients[selectedPatient].name}</h2>
                              <p className="text-muted-foreground">
                                {patients[selectedPatient].age} years • {patients[selectedPatient].gender}
                              </p>
                            </div>
                            
                            <div className="flex gap-2">
                              <Button variant="outline" className="gap-1.5">
                                <FileText className="h-4 w-4" />
                                Reports
                              </Button>
                              <Button className="gap-1.5">
                                <Calendar className="h-4 w-4" />
                                Schedule
                              </Button>
                            </div>
                          </div>
                          
                          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex flex-col">
                              <span className="text-xs text-muted-foreground">Diagnosis</span>
                              <span className="font-medium">{patients[selectedPatient].condition}</span>
                              <span className="text-xs text-muted-foreground mt-0.5">ICD: {patients[selectedPatient].icdCode}</span>
                            </div>
                            
                            <div className="flex flex-col">
                              <span className="text-xs text-muted-foreground">Last Visit</span>
                              <span className="font-medium">{patients[selectedPatient].lastVisit}</span>
                            </div>
                            
                            <div className="flex flex-col">
                              <span className="text-xs text-muted-foreground">Next Appointment</span>
                              <span className="font-medium">{patients[selectedPatient].nextVisit}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Interactive anatomy and health metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                        <h3 className="text-lg font-semibold mb-2">Interactive Anatomy</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Click on the anatomy model to add or remove hotspots. Issues are automatically detected from patient reports.
                        </p>
                        
                        <div className="relative w-full aspect-square md:aspect-auto md:h-80">
                          <AnatomyModel
                            hotspots={hotspots}
                            className="bg-transparent w-full h-full"
                            onAddHotspot={handleAddHotspot}
                            onDeleteHotspot={handleDeleteHotspot}
                          />
                        </div>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                        <h3 className="text-lg font-semibold mb-4">Health Metrics</h3>
                        
                        <div className="grid grid-cols-2 gap-3">
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
                      </div>
                    </div>
                    
                    {/* Biomarkers and treatment */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                        <h3 className="text-lg font-semibold mb-2">Biomarkers</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Track patient biomarkers and inflammation indicators
                        </p>
                        
                        <div className="space-y-4">
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
                        </div>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                        <TreatmentPlan
                          title="Treatment Plan"
                          date="Jun 15, 2023"
                          tasks={treatmentTasks}
                          progress={50}
                        />
                      </div>
                    </div>
                    
                    {/* Patient documents */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Patient Documents</h3>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-1.5"
                          onClick={() => setShowUploadDialog(true)}
                        >
                          <Upload className="h-4 w-4" />
                          Upload
                        </Button>
                      </div>
                      
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Name</th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Type</th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Uploaded By</th>
                              <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {patientDocuments.map((doc) => (
                              <tr key={doc.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                                      <FileText className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <span className="font-medium text-sm">{doc.name}</span>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-sm">{doc.type}</td>
                                <td className="py-3 px-4 text-sm">{doc.date}</td>
                                <td className="py-3 px-4 text-sm">{doc.uploadedBy}</td>
                                <td className="py-3 px-4 text-right">
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="patients" className="mt-0">
                <PatientRecords patients={patients} />
              </TabsContent>
              
              <TabsContent value="reports" className="mt-0">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
                  <h2 className="text-xl font-bold mb-4">Reports & Documents</h2>
                  <p className="text-muted-foreground mb-6">
                    View and manage all patient reports and medical documents
                  </p>
                  
                  {/* Document management UI to be expanded in future */}
                  <div className="border border-dashed rounded-lg py-12 flex items-center justify-center">
                    <div className="text-center max-w-sm">
                      <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">Upload Documents</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Drag and drop your files here, or click to select files
                      </p>
                      <Button onClick={() => setShowUploadDialog(true)}>
                        Select Files
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="analytics" className="mt-0">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
                  <h2 className="text-xl font-bold mb-4">Analytics Dashboard</h2>
                  <p className="text-muted-foreground mb-6">
                    View patient analytics and treatment outcomes
                  </p>
                  
                  {/* Analytics UI placeholder */}
                  <div className="border border-dashed rounded-lg py-12 flex items-center justify-center">
                    <div className="text-center">
                      <Activity className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">Analytics Dashboard</h3>
                      <p className="text-sm text-muted-foreground">
                        Analytics features will be available soon
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="calendar" className="mt-0">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
                  <h2 className="text-xl font-bold mb-4">Appointment Calendar</h2>
                  <p className="text-muted-foreground mb-6">
                    Manage and schedule patient appointments
                  </p>
                  
                  {/* Calendar UI placeholder */}
                  <div className="border border-dashed rounded-lg py-12 flex items-center justify-center">
                    <div className="text-center">
                      <Calendar className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">Calendar View</h3>
                      <p className="text-sm text-muted-foreground">
                        Calendar features will be available soon
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
      
      {/* Document Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>
              Upload medical reports, X-rays, or other documents for the patient.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm font-medium mb-1">Drag files here or click to upload</p>
              <p className="text-xs text-muted-foreground mb-4">
                Supports PDF, JPEG, PNG files up to 10MB
              </p>
              <Button size="sm">Select Files</Button>
            </div>
            
            <div className="space-y-3">
              <div className="text-sm font-medium">Document Details</div>
              
              <div className="space-y-2">
                <label className="text-sm">Document Name</label>
                <Input placeholder="e.g., X-Ray Report - Left Shoulder" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm">Document Type</label>
                <select className="w-full p-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <option>X-Ray</option>
                  <option>MRI</option>
                  <option>Lab Report</option>
                  <option>Treatment Plan</option>
                  <option>Other</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm">Date</label>
                <Input type="date" />
              </div>
            </div>
          </div>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUploadDocument}>
              Upload Document
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
