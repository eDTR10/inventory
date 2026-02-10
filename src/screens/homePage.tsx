import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import {  Box, QrCode, BarChart3, Lock, FileText, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LoginScreen } from '@/components/LoginScreen';

export const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-blue-100 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-8 lg:px-6 md:px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-blue-600">DICT Inventory System</h1>
            <p className="text-xs text-gray-600">Misamis Oriental</p>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-8 lg:px-6 md:px-4 py-20 lg:py-16 md:py-12 sm:py-10">
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-6xl lg:text-5xl md:text-4xl sm:text-3xl font-bold text-gray-900 leading-tight">
            Inventory Management
            <span className="block text-blue-600">Made Simple</span>
          </h1>
          <p className="text-xl lg:text-lg md:text-base text-gray-600 max-w-2xl mx-auto">
            Manage your inventory efficiently with QR codes, real-time tracking, and comprehensive audit logs.
          </p>
          <div className="flex flex-row sm:flex-col gap-4 justify-center pt-4">
            <Button
              onClick={() => navigate('/inventory/view')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 sm:px-6 sm:py-4 rounded-lg text-lg sm:text-base font-semibold transition-all shadow-lg hover:shadow-xl"
            >
              <Box className="mr-2 w-5 h-5" />
              View Inventory
            </Button>
            <Button
              onClick={() => navigate('/inventory/page2')}
              variant="outline"
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-6 sm:px-6 sm:py-4 rounded-lg text-lg sm:text-base font-semibold transition-all"
            >
              <BarChart3 className="mr-2 w-5 h-5" />
              View Logs
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white border-t border-blue-100">
        <div className="max-w-7xl mx-auto px-8 lg:px-6 md:px-4 py-20 lg:py-16 md:py-12 sm:py-10">
          <h2 className="text-4xl lg:text-3xl md:text-2xl font-bold text-center text-gray-900 mb-16">Key Features</h2>
          
          <div className="grid grid-cols-3 lg:grid-cols-2 md:grid-cols-1 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <QrCode className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">QR Code Generation</h3>
              <p className="text-gray-600">
                Generate unique QR codes for each inventory item. Scan to quickly access and update item details.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Box className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Real-Time Inventory</h3>
              <p className="text-gray-600">
                Track inventory quantities in real-time. Add or remove items with a single click and see updates instantly.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Audit Logs</h3>
              <p className="text-gray-600">
                Comprehensive logs of all inventory changes with user email and timestamps for complete transparency.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-8 rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Secure Authentication</h3>
              <p className="text-gray-600">
                Login with your Google account. Your data is protected with industry-standard security practices.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-8 rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">PDF Exports</h3>
              <p className="text-gray-600">
                Export all QR codes as a PDF document. Perfect for printing and distribution throughout your facility.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-8 rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Role-Based Access</h3>
              <p className="text-gray-600">
                Different permission levels for viewing and managing inventory. Only authorized users can modify data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-700 text-white py-20 lg:py-16 md:py-12 sm:py-10">
        <div className="max-w-7xl mx-auto px-8 lg:px-6 md:px-4">
          <h2 className="text-4xl lg:text-3xl md:text-2xl font-bold text-center mb-16">How It Works</h2>
          
          <div className="grid grid-cols-3 lg:grid-cols-2 md:grid-cols-1 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold mb-2">Login</h3>
              <p className="text-blue-100">
                Sign in with your Google account for secure authentication.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold mb-2">Scan or View</h3>
              <p className="text-blue-100">
                Scan QR codes or view inventory grid to access item details.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold mb-2">Update & Track</h3>
              <p className="text-blue-100">
                Adjust quantities and track changes with automatic audit logging.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-16 lg:py-14 md:py-12 sm:py-10 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-8 lg:px-6 md:px-4">
          <div className="grid grid-cols-3 lg:grid-cols-2 md:grid-cols-1 gap-12 mb-8">
            {/* About */}
            <div>
              <h3 className="text-white text-lg font-bold mb-4">About</h3>
              <p className="text-gray-400">
                DICT Misamis Oriental Inventory Management System - Streamline your inventory operations with modern technology.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => navigate('/inventory/view')}
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    Inventory
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/inventory/page2')}
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    Logs
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/inventory/page1')}
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    Home
                  </button>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-white text-lg font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => navigate('/inventory/privacy-policy')}
                    className="text-gray-400 hover:text-blue-400 transition-colors flex items-center gap-2"
                  >
                    <Shield className="w-4 h-4" />
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/inventory/terms-of-service')}
                    className="text-gray-400 hover:text-blue-400 transition-colors flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    Terms of Service
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <hr className="border-gray-800 mb-8" />

          {/* Bottom Footer */}
          <div className="flex flex-row sm:flex-col justify-between items-center text-gray-400 text-sm">
            <p>© 2026 Department of Information and Communications Technology - Misamis Oriental</p>
            <p>All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
