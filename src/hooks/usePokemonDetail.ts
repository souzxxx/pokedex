import { useQuery } from '@tanstack/react-query';
import { getPokemonDetail } from '../api/pokemon';

export function usePokemonDetail(id: number | string) {
  return useQuery({
    queryKey: ['pokemon', id],
    queryFn: () => getPokemonDetail(id),
    enabled: !!id,
  });
}
