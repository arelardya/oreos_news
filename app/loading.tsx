import LoadingSpinner from '@/components/LoadingSpinner';

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-20">
      <LoadingSpinner />
      <p className="text-center text-gray-600 mt-4">Loading articles...</p>
    </div>
  );
}
