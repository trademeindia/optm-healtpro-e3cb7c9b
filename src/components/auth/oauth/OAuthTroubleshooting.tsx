
import React from 'react';

const OAuthTroubleshooting: React.FC = () => {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mt-4 mb-6 text-left">
      <h3 className="font-semibold text-amber-800 mb-2">Troubleshooting steps:</h3>
      <ul className="text-sm text-amber-700 list-disc pl-5 space-y-1">
        <li>Ensure the Google provider is enabled in your Supabase Authentication settings</li>
        <li>Verify that both Client ID and Client Secret are properly configured</li>
        <li>Check that your Supabase project has the correct Site URL configured</li>
        <li>Verify that <code>{window.location.origin}/oauth-callback</code> is added as a valid Redirect URL in Supabase</li>
        <li>For Google OAuth, ensure you've configured the consent screen with authorized domains</li>
        <li>Check that your Google Cloud project has proper OAuth credentials set up</li>
        <li>Verify that <code>{window.location.origin}</code> is added as an Authorized JavaScript Origin in Google Cloud Console</li>
        <li>Make sure <code>{window.location.origin}/oauth-callback</code> is added as an Authorized Redirect URI in Google Cloud Console</li>
        <li>If you're getting 403 errors, check if your Google API credentials are restricted by domain</li>
      </ul>
    </div>
  );
};

export default OAuthTroubleshooting;
