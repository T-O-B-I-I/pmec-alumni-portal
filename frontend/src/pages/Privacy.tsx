import React from 'react';
import { Shield } from 'lucide-react';

const Privacy = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-blue-100 p-4 rounded-full">
              <Shield className="w-12 h-12 text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">Privacy Policy</h1>
          
          <div className="space-y-8 text-gray-600 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
              <p>
                When you register for the PMEC Alumni Portal, we collect personal information such as your name, email address, graduation year, branch, and professional details. We also collect information about your interactions with the platform to improve user experience.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
              <p>
                The information collected is used to:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-2">
                <li>Create and maintain your alumni profile.</li>
                <li>Facilitate networking and mentorship opportunities with other alumni and students.</li>
                <li>Send you updates about college events, newsletters, and announcements.</li>
                <li>Verify your identity as an alumnus of PMEC.</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">3. Data Security and Visibility</h2>
              <p>
                We implement strict security measures to protect your personal information. By default, certain profile information is visible to other registered members of the platform to facilitate networking. You have the ability to control the visibility of specific contact details through your profile settings.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">4. Third-Party Services</h2>
              <p>
                We do not sell, trade, or rent your personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information with our college administration for statistical purposes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">5. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy or the practices of this site, please contact the PMEC Alumni Association through the contact details provided on the About Us page.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
