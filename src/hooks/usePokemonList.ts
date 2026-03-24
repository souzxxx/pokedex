import { useInfiniteQuery } from '@tanstack/react-query';
import { getPokemonPage } from '../api/pokemon';
import { PAGE_SIZE } from '../utils/constants';

interface UsePokemonListOptions {
  generationOffset?: number;
  generationLimit?: number;
}

export function usePokemonList(options?: UsePokemonListOptions) {
  const baseOffset = options?.generationOffset ?? 0;
  const maxLimit = options?.generationLimit ?? 1025;

  return useInfiniteQuery({
    queryKey: ['pokemon-list', baseOffset, maxLimit],
    queryFn: async ({ pageParam = 0 }) => {
      const offset = baseOffset + pageParam;
      const remaining = maxLimit - pageParam;
      const limit = Math.min(PAGE_SIZE, remaining);

      if (limit <= 0) {
        return { pokemon: [], next: null, total: 0 };
      }

      return getPokemonPage(offset, limit);
    },
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((sum, p) => sum + p.pokemon.length, 0);
      if (loaded >= maxLimit || !lastPage.next || lastPage.pokemon.length === 0) {
        return undefined;
      }
      return loaded;
    },
    initialPageParam: 0,
  });
}
