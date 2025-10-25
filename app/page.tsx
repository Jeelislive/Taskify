export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Baaz Task Manager
          </h1>
          <p className="text-xl text-gray-600">
            AI-powered voice task management system
          </p>
        </header>

        <div className="max-w-4xl mx-auto">
          <div className="card">
            <h2 className="text-2xl font-semibold mb-4">Welcome</h2>
            <p className="text-gray-600">
              Your intelligent task management system is being set up.
              Stay tuned for amazing features!
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

