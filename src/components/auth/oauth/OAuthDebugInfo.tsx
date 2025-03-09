
import React from 'react';

interface OAuthDebugInfoProps {
  debugInfo: Record<string, any>;
}

const OAuthDebugInfo: React.FC<OAuthDebugInfoProps> = ({ debugInfo }) => {
  if (!debugInfo || Object.keys(debugInfo).length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mt-4 mb-6 text-left">
      <h3 className="font-semibold text-gray-800 mb-2">Debug Information:</h3>
      <pre className="text-xs overflow-auto bg-gray-100 p-2 rounded">
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
    </div>
  );
};

export default OAuthDebugInfo;
