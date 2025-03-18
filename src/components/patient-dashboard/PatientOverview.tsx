
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin, Phone, Mail, Heart, Activity, AlertCircle } from 'lucide-react';
import { User } from '@/contexts/auth/types';
import { DashboardAppointment, HealthMetrics } from '@/hooks/dashboard/types';
import UpcomingAppointmentsCard from './UpcomingAppointmentsCard';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Legend } from 'recharts';

interface PatientOverviewProps {
  user: User | null;
  upcomingAppointments: DashboardAppointment[];
  healthMetrics: HealthMetrics;
  handleConfirmAppointment: (id: string) => void;
  handleRescheduleAppointment: (id: string) => void;
}

const PatientOverview: React.FC<PatientOverviewProps> = ({
  user,
  upcomingAppointments,
  healthMetrics,
  handleConfirmAppointment,
  handleRescheduleAppointment
}) => {
  // Sample data for AI insights
  const aiInsights = [
    { id: 1, text: "Blood pressure trending higher in the evenings. Consider reviewing medication schedule.", type: "warning" },
    { id: 2, text: "Exercise consistency has improved 27% over the last month. Keep up the good work!", type: "success" },
    { id: 3, text: "New lab results indicate vitamin D levels are lower than optimal range.", type: "info" }
  ];

  // Sample health summary data
  const healthSummary = {
    conditions: ["Lower Back Pain", "Mild Hypertension"],
    allergies: ["Penicillin", "Pollen"],
    bloodType: "O+",
    bmi: "24.2"
  };

  // Sample activity data for the small chart
  const weeklyActivityData = [
    { day: "Mon", steps: 6500 },
    { day: "Tue", steps: 8200 },
    { day: "Wed", steps: 7800 },
    { day: "Thu", steps: 9100 },
    { day: "Fri", steps: 7200 },
    { day: "Sat", steps: 10500 },
    { day: "Sun", steps: 6800 }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Patient Profile Card */}
      <Card className="lg:col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <User className="h-5 w-5 mr-2 text-primary" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mr-4">
              {user?.avatar ? (
                <img src={user.avatar} alt={user?.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="text-xl font-semibold text-primary">
                  {user?.name?.charAt(0) || "P"}
                </span>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{user?.name || "Patient Name"}</h3>
              <p className="text-sm text-muted-foreground">{user?.email || "patient@example.com"}</p>
            </div>
          </div>

          <div className="space-y-3 mt-4">
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>32 years old (DOB: 14/08/1991)</span>
            </div>
            <div className="flex items-center text-sm">
              <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>123 Main St, Anytown, CA 12345</span>
            </div>
            <div className="flex items-center text-sm">
              <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>(555) 123-4567</span>
            </div>
            <div className="flex items-center text-sm">
              <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{user?.email || "patient@example.com"}</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t">
            <h4 className="font-medium text-sm mb-2">Health Summary</h4>
            <div className="space-y-2">
              <div>
                <span className="text-xs text-muted-foreground">Medical Conditions:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {healthSummary.conditions.map((condition, idx) => (
                    <span key={idx} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {condition}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Allergies:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {healthSummary.allergies.map((allergy, idx) => (
                    <span key={idx} className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded-full">
                      {allergy}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex justify-between">
                <div>
                  <span className="text-xs text-muted-foreground block">Blood Type:</span>
                  <span className="text-sm font-medium">{healthSummary.bloodType}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">BMI:</span>
                  <span className="text-sm font-medium">{healthSummary.bmi}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity & Vitals Snapshot */}
      <Card className="lg:col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Activity className="h-5 w-5 mr-2 text-primary" />
            Activity & Vitals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">Heart Rate</div>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold">{healthMetrics.heartRate.value}</span>
                <span className="text-xs ml-1 text-muted-foreground">bpm</span>
              </div>
            </div>
            <div className="bg-primary/10 p-3 rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">Blood Pressure</div>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold">{healthMetrics.bloodPressure.value}</span>
                <span className="text-xs ml-1 text-muted-foreground">mmHg</span>
              </div>
            </div>
            <div className="bg-primary/10 p-3 rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">Oxygen</div>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold">{healthMetrics.oxygen.value}</span>
                <span className="text-xs ml-1 text-muted-foreground">%</span>
              </div>
            </div>
            <div className="bg-primary/10 p-3 rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">Temperature</div>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold">{healthMetrics.temperature.value}</span>
                <span className="text-xs ml-1 text-muted-foreground">°F</span>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="font-medium text-sm mb-2">Weekly Activity</h4>
            <div className="h-[140px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyActivityData}>
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="steps" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    dot={{ strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Steps"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Insights & Upcoming Appointments */}
      <Card className="lg:col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 text-primary" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 mb-6">
            {aiInsights.map(insight => (
              <div 
                key={insight.id} 
                className={`p-3 rounded-lg ${
                  insight.type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                  insight.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' :
                  'bg-blue-50 border-blue-200 text-blue-700'
                } border text-sm`}
              >
                {insight.text}
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t">
            <h4 className="font-medium mb-2">Upcoming Appointments</h4>
            {upcomingAppointments.length > 0 ? (
              <div className="space-y-2">
                {upcomingAppointments.slice(0, 2).map(appointment => (
                  <div key={appointment.id} className="p-3 border rounded-lg">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{appointment.type}</span>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        {appointment.status || "Scheduled"}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{appointment.date}, {appointment.time}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">Dr. {appointment.doctor}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground p-3">
                No upcoming appointments
              </div>
            )}
            {upcomingAppointments.length > 2 && (
              <div className="mt-2 text-center">
                <button className="text-xs text-primary hover:underline">
                  View all ({upcomingAppointments.length}) appointments
                </button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientOverview;
