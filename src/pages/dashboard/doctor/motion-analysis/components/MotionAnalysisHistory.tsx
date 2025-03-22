
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { 
  Eye, 
  Download, 
  Trash2, 
  Search, 
  CalendarIcon, 
  FileText,
  ArrowUpDown
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { MotionAnalysisSession, JointAngle } from './MotionAnalysisRecorder';
import MotionAnalysisAngleView from './MotionAnalysisAngleView';

interface MotionAnalysisHistoryProps {
  patientId: string;
}

interface SortConfig {
  key: keyof MotionAnalysisSession | 'measurementDateFormatted';
  direction: 'asc' | 'desc';
}

const MotionAnalysisHistory: React.FC<MotionAnalysisHistoryProps> = ({ patientId }) => {
  const [sessions, setSessions] = useState<MotionAnalysisSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [selectedSession, setSelectedSession] = useState<MotionAnalysisSession | null>(null);
  const [viewSessionDialogOpen, setViewSessionDialogOpen] = useState(false);
  const [deleteConfirmDialogOpen, setDeleteConfirmDialogOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ 
    key: 'measurementDate', 
    direction: 'desc' 
  });
  
  // Load sessions when patient ID changes
  useEffect(() => {
    if (patientId) {
      loadSessions();
    }
  }, [patientId]);
  
  // Load sessions from Supabase
  const loadSessions = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('motion_analysis_sessions')
        .select('*')
        .eq('patientId', patientId)
        .eq('status', 'completed');
      
      if (error) {
        throw error;
      }
      
      // Format and set sessions
      setSessions(data || []);
    } catch (error) {
      console.error('Error loading motion analysis sessions:', error);
      toast.error('Failed to load sessions', {
        description: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // View session details
  const handleViewSession = (session: MotionAnalysisSession) => {
    setSelectedSession(session);
    setViewSessionDialogOpen(true);
  };
  
  // Delete session
  const handleDeleteSession = async () => {
    if (!selectedSession?.id) return;
    
    try {
      const { error } = await supabase
        .from('motion_analysis_sessions')
        .delete()
        .eq('id', selectedSession.id);
      
      if (error) {
        throw error;
      }
      
      // Update sessions list
      setSessions(prevSessions => 
        prevSessions.filter(session => session.id !== selectedSession.id)
      );
      
      toast.success('Session deleted', {
        description: 'Motion analysis session has been deleted'
      });
      
      setDeleteConfirmDialogOpen(false);
    } catch (error) {
      console.error('Error deleting session:', error);
      toast.error('Failed to delete session', {
        description: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  };
  
  // Download session data as JSON
  const handleDownloadSession = (session: MotionAnalysisSession) => {
    const dataStr = JSON.stringify(session, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `motion-analysis-${session.patientId}-${format(new Date(session.measurementDate), 'yyyy-MM-dd')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PP');
    } catch (error) {
      return 'Invalid Date';
    }
  };
  
  // Format time for display (MM:SS)
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Handle sorting
  const handleSort = (key: keyof MotionAnalysisSession | 'measurementDateFormatted') => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };
  
  // Filter and sort sessions
  const filteredAndSortedSessions = sessions
    // Apply search filter
    .filter(session => {
      if (!searchQuery) return true;
      
      const searchLower = searchQuery.toLowerCase();
      
      return (
        session.type.toLowerCase().includes(searchLower) ||
        (session.notes && session.notes.toLowerCase().includes(searchLower)) ||
        format(new Date(session.measurementDate), 'PP').toLowerCase().includes(searchLower)
      );
    })
    // Apply date filter
    .filter(session => {
      if (!dateFilter) return true;
      
      const sessionDate = new Date(session.measurementDate);
      return (
        sessionDate.getDate() === dateFilter.getDate() &&
        sessionDate.getMonth() === dateFilter.getMonth() &&
        sessionDate.getFullYear() === dateFilter.getFullYear()
      );
    })
    // Apply sorting
    .sort((a, b) => {
      const key = sortConfig.key;
      
      if (key === 'measurementDateFormatted') {
        const dateA = new Date(a.measurementDate).getTime();
        const dateB = new Date(b.measurementDate).getTime();
        
        return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
      }
      
      if (key === 'duration') {
        return sortConfig.direction === 'asc' 
          ? a.duration - b.duration 
          : b.duration - a.duration;
      }
      
      const valueA = a[key];
      const valueB = b[key];
      
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortConfig.direction === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }
      
      return 0;
    });
    
  // Reset filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setDateFilter(undefined);
  };
  
  return (
    <div className="space-y-4">
      {/* Search and filter */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search sessions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <CalendarIcon className="h-4 w-4" />
              {dateFilter ? format(dateFilter, 'PP') : 'Filter by Date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={dateFilter}
              onSelect={setDateFilter}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        
        {(searchQuery || dateFilter) && (
          <Button variant="ghost" onClick={handleResetFilters}>
            Reset Filters
          </Button>
        )}
      </div>
      
      {/* Sessions list */}
      {isLoading ? (
        <div className="text-center p-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-2 text-muted-foreground">Loading sessions...</p>
        </div>
      ) : filteredAndSortedSessions.length === 0 ? (
        <div className="text-center p-8 border rounded-lg">
          <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-lg font-medium mb-2">No Sessions Found</h3>
          <p className="text-muted-foreground">
            {sessions.length === 0 
              ? 'No motion analysis sessions have been recorded for this patient yet.'
              : 'No sessions match your current filters.'}
          </p>
        </div>
      ) : (
        <div className="rounded-md border">
          <div className="grid grid-cols-5 gap-4 p-4 font-medium text-sm bg-muted">
            <div className="col-span-2">
              <button 
                onClick={() => handleSort('type')}
                className="flex items-center gap-1"
              >
                Session Type 
                <ArrowUpDown className="h-3 w-3" />
              </button>
            </div>
            <div>
              <button 
                onClick={() => handleSort('measurementDateFormatted')}
                className="flex items-center gap-1"
              >
                Date 
                <ArrowUpDown className="h-3 w-3" />
              </button>
            </div>
            <div>
              <button 
                onClick={() => handleSort('duration')}
                className="flex items-center gap-1"
              >
                Duration 
                <ArrowUpDown className="h-3 w-3" />
              </button>
            </div>
            <div className="text-right">Actions</div>
          </div>
          
          <div className="divide-y">
            {filteredAndSortedSessions.map((session) => (
              <div key={session.id} className="grid grid-cols-5 gap-4 p-4 items-center">
                <div className="col-span-2">
                  <div className="font-medium">{session.type}</div>
                  {session.notes && (
                    <div className="text-sm text-muted-foreground line-clamp-1">
                      {session.notes}
                    </div>
                  )}
                </div>
                <div className="text-sm">
                  {formatDate(session.measurementDate)}
                </div>
                <div className="text-sm">
                  {formatDuration(session.duration)}
                  <div className="text-xs text-muted-foreground">
                    {session.jointAngles.length} measurements
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleViewSession(session)}
                    title="View session"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDownloadSession(session)}
                    title="Download data"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => {
                      setSelectedSession(session);
                      setDeleteConfirmDialogOpen(true);
                    }}
                    title="Delete session"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* View session dialog */}
      <Dialog open={viewSessionDialogOpen} onOpenChange={setViewSessionDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Motion Analysis Session</DialogTitle>
            <DialogDescription>
              {selectedSession && formatDate(selectedSession.measurementDate)}
            </DialogDescription>
          </DialogHeader>
          
          {selectedSession && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="mb-2 block">Session Information</Label>
                  <Card>
                    <CardContent className="p-4 space-y-2">
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="text-muted-foreground">Type:</div>
                        <div className="col-span-2 font-medium">{selectedSession.type}</div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="text-muted-foreground">Date:</div>
                        <div className="col-span-2 font-medium">
                          {formatDate(selectedSession.measurementDate)}
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="text-muted-foreground">Duration:</div>
                        <div className="col-span-2 font-medium">
                          {formatDuration(selectedSession.duration)}
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="text-muted-foreground">Measurements:</div>
                        <div className="col-span-2 font-medium">
                          {selectedSession.jointAngles.length}
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="text-muted-foreground">Tracked Joints:</div>
                        <div className="col-span-2 font-medium">
                          {selectedSession.targetJoints.join(', ')}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <Label className="mb-2 block">Notes</Label>
                  <Card>
                    <CardContent className="p-4 min-h-[100px]">
                      {selectedSession.notes ? (
                        <p className="text-sm whitespace-pre-wrap">{selectedSession.notes}</p>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">No notes for this session</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <div>
                <Label className="mb-2 block">Angle Analysis</Label>
                <Card>
                  <CardContent className="p-4">
                    <MotionAnalysisAngleView
                      jointAngles={selectedSession.jointAngles}
                      targetJoints={selectedSession.targetJoints}
                      duration={selectedSession.duration}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => handleDownloadSession(selectedSession!)}
              disabled={!selectedSession}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Download Data
            </Button>
            <DialogClose asChild>
              <Button type="button">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete confirmation dialog */}
      <Dialog open={deleteConfirmDialogOpen} onOpenChange={setDeleteConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Session</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this motion analysis session?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDeleteConfirmDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteSession}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MotionAnalysisHistory;
