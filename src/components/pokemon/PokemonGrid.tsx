import type { PokemonDetail } from '../../types/pokemon';
import { PokemonCard } from './PokemonCard';
import { PokemonCardSkeleton } from '../ui/Skeleton';

interface PokemonGridProps {
  pokemon: PokemonDetail[];
  isLoading?: boolean;
}

export function PokemonGrid({ pokemon, isLoading }: PokemonGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {pokemon.map((p, i) => (
        <PokemonCard key={p.id} pokemon={p} index={i} />
      ))}
      {isLoading &&
        Array.from({ length: 12 }).map((_, i) => (
          <PokemonCardSkeleton key={`skeleton-${i}`} />
        ))}
    </div>
  );
}
