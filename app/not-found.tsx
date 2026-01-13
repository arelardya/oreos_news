import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary dark:text-pink-300">404</h1>
          <div className="text-6xl mb-4">🌸</div>
        </div>
        
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
          Page Not Found
        </h2>
        
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          Oops! The page you're looking for seems to have wandered off. 
          Let's get you back to familiar territory.
        </p>
        
        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="bg-primary dark:bg-primary-dark text-white px-6 py-3 rounded-full font-medium hover:bg-primary-dark dark:hover:bg-accent hover:scale-105 transition-all duration-300 shadow-md"
          >
            Go Home
          </Link>
          
          <Link
            href="/about"
            className="bg-white dark:bg-gray-800 text-primary dark:text-pink-300 px-6 py-3 rounded-full font-medium border-2 border-primary dark:border-pink-300 hover:bg-pink-50 dark:hover:bg-gray-700 hover:scale-105 transition-all duration-300"
          >
            About Us
          </Link>
        </div>
      </div>
    </div>
  );
}
