import React from 'react';
import { FileText } from 'lucide-react';

const Terms = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-blue-100 p-4 rounded-full">
              <FileText className="w-12 h-12 text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">Terms of Service</h1>
          
          <div className="space-y-8 text-gray-600 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using the PMEC Alumni Portal, you accept and agree to be bound by the terms and provision of this agreement. Furthermore, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">2. Eligibility and Registration</h2>
              <p>
                This platform is exclusively for the alumni, current students, faculty, and administration of Parala Maharaja Engineering College. When registering, you agree to provide accurate, current, and complete information about yourself. Falsifying your identity or graduation status will result in immediate account termination.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">3. User Conduct</h2>
              <p>
                You agree to use the portal only for lawful purposes. You are prohibited from posting or transmitting any material that is defamatory, obscene, fraudulent, harmful, threatening, or abusive. The Alumni Association reserves the right to remove any content or terminate accounts that violate these guidelines.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">4. Intellectual Property</h2>
              <p>
                The PMEC Alumni Portal and its original content, features, and functionality are owned by Parala Maharaja Engineering College and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">5. Termination</h2>
              <p>
                We may terminate your access to the site, without cause or notice, which may result in the forfeiture and destruction of all information associated with your account. All provisions of this agreement that, by their nature, should survive termination shall survive termination.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
