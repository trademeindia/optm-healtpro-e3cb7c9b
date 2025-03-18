
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { hasMinimumRoleLevel, hasPermission } from '@/utils/rbac';
import { UserRole } from '@/contexts/auth/types';
import AccessDenied from '@/components/ui/access-denied';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
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

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // Check for role-based access if required
  if (requiredRole && !hasMinimumRoleLevel(user.role, requiredRole)) {
    return (
      <AccessDenied 
        title="Insufficient Permissions"
        description={`You need ${requiredRole} privileges to access this page.`}
        redirectPath="/"
        redirectLabel="Back to Home"
      />
    );
  }

  // Check for specific permissions on resources if required
  if (resourceType && action) {
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
