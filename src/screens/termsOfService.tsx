import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const TermsOfService = () => {
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
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">Terms of Service</h1>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                By accessing and using the DICT Misamis Oriental Inventory System ("System", "we", "us", "our", or "service"), you accept and agree to be bound by and comply with these Terms of Service. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  The DICT Misamis Oriental Inventory System is a web-based application designed to help manage inventory items, track quantities, and maintain audit logs of all inventory modifications. The System integrates with Google Sheets and Google OAuth for authentication and data storage.
                </p>
                <p>
                  <strong>Key Features Include:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Inventory item management (add, edit, delete)</li>
                  <li>Quantity tracking and adjustments</li>
                  <li>QR code generation for inventory items</li>
                  <li>User authentication via Google</li>
                  <li>Transaction logging and audit trails</li>
                  <li>PDF report generation</li>
                </ul>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Eligibility</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  To use this System, you must:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Be at least 13 years of age (or have parental consent)</li>
                  <li>Possess a valid Google account</li>
                  <li>Be authorized by DICT to access inventory management functions</li>
                  <li>Have legitimate business purposes for using the System</li>
                  <li>Comply with all applicable laws and regulations</li>
                </ul>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. User Responsibilities</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  As a user of this System, you agree to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>Maintain the confidentiality of your Google account credentials</li>
                  <li>Keep your Google account secure and do not share your login information</li>
                  <li>Be fully responsible for all activities that occur under your account</li>
                  <li>Provide accurate and truthful information when using the System</li>
                  <li>Use the System only for authorized inventory management purposes</li>
                  <li>Not attempt to bypass security measures or access unauthorized data</li>
                  <li>Not use the System for any illegal or unauthorized purposes</li>
                  <li>Report any suspected security breaches or unauthorized access immediately</li>
                  <li>Comply with all organizational policies and procedures</li>
                </ul>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Google Integration and Data</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  <strong>Google Account Authorization:</strong> By signing in with your Google account, you authorize us to access specific permissions. You can revoke this authorization at any time through your Google account settings.
                </p>
                <p>
                  <strong>Google Sheets Storage:</strong> All inventory data is stored in Google Sheets. You maintain ownership of this data. We are responsible only for the functionality to access and modify the data through our application.
                </p>
                <p>
                  <strong>Data Responsibility:</strong> You are responsible for maintaining backups of your Google Sheets data. We are not responsible for data loss, corruption, or accidental deletion.
                </p>
                <p>
                  <strong>Google Terms Apply:</strong> Your use of Google services is also subject to Google's Terms of Service. Please review Google's terms at https://policies.google.com/terms
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Intellectual Property Rights</h2>
              <p className="text-gray-700 leading-relaxed">
                All content, features, and functionality of the DICT Misamis Oriental Inventory System (including but not limited to all information, software, text, displays, images, and video) are owned by the Department of Information and Communications Technology, its licensors, or other providers of such material and are protected by copyright and other intellectual property laws. You retain all rights to your inventory data and can export or delete it at any time.
              </p>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Prohibited Activities</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                You agree not to engage in any of the following prohibited activities:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-2">
                <li>Hacking, attempting to gain unauthorized access, or circumventing security measures</li>
                <li>Uploading or distributing viruses, malware, or harmful code</li>
                <li>Reverse engineering, decompiling, or attempting to discover source code</li>
                <li>Removing or altering copyright, trademark, or other proprietary notices</li>
                <li>Harassment, abuse, or threatening behavior toward other users or DICT staff</li>
                <li>Spamming, phishing, or social engineering attacks</li>
                <li>Accessing or using another person's account without permission</li>
                <li>Using the System for commercial purposes without authorization</li>
                <li>Interfering with or disrupting the System or its servers</li>
                <li>Any illegal or unethical conduct</li>
              </ul>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Limitation of Liability</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  TO THE FULLEST EXTENT PERMITTED BY LAW, THE DICT MISAMIS ORIENTAL INVENTORY SYSTEM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
                </p>
                <p>
                  WE SHALL NOT BE LIABLE FOR:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Any indirect, incidental, special, consequential, or punitive damages</li>
                  <li>Loss of profit, revenue, data, or business opportunities</li>
                  <li>System downtime, errors, or data loss</li>
                  <li>Third-party actions or Google service interruptions</li>
                  <li>Unauthorized access due to user negligence</li>
                </ul>
              </div>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Acceptable Use Policy</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  <strong>Authorized Use:</strong> The System is intended solely for authorized DICT personnel and authorized personnel within Misamis Oriental. Unauthorized access or use is prohibited and may violate criminal laws.
                </p>
                <p>
                  <strong>Business Purpose Only:</strong> The System must be used only for legitimate inventory management purposes related to DICT operations.
                </p>
                <p>
                  <strong>Monitoring:</strong> DICT reserves the right to monitor and audit all activities on the System for security, compliance, and operational purposes. All actions are logged with your user email and timestamp.
                </p>
                <p>
                  <strong>Compliance:</strong> Users must comply with all applicable laws, regulations, and organizational policies.
                </p>
              </div>
            </section>

            {/* Section 10 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Disclaimer of Warranties</h2>
              <p className="text-gray-700 leading-relaxed">
                The System is provided on an "as-is" basis. We make no warranties, expressed or implied, regarding the System's operation or the information, content, or materials included in the System. To the fullest extent permissible by applicable law, we disclaim all warranties, expressed or implied, including but not limited to implied warranties of merchantability and fitness for a particular purpose.
              </p>
            </section>

            {/* Section 11 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Indemnification</h2>
              <p className="text-gray-700 leading-relaxed">
                You agree to indemnify and hold harmless DICT, its officers, directors, employees, and agents from any and all claims, damages, losses, costs, and expenses arising from your use of the System or violation of these Terms of Service, including attorney's fees and court costs.
              </p>
            </section>

            {/* Section 12 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Termination of Access</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                DICT reserves the right to terminate or restrict your access to the System at any time, for any reason, including but not limited to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2">
                <li>Violation of these Terms of Service</li>
                <li>Unauthorized use or access attempts</li>
                <li>Security concerns or suspicious activity</li>
                <li>End of employment or authorization</li>
                <li>System maintenance or discontinuation</li>
                <li>Administrative decisions by DICT</li>
              </ul>
            </section>

            {/* Section 13 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. System Changes and Maintenance</h2>
              <p className="text-gray-700 leading-relaxed">
                DICT reserves the right to modify, suspend, or discontinue the System at any time with or without notice. We shall not be liable for any such modifications or discontinuation. We may perform scheduled or emergency maintenance that may temporarily make the System unavailable.
              </p>
            </section>

            {/* Section 14 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Changes to Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                DICT reserves the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting. Your continued use of the System following any changes constitutes your acceptance of the new terms.
              </p>
            </section>

            {/* Section 15 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Entire Agreement</h2>
              <p className="text-gray-700 leading-relaxed">
                These Terms of Service, together with our Privacy Policy and any other policies referenced herein, constitute the entire agreement between you and DICT regarding the System and supersede all prior agreements, understandings, and negotiations, whether written or oral.
              </p>
            </section>

            {/* Section 16 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">16. Governing Law</h2>
              <p className="text-gray-700 leading-relaxed">
                These Terms of Service shall be governed by and construed in accordance with the laws of the Philippines, without regard to its conflict of law principles. Any legal action or proceeding arising under or related to this agreement shall be exclusively within the jurisdiction of the courts located in Misamis Oriental.
              </p>
            </section>

            {/* Section 17 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">17. Severability</h2>
              <p className="text-gray-700 leading-relaxed">
                If any provision of these Terms of Service is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.
              </p>
            </section>

            {/* Section 18 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">18. Contact Information</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                For questions, concerns, or disputes regarding these Terms of Service, please contact:
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2 text-gray-700">
                <p><strong>Department of Information and Communications Technology</strong></p>
                <p><strong>Misamis Oriental Regional Office</strong></p>
                <p className="text-sm">
                  Please provide detailed information about your inquiry so we can assist you promptly.
                </p>
              </div>
            </section>

            {/* Section 19 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">19. Acknowledgment</h2>
              <p className="text-gray-700 leading-relaxed">
                By accessing and using the DICT Misamis Oriental Inventory System, you acknowledge that you have read, understood, and agree to be bound by all terms and conditions contained in this Terms of Service agreement. If you do not agree with any part of these terms, you may not use the System.
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

export default TermsOfService;
