export function ProductSkeleton() {
  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="px-4 pt-4 animate-pulse space-y-4">
        <div className="aspect-square bg-gray-100 rounded-2xl" />
        <div className="space-y-3">
          <div className="h-4 bg-gray-100 rounded w-1/4" />
          <div className="h-7 bg-gray-100 rounded w-3/4" />
          <div className="h-5 bg-gray-100 rounded w-1/3" />
          <div className="h-8 bg-gray-100 rounded w-1/2 mt-2" />
        </div>
      </div>
    </div>
  );
}
