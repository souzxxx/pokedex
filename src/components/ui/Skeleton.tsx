export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-700/50 rounded-lg ${className}`} />
  );
}

export function PokemonCardSkeleton() {
  return (
    <div className="bg-gray-800/60 rounded-2xl p-4 border border-gray-700/50">
      <Skeleton className="w-full aspect-square rounded-xl mb-3" />
      <Skeleton className="h-4 w-16 mb-2" />
      <Skeleton className="h-6 w-28 mb-3" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
    </div>
  );
}
