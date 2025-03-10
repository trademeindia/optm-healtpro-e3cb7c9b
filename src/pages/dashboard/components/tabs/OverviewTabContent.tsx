
import React from 'react';
import KeyMetricsCards from '../KeyMetricsCards';
import PeriodFilter from '../PeriodFilter';
import ClinicAnalyticsGraph from '@/components/dashboard/ClinicAnalyticsGraph';
import LegacyCharts from '../LegacyCharts';
import { AppointmentsDashboard } from '@/components/dashboard/appointments';
import SymptomProgressChart from '@/components/dashboard/SymptomProgressChart';
import PatientBiomarkers from '@/components/dashboard/PatientBiomarkers';

interface OverviewTabContentProps {
  dashboardData: any;
  currentDate: Date;
  handleViewPatient: (patientId: number) => void;
  handleSaveReport: () => void;
  filterPeriod: string;
  setFilterPeriod: (period: string) => void;
}

const OverviewTabContent: React.FC<OverviewTabContentProps> = ({
  dashboardData,
  currentDate,
  handleViewPatient,
  handleSaveReport,
  filterPeriod,
  setFilterPeriod
}) => {
  return (
    <div className="space-y-6">
      {/* Filter Period Selector */}
      <PeriodFilter 
        filterPeriod={filterPeriod} 
        setFilterPeriod={setFilterPeriod} 
      />
      
      {/* Key Metrics Cards */}
      <KeyMetricsCards />
      
      {/* Analytics Graph Section */}
      <div className="mb-6">
        <ClinicAnalyticsGraph />
      </div>
      
      {/* Appointments Dashboard */}
      <AppointmentsDashboard />
      
      {/* Two-column layout for charts and biomarkers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SymptomProgressChart />
        <PatientBiomarkers />
      </div>
      
      {/* Legacy Charts Section */}
      <LegacyCharts handleSaveReport={handleSaveReport} />
    </div>
  );
};

export default OverviewTabContent;
