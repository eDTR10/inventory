import { useAuth } from '@/context/AuthContext';
import { Button } from './ui/button';
import { LogOut, User, X } from 'lucide-react';
import { useState } from 'react';

export const UserProfile = () => {
  const { isAuthenticated, userEmail, logout } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      window.location.reload();
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      {/* Circular Toggle Button */}
      <button
        onClick={toggleExpand}
        className="mb-2 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 active:scale-95 flex items-center justify-center"
        aria-label="Toggle profile menu"
      >
        {isExpanded ? (
          <X className="w-6 h-6" />
        ) : (
          <User className="w-6 h-6" />
        )}
      </button>

      {/* Profile Card - Shown when Expanded */}
      {isExpanded && (
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 p-4 max-w-sm w-72 animate-in fade-in slide-in-from-top-2 duration-200">
          {isAuthenticated && userEmail ? (
            <>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <User className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Logged in as</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white break-all">
                    {userEmail}
                  </p>
                </div>
              </div>

              <div className="h-px bg-gray-200 dark:bg-slate-700 mb-3"></div>

              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="w-full text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>

              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
                All actions are logged for audit purposes
              </p>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                  <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    Not signed in
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Please login to access features
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default UserProfile;
