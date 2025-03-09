
import React from 'react';
import { Info, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  
  const openSupabaseLoginSettings = () => {
    window.open('https://supabase.com/dashboard/project/_/auth/providers', '_blank');
  };
  
  const openGoogleCloudConsole = () => {
    window.open('https://console.cloud.google.com/apis/credentials', '_blank');
  };
  
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
        <div className="mt-2 p-3 bg-gray-50 rounded text-xs text-left w-full space-y-2">
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
              <li className="font-semibold mt-2">Add these to your Supabase Auth Settings:</li>
              <li className="ml-3 text-xs break-all">Site URL: {window.location.origin}</li>
              <li className="ml-3 text-xs break-all">Redirect URL: {redirectUrl}</li>
              <li className="font-semibold mt-2">Add these to your Google Cloud Console:</li>
              <li className="ml-3 text-xs break-all">Authorized JavaScript Origin: {window.location.origin}</li>
              <li className="ml-3 text-xs break-all">Authorized Redirect URI: {redirectUrl}</li>
            </ul>
          </div>
          
          <div className="border-t pt-2 mt-2">
            <p className="font-semibold text-xs mb-2">Common OAuth Issues:</p>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li>Redirect URLs must match exactly (including trailing slashes)</li>
              <li>Google requires HTTPS for production environments</li>
              <li>Newly created OAuth credentials may take a few minutes to activate</li>
              <li>Make sure your app is properly verified in Google Cloud Console</li>
              <li>Check if your application is in testing mode with limited users</li>
              <li>Ensure Client ID and Client Secret are correctly configured in Supabase</li>
            </ul>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            <Button 
              size="sm" 
              variant="outline" 
              className="text-xs h-8 flex items-center gap-1"
              onClick={openSupabaseLoginSettings}
            >
              Supabase Auth Settings
              <ExternalLink className="h-3 w-3" />
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="text-xs h-8 flex items-center gap-1"
              onClick={openGoogleCloudConsole}
            >
              Google Cloud Console
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DebugSection;
