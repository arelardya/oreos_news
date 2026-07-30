export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
      <div className="text-6xl mb-6 animate-bounce">🌸</div>
      <div className="relative">
        <div className="w-20 h-20 border-4 border-primary/15 rounded-full"></div>
        <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
      </div>
      <p className="text-primary mt-6 font-medium text-lg">Loading...</p>
    </div>
  );
}
