"use client";

export function OverviewSkeleton() {
  return (
    <main className="flex flex-col gap-8">
      {/* Header skeleton */}
      <div className="flex md:flex-row flex-col justify-between md:items-center gap-6">
        <div className="space-y-2">
          <div className="h-8 bg-gray-700 rounded w-48 animate-pulse"></div>
          <div className="h-4 bg-gray-700 rounded w-64 animate-pulse"></div>
        </div>
        <div className="flex gap-3">
          <div className="h-10 bg-gray-700 rounded w-32 animate-pulse"></div>
          <div className="h-10 bg-gray-700 rounded w-40 animate-pulse"></div>
        </div>
      </div>

      {/* Cards skeleton */}
      <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="border border-[#334155] rounded-xl p-6 bg-[#1E293B] animate-pulse"
          >
            <div className="flex justify-between">
              <div className="flex flex-col gap-2">
                <div className="h-4 bg-gray-700 rounded w-24"></div>
                <div className="h-8 bg-gray-700 rounded w-32"></div>
              </div>
              <div className="size-9 bg-gray-700 rounded-lg"></div>
            </div>
            <div className="pt-4 flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-700 rounded"></div>
              <div className="h-3 bg-gray-700 rounded w-24"></div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}