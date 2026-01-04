import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Support - Jammah",
  description: "Get help with Jammah - Prayer times, mosque finder, and community events",
};

export default function SupportPage() {
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
          
          {/* Page Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Support</h1>
            <p className="text-lg text-gray-600">
              Everything you need to know about Jammah
            </p>
          </div>

          {/* About Jammah Section */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About Jammah</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Jammah is your comprehensive Islamic companion app that helps you stay connected to your faith and community. 
              Whether you're looking for accurate prayer times, finding the nearest mosque, or discovering community events, 
              Jammah brings everything together in one beautiful and easy-to-use application.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Our mission is to make it easier for Muslims to practice their faith by providing reliable tools and 
              fostering connections within the Muslim community.
            </p>
          </section>

          {/* Key Features Section */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Features</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Accurate Prayer Times</h3>
                  <p className="text-gray-600">
                    Get precise prayer times for your location with automatic adjustments based on your timezone. 
                    Receive timely notifications so you never miss a prayer.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Mosque Finder</h3>
                  <p className="text-gray-600">
                    Find mosques and Islamic centers near you with detailed information including prayer times, 
                    amenities, contact information, and directions. Perfect for when you're traveling or new to an area.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Community Events</h3>
                  <p className="text-gray-600">
                    Stay informed about Islamic events, lectures, classes, and community gatherings happening in your area. 
                    Never miss an important event in your community.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Push Notifications</h3>
                  <p className="text-gray-600">
                    Receive timely reminders for prayer times and notifications about upcoming events using 
                    Firebase Cloud Messaging. Customize your notification preferences to suit your needs.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Location Services</h3>
                  <p className="text-gray-600">
                    Powered by OpenRoute Service API for accurate geocoding and location-based features. 
                    Find mosques and prayer spaces wherever you are with precise location data.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">How accurate are the prayer times?</h3>
                <p className="text-gray-600">
                  Our prayer times are calculated using precise astronomical algorithms and automatically adjust 
                  to your exact location and timezone. We use trusted calculation methods recognized by Islamic scholars.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I use Jammah while traveling?</h3>
                <p className="text-gray-600">
                  Yes! Jammah automatically detects your location and provides accurate prayer times and nearby 
                  mosques wherever you are. It's the perfect companion for travelers.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Is my data secure?</h3>
                <p className="text-gray-600">
                  Absolutely. We take your privacy seriously and implement industry-standard security measures 
                  to protect your information. Please read our{" "}
                  <Link href="/privacy" className="text-emerald-600 hover:text-emerald-700 font-medium">
                    Privacy Policy
                  </Link>{" "}
                  for more details.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">How do I add my mosque to Jammah?</h3>
                <p className="text-gray-600">
                  Mosques and Islamic centers can apply to be listed on Jammah through our{" "}
                  <Link href="/apply" className="text-emerald-600 hover:text-emerald-700 font-medium">
                    application portal
                  </Link>. 
                  We'll review your application and add your organization to our database.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I customize notification settings?</h3>
                <p className="text-gray-600">
                  Yes, you have full control over your notification preferences. You can choose which prayer times 
                  to receive notifications for, set advance reminders, and control event notifications.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Is Jammah free to use?</h3>
                <p className="text-gray-600">
                  Yes, Jammah is completely free to download and use. All core features including prayer times, 
                  mosque finder, and event listings are available at no cost.
                </p>
              </div>
            </div>
          </section>

          {/* Technical Information Section */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Technical Information</h2>
            
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Platform</h3>
                <p>Built with React Native for iOS and Android devices</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Third-Party Services</h3>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>OpenRoute Service API - For geocoding and location services</li>
                  <li>Firebase Cloud Messaging - For push notifications</li>
                  <li>Supabase - For secure data storage and authentication</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Permissions</h3>
                <p className="mb-2">Jammah requires the following permissions to function properly:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong>Location Services:</strong> To provide accurate prayer times and find nearby mosques</li>
                  <li><strong>Notifications:</strong> To send prayer time reminders and event alerts</li>
                  <li><strong>Internet Access:</strong> To fetch prayer times, mosque data, and event information</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl shadow-sm p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Need More Help?</h2>
            <p className="mb-6 text-emerald-50">
              If you have questions that aren't answered here, we're here to help. 
              Reach out to our support team and we'll get back to you as soon as possible.
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <a href="https://jammah-dashboard.vercel.app/" className="hover:text-emerald-100 transition-colors">
                  https://jammah-dashboard.vercel.app/
                </a>
              </div>
            </div>
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
