
import React from 'react';
import { Info } from 'lucide-react';

interface DebugSectionProps {
  showDebug: boolean;
  setShowDebug: (show: boolean) => void;
}

const DebugSection: React.FC<DebugSectionProps> = ({ 
  showDebug, 
  setShowDebug
}) => {
  return (
    <div className="mt-6 flex flex-col items-center">
      <button 
        className="mt-4 text-xs flex items-center gap-1 text-gray-400 hover:text-gray-600"
        onClick={() => setShowDebug(!showDebug)}
      >
        <Info className="h-3 w-3" />
        {showDebug ? "Hide Debugging Info" : "Show Debugging Info"}
      </button>
      
      {showDebug && (
        <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-left w-full">
          <p className="font-mono">Origin: {window.location.origin}</p>
          <p className="font-mono">Redirect: {`${window.location.origin}/oauth-callback`}</p>
          <p className="font-mono">Current URL: {window.location.href}</p>
        </div>
      )}
    </div>
  );
};

export default DebugSection;
