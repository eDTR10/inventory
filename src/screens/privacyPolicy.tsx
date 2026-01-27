import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/inventory/view')}
            className="gap-2 border-blue-200 bg-white hover:bg-blue-50 text-blue-600 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-md border border-blue-100 p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-3 mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">Privacy Policy</h1>
            <p className="text-gray-600 text-base sm:text-lg">
              DICT Misamis Oriental Inventory System
            </p>
            <p className="text-gray-500 text-sm">Last Updated: January 27, 2026</p>
          </div>

          {/* Divider */}
          <hr className="border-blue-100" />

          {/* Content Sections */}
          <div className="space-y-8">
            {/* Section 1 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-700 leading-relaxed">
                The DICT Misamis Oriental Inventory System ("System", "we", "us", or "our") operates the inventory management application. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information Collection and Use</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">2.1 Google Account Information</h3>
                  <p className="text-gray-700 leading-relaxed">
                    When you sign in using your Google account, we collect and store your email address. This is required to:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
                    <li>Authenticate you in our System</li>
                    <li>Track your inventory actions and modifications</li>
                    <li>Maintain security and prevent unauthorized access</li>
                    <li>Record inventory transaction logs with user attribution</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">2.2 Google Sheets Access</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We request access to Google Sheets to store and manage your inventory data. This includes:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
                    <li>Inventory items and quantities</li>
                    <li>Item details (names, descriptions, images)</li>
                    <li>Transaction logs and audit trails</li>
                    <li>User actions on inventory items</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">2.3 Usage Data</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We collect data about your interactions with the System:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
                    <li>Items added, modified, or deleted</li>
                    <li>Quantity adjustments and transfers</li>
                    <li>QR code scans and item access</li>
                    <li>Timestamps of all actions</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Use of Information</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                The information we collect is used for:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>System Operation:</strong> Managing your inventory and maintaining system functionality</li>
                <li><strong>Authentication:</strong> Verifying your identity and maintaining your session</li>
                <li><strong>Audit Trails:</strong> Recording all inventory changes for accountability and tracking</li>
                <li><strong>Security:</strong> Protecting against unauthorized access and fraudulent activity</li>
                <li><strong>Service Improvement:</strong> Analyzing usage patterns to enhance system performance</li>
                <li><strong>Compliance:</strong> Meeting regulatory requirements and organizational policies</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Storage and Security</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  <strong>Google Sheets:</strong> All inventory data is stored in your Google Sheets account. We do not maintain separate servers for data storage.
                </p>
                <p>
                  <strong>Browser Storage:</strong> Your access token is stored securely in your browser's local storage for session management.
                </p>
                <p>
                  <strong>Encryption:</strong> All data transmission uses HTTPS encryption. Communication with Google APIs is secured through OAuth 2.0 authentication.
                </p>
                <p>
                  <strong>Access Control:</strong> Only authenticated users can access inventory data. Each user only sees data they have permission to view in their Google Sheets.
                </p>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Third-Party Services</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                This System uses the following third-party services:
              </p>
              <div className="space-y-3 text-gray-700">
                <div>
                  <strong>Google APIs (OAuth 2.0, Google Sheets, Google Identity):</strong>
                  <p className="text-sm mt-1">We use Google's authentication and data services. Please refer to Google's privacy policy at https://policies.google.com/privacy</p>
                </div>
                <div>
                  <strong>QR Code Generation:</strong>
                  <p className="text-sm mt-1">QR codes are generated using a third-party service. Only the encoded item name/URL is sent to generate the QR image.</p>
                </div>
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. User Rights</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                You have the following rights regarding your data:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Access:</strong> You can view all your inventory data stored in Google Sheets</li>
                <li><strong>Modification:</strong> You can modify your inventory data through the System interface</li>
                <li><strong>Deletion:</strong> You can delete inventory items and your data will be removed</li>
                <li><strong>Revocation:</strong> You can revoke our access to your Google account at any time through your Google account settings</li>
                <li><strong>Transparency:</strong> You have access to all transaction logs showing who made what changes and when</li>
              </ul>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Data Retention</h2>
              <p className="text-gray-700 leading-relaxed">
                Inventory data and transaction logs are retained as long as your Google Sheets account is active. When you revoke access or delete your account, data will be permanently removed from our System's access, though you may still maintain records in your Google Sheets. Historical logs are retained to maintain audit trails for accountability purposes.
              </p>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Children's Privacy</h2>
              <p className="text-gray-700 leading-relaxed">
                This System is not intended for use by children under the age of 13. We do not knowingly collect personal information from children. If we become aware that a child under 13 has provided us with personal information, we will take steps to remove such information.
              </p>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Changes to This Privacy Policy</h2>
              <p className="text-gray-700 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. Your continued use of the System following the posting of revised Privacy Policy means that you accept and agree to the changes.
              </p>
            </section>

            {/* Section 10 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contact Us</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2 text-gray-700">
                <p><strong>Department of Information and Communications Technology</strong></p>
                <p><strong>Misamis Oriental Regional Office</strong></p>
                <p className="text-sm">
                  If you have concerns about how your data is being handled, please reach out to your local DICT office or administrator.
                </p>
              </div>
            </section>

            {/* Section 11 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Acknowledgment</h2>
              <p className="text-gray-700 leading-relaxed">
                By using the DICT Misamis Oriental Inventory System, you acknowledge that you have read this Privacy Policy and agree to its terms. Your use of the System constitutes your consent to the collection and use of information as outlined in this policy.
              </p>
            </section>
          </div>

          {/* Footer */}
          <hr className="border-blue-100 mt-8" />
          <div className="text-center text-gray-600 text-sm pt-4">
            <p>© 2026 Department of Information and Communications Technology</p>
            <p>Misamis Oriental Regional Office</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
