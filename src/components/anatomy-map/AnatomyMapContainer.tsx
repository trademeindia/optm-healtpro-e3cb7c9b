
import React from 'react';
import { getBodyRegions } from './data/bodyRegions';
import AnatomyMapCard from './components/AnatomyMapCard';
import SymptomHistoryCard from './components/SymptomHistoryCard';
import SymptomDialogs from './components/SymptomDialogs';
import useAnatomyMap from './hooks/useAnatomyMap';
import { toast } from 'sonner';

const AnatomyMapContainer: React.FC = () => {
  const [bodyRegions] = React.useState(getBodyRegions());
  
  const {
    selectedRegion,
    symptoms,
    activeSymptoms,
    isAddDialogOpen,
    isDetailsDialogOpen,
    selectedSymptom,
    zoom,
    showHistory,
    isLoading,
    handleRegionClick,
    handleAddSymptom,
    handleUpdateSymptom,
    handleDeleteSymptom,
    handleZoomIn,
    handleZoomOut,
    toggleHistory,
    handleRefresh,
    handleToggleActive,
    setIsAddDialogOpen,
    setIsDetailsDialogOpen,
    setSelectedRegion,
    setSelectedSymptom
  } = useAnatomyMap();

  return (
    <div className="space-y-4 max-w-5xl mx-auto px-4">
      <AnatomyMapCard
        bodyRegions={bodyRegions}
        symptoms={activeSymptoms}
        zoom={zoom}
        onRegionClick={handleRegionClick}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onToggleHistory={toggleHistory}
        onRefresh={handleRefresh}
      />

      {showHistory && (
        <SymptomHistoryCard
          symptoms={symptoms}
          bodyRegions={bodyRegions}
          onUpdateSymptom={handleUpdateSymptom}
          onDeleteSymptom={handleDeleteSymptom}
          onToggleActive={handleToggleActive}
          loading={isLoading}
        />
      )}

      <SymptomDialogs
        addDialogOpen={isAddDialogOpen}
        detailsDialogOpen={isDetailsDialogOpen}
        selectedRegion={selectedRegion}
        selectedSymptom={selectedSymptom}
        onCloseAddDialog={() => {
          setIsAddDialogOpen(false);
          setSelectedRegion(null);
        }}
        onCloseDetailsDialog={() => {
          setIsDetailsDialogOpen(false);
          setSelectedSymptom(null);
        }}
        onAddSymptom={handleAddSymptom}
        onUpdateSymptom={handleUpdateSymptom}
        onDeleteSymptom={handleDeleteSymptom}
      />
      
      {/* The Toaster component was here but isn't needed as it's rendered in the parent page */}
    </div>
  );
};

export default AnatomyMapContainer;
