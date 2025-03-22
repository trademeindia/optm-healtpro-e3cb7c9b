
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { hasMinimumRoleLevel, hasPermission } from '@/utils/rbac';
import { UserRole } from '@/contexts/auth/types';
import AccessDenied from '@/components/ui/access-denied';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole | UserRole[];
  resourceType?: string;
  action?: string;
  resourceId?: string;
  redirectPath?: string;
}

/**
 * A component that protects routes based on user authentication and permissions
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  resourceType,
  action,
  resourceId,
  redirectPath = '/login'
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const [authCheckComplete, setAuthCheckComplete] = useState(false);

  // Add a timeout to prevent infinite loading
  useEffect(() => {
    let mounted = true;
    
    // Set a timeout to force-complete the auth check
    const timer = setTimeout(() => {
      if (mounted) {
        setAuthCheckComplete(true);
        console.log("Auth check timeout reached");
      }
    }, 2000);
    
    // If auth is not loading, we can complete check earlier
    if (!isLoading) {
      setAuthCheckComplete(true);
      clearTimeout(timer);
    }
    
    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [isLoading]);

  // Show loading state during check
  if (isLoading && !authCheckComplete) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700 text-center max-w-md w-full">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full border-t-2 border-b-2 border-primary animate-spin"></div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Checking authentication</h2>
          <p className="text-muted-foreground">Please wait while we verify your access</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isLoading && (!isAuthenticated || !user)) {
    // Show a notification about the redirect
    toast.error("Authentication required", {
      description: "Please log in to access this page",
      duration: 3000
    });
    
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // Check for role-based access if required
  if (requiredRole && user) {
    // Handle array of roles
    if (Array.isArray(requiredRole)) {
      // Check if user has any of the required roles
      const hasRequiredRole = requiredRole.some(role => 
        hasMinimumRoleLevel(user.role, role)
      );
      
      if (!hasRequiredRole) {
        return (
          <AccessDenied 
            title="Insufficient Permissions"
            description={`You need ${requiredRole.join(' or ')} privileges to access this page.`}
            redirectPath="/"
            redirectLabel="Back to Home"
          />
        );
      }
    } else {
      // Single role check
      if (!hasMinimumRoleLevel(user.role, requiredRole)) {
        return (
          <AccessDenied 
            title="Insufficient Permissions"
            description={`You need ${requiredRole} privileges to access this page.`}
            redirectPath="/"
            redirectLabel="Back to Home"
          />
        );
      }
    }
  }

  // Check for specific permissions on resources if required
  if (resourceType && action && user) {
    const hasAccess = hasPermission(
      user,
      resourceType as any,
      action,
      resourceId
    );

    if (!hasAccess) {
      return (
        <AccessDenied 
          title="Access Restricted"
          description="You don't have the required permissions to access this resource."
          redirectPath="/"
          redirectLabel="Back to Home"
        />
      );
    }
  }

  // If all checks pass, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
