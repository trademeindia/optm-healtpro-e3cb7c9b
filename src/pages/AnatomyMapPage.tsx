
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AnatomyMapContainer from '@/components/anatomy-map/AnatomyMapContainer';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

const AnatomyMapPage: React.FC = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-4 md:p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Anatomy Map</h1>
            
            <Card className="w-full">
              <CardHeader className="pb-2">
                <CardTitle>Interactive Body Map</CardTitle>
              </CardHeader>
              <CardContent>
                <AnatomyMapContainer />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AnatomyMapPage;
