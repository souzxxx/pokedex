import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/client';
import type { PokemonDetail } from '../types/pokemon';

async function searchPokemon(query: string): Promise<PokemonDetail[]> {
  const searchLower = query.toLowerCase().trim();
  if (!searchLower) return [];

  // Try direct match first (exact name or ID)
  try {
    const { data } = await apiClient.get<PokemonDetail>(`/pokemon/${searchLower}`);
    return [data];
  } catch {
    // Not an exact match, fall through to fuzzy search
  }

  // Fetch all pokemon names from the species list (lightweight, cached)
  const { data: listData } = await apiClient.get('/pokemon?limit=1025&offset=0');
  const matches = listData.results
    .filter((p: { name: string }) => p.name.includes(searchLower))
    .slice(0, 24);

  if (matches.length === 0) return [];

  const details = await Promise.all(
    matches.map((p: { name: string; url: string }) =>
      apiClient.get<PokemonDetail>(p.url).then(r => r.data)
    )
  );

  return details;
}

export function usePokemonSearch(query: string) {
  return useQuery({
    queryKey: ['pokemon-search', query],
    queryFn: () => searchPokemon(query),
    enabled: query.length >= 2,
    staleTime: 1000 * 60 * 5,
  });
}
