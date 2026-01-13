export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex flex-col items-center justify-center">
      <div className="text-6xl mb-6 animate-bounce">🌸</div>
      <div className="relative">
        <div className="w-20 h-20 border-4 border-pink-200 dark:border-gray-700 rounded-full"></div>
        <div className="w-20 h-20 border-4 border-primary dark:border-pink-300 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
      </div>
      <p className="text-primary dark:text-pink-300 mt-6 font-medium text-lg">Loading...</p>
    </div>
  );
}
