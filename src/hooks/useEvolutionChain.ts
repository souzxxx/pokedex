import { useQuery } from '@tanstack/react-query';
import { getEvolutionChain } from '../api/pokemon';
import type { EvolutionNode, EvolutionStep } from '../types/pokemon';
import { extractIdFromUrl } from '../utils/helpers';

function flattenChain(node: EvolutionNode): EvolutionStep[] {
  const steps: EvolutionStep[] = [];
  const id = extractIdFromUrl(node.species.url);

  steps.push({
    name: node.species.name,
    id,
    sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
    minLevel: node.evolution_details[0]?.min_level || null,
    trigger: node.evolution_details[0]?.trigger?.name || '',
    item: node.evolution_details[0]?.item?.name || null,
  });

  for (const evo of node.evolves_to) {
    steps.push(...flattenChain(evo));
  }

  return steps;
}

export function useEvolutionChain(url: string | undefined) {
  return useQuery({
    queryKey: ['evolution-chain', url],
    queryFn: async () => {
      if (!url) return null;
      const chain = await getEvolutionChain(url);
      return flattenChain(chain.chain);
    },
    enabled: !!url,
  });
}
