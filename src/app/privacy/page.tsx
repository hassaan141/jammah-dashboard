import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy - Jammah",
  description: "Jammah Privacy Policy - How we collect, use, and protect your personal information",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50">
      {/* Header/Navigation */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-2M5 21h2m0 0h2m-4 0v-5a2 2 0 012-2h2a2 2 0 012 2v5" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-gray-900">Jammah</h1>
            </Link>
            
            <Link href="/" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Header Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-gray-600 mb-2">
              <strong>Last Updated:</strong> January 4, 2026
            </p>
          </div>

          {/* Introduction */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
            <p className="text-gray-700 leading-relaxed mb-4">
              This Privacy Policy describes how Jammah ("we", "us", or "our") collects, uses, and discloses your 
              personal information when you use our mobile application, which provides you with prayer times, 
              mosque locations, and community event information. We are committed to protecting your privacy and 
              ensuring compliance with applicable data protection regulations including the General Data Protection 
              Regulation (GDPR).
            </p>
            
            <p className="text-gray-700 leading-relaxed mb-4">
              Our Privacy Policy is designed to help you understand how we collect, use and safeguard the information 
              you provide to us and to assist you in making informed decisions when using our app or services 
              (collectively, the "Service").
            </p>
            
            <p className="text-gray-700 leading-relaxed">
              By accessing our Service, you accept our Privacy Policy, and you consent to our collection, storage, 
              use and disclosure of your Personal Information and Data as described in this Privacy Policy.
            </p>

            <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
              <p className="text-gray-700">
                For any questions, you can contact our Data Protection Officer at{" "}
                <a href="mailto:jamahcommunityapp@gmail.com" className="text-emerald-600 hover:text-emerald-700 font-medium">
                  jamahcommunityapp@gmail.com
                </a>
              </p>
            </div>
          </section>

          {/* Section I: Information We Collect */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">I. Information We Collect</h2>
            
            <p className="text-gray-700 mb-4">
              We collect "Non-Personal Information" and "Personal Information."
            </p>

            <div className="mb-6">
              <p className="text-gray-700 mb-2">
                <strong>Non-Personal Information</strong> includes information that cannot be used to personally 
                identify you, such as anonymous usage data, general demographic information we may collect, 
                referring/exit pages and URLs, platform types, preferences you submit and preferences that are 
                generated based on the data you submit and number of clicks.
              </p>
            </div>

            <div className="mb-6">
              <p className="text-gray-700 mb-2">
                <strong>Personal Information</strong> includes your location data (when you use location services), 
                demographic information that you provide, IP addresses, Device ID, as well as your email when you 
                elect to join a mailing list or create an account.
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Information Collected via Technology</h3>
              <p className="text-gray-700 leading-relaxed">
                In an effort to improve the quality of the Service, we track information provided to us by your 
                device or by our software application when you view or use the Service, such as the type of device 
                you use, the device from which you connected to the Service, the time and date of access, and other 
                information that does not personally identify you. We track this information using cookies and similar 
                technologies, or small text files which include an anonymous unique identifier. These enable us to 
                collect Non-Personal information about that user and keep a record of the user's preferences when 
                utilizing our services, both on an individual and aggregate basis.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">2. Children's Privacy</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                The Service is not directed to anyone under the age of 13. The Service does not knowingly collect or 
                solicit information from anyone under the age of 13. In the event that we learn that we have gathered 
                personal information from anyone under the age of 13 without the consent of a parent or guardian, we 
                will delete that information as soon as possible.
              </p>
              <p className="text-gray-700 leading-relaxed">
                If you believe we have collected such information, please contact us at{" "}
                <a href="mailto:jamahcommunityapp@gmail.com" className="text-emerald-600 hover:text-emerald-700 font-medium">
                  jamahcommunityapp@gmail.com
                </a>{" "}
                with subject line: "[Privacy Policy] Underage use without consent".
              </p>
            </div>
          </section>

          {/* Section II: How We Use and Share Information */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">II. How We Use and Share Information</h2>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Personal Information</h3>
              <p className="text-gray-700 mb-4">We use your personal information for the following purposes:</p>
              
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-2">•</span>
                  <span>To create and maintain your account, Art. 6b GDPR, contract fulfillment</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-2">•</span>
                  <span>To provide you with access to the app's features and functionalities, Art. 6b GDPR, contract fulfillment</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-2">•</span>
                  <span>To provide accurate prayer times based on your location, Art. 6b GDPR, contract fulfillment</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-2">•</span>
                  <span>To show you nearby mosques and Islamic centers, Art. 6b GDPR, contract fulfillment</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-2">•</span>
                  <span>To send you push notifications for prayer times and events via Firebase Cloud Messaging, Art. 6a GDPR, consent</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-2">•</span>
                  <span>To analyze and improve the app's performance and user experience, Art. 6f GDPR, legitimate interest</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-2">•</span>
                  <span>To send you important notices, updates, or promotional materials, Art. 6a GDPR, consent</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-2">•</span>
                  <span>To detect and resolve any errors or issues with the app, Art. 6f GDPR, legitimate interest</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-2">•</span>
                  <span>To detect fraudulent activities and monitor our app, Art. 6f GDPR, legitimate interest</span>
                </li>
              </ul>

              <p className="text-gray-700 mt-4 leading-relaxed">
                Jammah does not have any processes in place where automated decision making takes place that has a 
                legal or similar impact on your rights and freedoms.
              </p>

              <p className="text-gray-700 mt-4 leading-relaxed">
                We may share Personal Information with outside parties if we have a good-faith belief that access, 
                use, preservation or disclosure of the information is reasonably necessary to meet any applicable 
                legal process or enforceable governmental request; to enforce applicable Terms of Service, including 
                investigation of potential violations; address fraud, security or technical concerns; or to protect 
                against harm to the rights, property, or safety of our users or the public as required or permitted 
                by law.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">2. Non-Personal Information</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                In general, we use Non-Personal Information to help us improve the Service and customize the user 
                experience. We also aggregate Non-Personal Information in order to track trends and analyze use 
                patterns in the app. This Privacy Policy does not limit in any way our use or disclosure of 
                Non-Personal Information and we reserve the right to use and disclose such Non-Personal Information 
                to our partners and other third parties at our discretion.
              </p>
              
              <p className="text-gray-700 leading-relaxed">
                In the event we undergo a business transaction such as a merger, acquisition by another company, or 
                sale of all or a portion of our assets, your Personal Information may be among the assets transferred. 
                You acknowledge and consent that such transfers may occur and are permitted by this Privacy Policy, 
                and that any acquirer of our assets may continue to process your Personal Information as set forth in 
                this Privacy Policy. If our information practices change at any time in the future, we will post the 
                policy changes so that you may opt out of the new information practices. We suggest that you check 
                this page periodically if you are concerned about how your information is used.
              </p>
            </div>
          </section>

          {/* Section III: Data Storage and Transfer */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">III. Data Storage and Transfer</h2>
            <p className="text-gray-700 leading-relaxed">
              Your personal information is stored on secure servers provided by Supabase. All data stored with our 
              server providers have GDPR compliant Data Processing Addendums. We implement appropriate technical and 
              organizational measures to ensure a level of security appropriate to the risk.
            </p>
          </section>

          {/* Section IV: Data Security */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">IV. Data Security and How We Protect Your Information</h2>
            
            <p className="text-gray-700 leading-relaxed mb-4">
              We implement security measures designed to protect your information from unauthorized access, alteration, 
              disclosure, or destruction. Your account is protected by your account password and we urge you to take 
              steps to keep your personal information safe by not disclosing your password and by logging out of your 
              account after each use.
            </p>
            
            <p className="text-gray-700 leading-relaxed mb-4">
              We further protect your information from potential security breaches by implementing certain technological 
              security measures including encryption, firewalls and secure socket layer technology. However, these 
              measures do not guarantee that your information will not be accessed, disclosed, altered or destroyed by 
              breach of such firewalls and secure server software. As such, we cannot guarantee absolute security.
            </p>
            
            <p className="text-gray-700 leading-relaxed">
              By using our Service, you acknowledge that you understand and agree to assume these risks.
            </p>
          </section>

          {/* Section V: Your Rights */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">V. Your Rights Regarding the Use of Your Personal Information</h2>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Data Retention</h3>
              <p className="text-gray-700 leading-relaxed">
                We retain your personal information for as long as necessary to fulfill the purposes for which it was 
                collected, comply with legal obligations, resolve disputes, and enforce our agreements. You may request 
                that we delete your personal information at any time, subject to certain legal restrictions and exceptions.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Communication</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                You have the right at any time to prevent us from contacting you for marketing purposes. When we send 
                a promotional communication to a user, the user can opt out of further promotional communications by 
                following the unsubscribe instructions provided in each promotional email. You can also manage your 
                push notification preferences in your device settings or within the app.
              </p>
              
              <p className="text-gray-700 leading-relaxed">
                Please note that notwithstanding the promotional preferences you indicate by either unsubscribing or 
                opting out, we may continue to send you administrative communications including, for example, periodic 
                updates to our Privacy Policy.
              </p>
            </div>
          </section>

          {/* Section VI: Links to Other Websites */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">VI. Links to Other Websites</h2>
            <p className="text-gray-700 leading-relaxed">
              As part of the Service, we may provide links to or compatibility with other websites or applications. 
              However, we are not responsible for the privacy practices employed by those websites or the information 
              or content they contain. This Privacy Policy applies solely to information collected by us through the 
              Service. Therefore, this Privacy Policy does not apply to your use of a third party website accessed by 
              selecting a link in our app or via our Service. To the extent that you access or use the Service through 
              or on another website or application, then the privacy policy of that other website or application will 
              apply to your access or use of that site or application. We encourage our users to read the privacy 
              statements of other websites before proceeding to use them.
            </p>
          </section>

          {/* Section VII: Third-Party Services */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">VII. Third-Party Services</h2>
            
            <p className="text-gray-700 leading-relaxed mb-4">
              We may use third-party service providers to help us operate our app and perform the purposes outlined 
              in this Privacy Policy. These service providers may have access to your personal information, but they 
              are obligated to protect its confidentiality and use it only for the purposes for which it was provided.
            </p>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 font-semibold mb-2">The categories of data recipients are:</p>
              <ul className="space-y-1 text-gray-700">
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-2">•</span>
                  <span>Server providers and database services, such as Supabase</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-2">•</span>
                  <span>Location and geocoding services, such as OpenRoute Service API</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-2">•</span>
                  <span>Push notification services, such as Firebase Cloud Messaging</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-2">•</span>
                  <span>Analytics providers (when applicable)</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section VIII: Changes to Privacy Policy */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">VIII. Changes to Our Privacy Policy</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Please review the "Last Updated" legend at the top of the Privacy Policy to determine when it was last 
              amended. Any changes will become effective on the "Last Updated" date indicated above. By using the 
              Service or providing information to us following such changes, you will have accepted the amended Privacy 
              Policy.
            </p>
            
            <p className="text-gray-700 leading-relaxed">
              Jammah reserves the right to change this policy and our Terms of Service at any time. We will notify 
              you of significant changes to our Privacy Policy by sending a notice to the primary email address 
              specified in your account or by placing a prominent notice in our app or by other means as required by 
              law. Significant changes will go into effect 30 days following such notification. Non-material changes 
              or clarifications will take effect immediately. You should periodically check this page for updates.
            </p>
          </section>

          {/* Section IX: GDPR Rights */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">IX. Your Rights Under the GDPR</h2>
            
            <p className="text-gray-700 mb-4">As a data subject under the GDPR, you have the following rights:</p>
            
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-emerald-600 mr-2 mt-1">•</span>
                <span>The right to be informed about the collection and use of your personal information</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 mr-2 mt-1">•</span>
                <span>The right to access your personal information</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 mr-2 mt-1">•</span>
                <span>The right to rectify inaccurate or incomplete personal information</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 mr-2 mt-1">•</span>
                <span>The right to request the erasure of your personal information (the "right to be forgotten")</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 mr-2 mt-1">•</span>
                <span>The right to restrict the processing of your personal information</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 mr-2 mt-1">•</span>
                <span>The right to data portability</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 mr-2 mt-1">•</span>
                <span>The right to object to the processing of your personal information</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 mr-2 mt-1">•</span>
                <span>The right not to be subject to automated decision-making, including profiling</span>
              </li>
            </ul>

            <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
              <p className="text-gray-700">
                To exercise any of these rights, please contact us at{" "}
                <a href="mailto:jamahcommunityapp@gmail.com" className="text-emerald-600 hover:text-emerald-700 font-medium">
                  jamahcommunityapp@gmail.com
                </a>
              </p>
            </div>

            <p className="text-gray-700 mt-4 leading-relaxed">
              You have the right to lodge a complaint to your data protection authority if you consider our practices 
              not to be in compliance with GDPR requirements.
            </p>
          </section>

          {/* Contact Section */}
          <section className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl shadow-sm p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Contacting Us</h2>
            <p className="mb-6 text-emerald-50">
              If you have questions about this Privacy Policy, please contact us:
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-emerald-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:jamahcommunityapp@gmail.com" className="hover:text-emerald-100 transition-colors">
                  jamahcommunityapp@gmail.com
                </a>
              </div>
              
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-emerald-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:jamahcommunityapp@gmail.com" className="hover:text-emerald-100 transition-colors">
                  jamahcommunityapp@gmail.com
                </a>
              </div>
            </div>

            <p className="mt-6 text-emerald-50 italic">
              Jammah is committed to maintaining robust privacy protections for its users.
            </p>
          </section>

        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-600 text-sm">
            <p className="mb-2">© 2026 Jammah. All rights reserved.</p>
            <div className="flex items-center justify-center space-x-4">
              <Link href="/privacy" className="hover:text-emerald-600 transition-colors">
                Privacy Policy
              </Link>
              <span className="text-gray-400">•</span>
              <Link href="/support" className="hover:text-emerald-600 transition-colors">
                Support
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
