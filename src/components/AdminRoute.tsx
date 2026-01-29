import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface AdminRouteProps {
  children: ReactNode;
  allowAccLvl0?: boolean;
}

export const AdminRoute = ({ children, allowAccLvl0 = false }: AdminRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Save the location they were trying to access
    return <Navigate to="/inventory/view" state={{ from: location }} replace />;
  }

  // Check access level if we're allowing acc_lvl 0
  if (allowAccLvl0) {
    const accLvl = parseInt(localStorage.getItem('user_acc_lvl') || '3');
    // Allow access for acc_lvl 0, 1, 2 (exclude level 3)
    if (accLvl >= 3) {
      return <Navigate to="/inventory/view" state={{ from: location }} replace />;
    }
  }

  return <>{children}</>;
};

export default AdminRoute;
