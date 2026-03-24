import { useQuery } from '@tanstack/react-query';
import { getPokemonSpecies } from '../api/pokemon';

export function usePokemonSpecies(id: number) {
  return useQuery({
    queryKey: ['pokemon-species', id],
    queryFn: () => getPokemonSpecies(id),
    enabled: !!id,
  });
}
