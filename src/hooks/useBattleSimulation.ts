import { useQuery, useQueries } from '@tanstack/react-query';
import type { PokemonDetail, MoveDetail, TypeData } from '../types/pokemon';
import { getTypeData } from '../api/types';
import { getMoveDetail } from '../api/pokemon';
import { simulateBattle } from '../utils/battleSimulator';
import type { BattleResult } from '../utils/battleSimulator';

function getCandidateMoves(pokemon: PokemonDetail): string[] {
  // Get level-up moves sorted by level (highest first), then others
  const levelUp = pokemon.moves
    .filter(m => m.version_group_details.some(v => v.move_learn_method.name === 'level-up'))
    .sort((a, b) => {
      const levelA = Math.max(...a.version_group_details
        .filter(v => v.move_learn_method.name === 'level-up')
        .map(v => v.level_learned_at));
      const levelB = Math.max(...b.version_group_details
        .filter(v => v.move_learn_method.name === 'level-up')
        .map(v => v.level_learned_at));
      return levelB - levelA;
    })
    .map(m => m.move.name);

  // Take top 15 level-up moves + 5 TM/tutor moves
  const tmMoves = pokemon.moves
    .filter(m =>
      m.version_group_details.some(v =>
        v.move_learn_method.name === 'machine' || v.move_learn_method.name === 'tutor'
      ) && !levelUp.includes(m.move.name)
    )
    .slice(0, 5)
    .map(m => m.move.name);

  return [...levelUp.slice(0, 15), ...tmMoves];
}

export function useBattleSimulation(
  pokemon1: PokemonDetail | null,
  pokemon2: PokemonDetail | null,
  enabled: boolean
) {
  // Fetch type data for both pokemon
  const allTypeNames = [
    ...(pokemon1?.types.map(t => t.type.name) || []),
    ...(pokemon2?.types.map(t => t.type.name) || []),
  ];
  const uniqueTypes = [...new Set(allTypeNames)];

  const typeQueries = useQueries({
    queries: uniqueTypes.map(name => ({
      queryKey: ['type', name],
      queryFn: () => getTypeData(name),
      enabled: enabled && !!pokemon1 && !!pokemon2,
    })),
  });

  // Fetch move details for pokemon 1
  const candidateMoves1 = pokemon1 ? getCandidateMoves(pokemon1) : [];
  const candidateMoves2 = pokemon2 ? getCandidateMoves(pokemon2) : [];

  const moveQueries1 = useQueries({
    queries: candidateMoves1.map(name => ({
      queryKey: ['move', name],
      queryFn: () => getMoveDetail(name),
      enabled: enabled && !!pokemon1 && !!pokemon2,
    })),
  });

  const moveQueries2 = useQueries({
    queries: candidateMoves2.map(name => ({
      queryKey: ['move', name],
      queryFn: () => getMoveDetail(name),
      enabled: enabled && !!pokemon1 && !!pokemon2,
    })),
  });

  const typesLoading = typeQueries.some(q => q.isLoading);
  const moves1Loading = moveQueries1.some(q => q.isLoading);
  const moves2Loading = moveQueries2.some(q => q.isLoading);
  const isLoading = typesLoading || moves1Loading || moves2Loading;

  const allTypesReady = typeQueries.every(q => q.data);
  const allMoves1Ready = moveQueries1.every(q => q.data || q.isError);
  const allMoves2Ready = moveQueries2.every(q => q.data || q.isError);

  // Build the simulation result
  const result = useQuery<BattleResult | null>({
    queryKey: [
      'battle-sim',
      pokemon1?.id,
      pokemon2?.id,
      allTypesReady,
      allMoves1Ready,
      allMoves2Ready,
    ],
    queryFn: () => {
      if (!pokemon1 || !pokemon2) return null;

      const typeDataMap: Record<string, TypeData> = {};
      for (const q of typeQueries) {
        if (q.data) typeDataMap[q.data.name] = q.data;
      }

      const td1 = pokemon1.types
        .map(t => typeDataMap[t.type.name])
        .filter(Boolean) as TypeData[];
      const td2 = pokemon2.types
        .map(t => typeDataMap[t.type.name])
        .filter(Boolean) as TypeData[];

      const moves1 = moveQueries1
        .map(q => q.data)
        .filter((m): m is MoveDetail => !!m && !!m.power && m.power > 0);
      const moves2 = moveQueries2
        .map(q => q.data)
        .filter((m): m is MoveDetail => !!m && !!m.power && m.power > 0);

      return simulateBattle(
        { pokemon: pokemon1, typeData: td1, moves: moves1 },
        { pokemon: pokemon2, typeData: td2, moves: moves2 }
      );
    },
    enabled: enabled && !!pokemon1 && !!pokemon2 && allTypesReady && allMoves1Ready && allMoves2Ready,
    staleTime: 0, // Always re-simulate (has randomness)
  });

  return {
    result: result.data ?? null,
    isLoading: isLoading || result.isLoading,
    isError: result.isError,
  };
}
