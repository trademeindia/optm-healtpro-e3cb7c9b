
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';

type RequiredRole = string | string[];

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: RequiredRole;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  
  // Show loading state while authentication is being determined
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // If role requirement is specified and user doesn't have the required role
  if (requiredRole && user) {
    const hasRequiredRole = Array.isArray(requiredRole)
      ? requiredRole.includes(user.role)
      : user.role === requiredRole;
    
    if (!hasRequiredRole) {
      // Redirect to appropriate dashboard based on user role
      const redirectPath = 
        user.role === 'doctor' ? '/dashboard/doctor' :
        user.role === 'receptionist' ? '/dashboard/receptionist' :
        '/dashboard/patient';
      
      return <Navigate to={redirectPath} replace />;
    }
  }
  
  // User is authenticated and has required role (if specified)
  return <>{children}</>;
};

export default ProtectedRoute;
