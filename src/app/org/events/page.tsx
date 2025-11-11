export default function EventsPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 sm:px-6 lg:px-8">
      <div className="px-4 py-12 sm:px-0">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl mb-8">
            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Events</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Event management functionality is coming soon! We're working hard to bring you powerful tools to organize and manage your community events.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">What's Coming</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="flex items-center text-blue-800">
                <svg className="w-5 h-5 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Create and manage events
              </div>
              <div className="flex items-center text-blue-800">
                <svg className="w-5 h-5 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Event registration system
              </div>
              <div className="flex items-center text-blue-800">
                <svg className="w-5 h-5 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Automated notifications
              </div>
              <div className="flex items-center text-blue-800">
                <svg className="w-5 h-5 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Calendar integration
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-sm text-gray-500">
            <p>Stay tuned for updates or contact support if you have specific requirements.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
