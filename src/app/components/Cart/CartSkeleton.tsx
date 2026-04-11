export default function CartSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100">
          <div className="flex gap-4">
            <div className="w-20 h-20 bg-gray-100 rounded-xl flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-100 rounded w-3/4" />
              <div className="h-3 bg-gray-100 rounded w-1/3" />
              <div className="h-8 bg-gray-100 rounded w-1/2 mt-3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
