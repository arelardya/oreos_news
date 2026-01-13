export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-primary dark:text-pink-300 font-semibold text-lg mb-2">
            it's oreo's 🍪
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            a place to realize the world as ours and cherish every little moment.
          </p>
          <p className="text-gray-500 dark:text-gray-500 text-xs mt-4">
            © {currentYear} Ghalyndra. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
