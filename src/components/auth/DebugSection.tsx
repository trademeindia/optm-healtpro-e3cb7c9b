
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
  // Determine OAuth configuration status
  const isHttpsOrigin = window.location.protocol === 'https:';
  const redirectUrl = `${window.location.origin}/oauth-callback`;
  
  return (
    <div className="mt-6 flex flex-col items-center">
      <button 
        className="mt-4 text-xs flex items-center gap-1 text-gray-400 hover:text-gray-600"
        onClick={() => setShowDebug(!showDebug)}
        data-testid="debug-toggle"
      >
        <Info className="h-3 w-3" />
        {showDebug ? "Hide Debugging Info" : "Show Debugging Info"}
      </button>
      
      {showDebug && (
        <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-left w-full space-y-2">
          <p className="font-mono">Origin: {window.location.origin}</p>
          <p className="font-mono">Redirect: {redirectUrl}</p>
          <p className="font-mono">Current URL: {window.location.href}</p>
          
          <div className="border-t pt-2 mt-2">
            <p className="font-semibold text-xs mb-1">OAuth Configuration Check:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li className={isHttpsOrigin ? "text-green-600" : "text-amber-600"}>
                {isHttpsOrigin ? "✓" : "⚠️"} Protocol: {window.location.protocol} 
                {!isHttpsOrigin && " (Google OAuth works best with HTTPS)"}
              </li>
              <li>Add these to your Supabase Auth Settings:</li>
              <li className="ml-3 text-xs break-all">Site URL: {window.location.origin}</li>
              <li className="ml-3 text-xs break-all">Redirect URL: {redirectUrl}</li>
              <li>Add these to your Google Cloud Console:</li>
              <li className="ml-3 text-xs break-all">Authorized JavaScript Origin: {window.location.origin}</li>
              <li className="ml-3 text-xs break-all">Authorized Redirect URI: {redirectUrl}</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default DebugSection;
