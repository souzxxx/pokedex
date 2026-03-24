import { useState } from 'react';
import { motion } from 'framer-motion';
import type { PokemonDetail } from '../../types/pokemon';
import { PokemonSelector } from './PokemonSelector';
import { BattleResult } from './BattleResult';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { useBattleSimulation } from '../../hooks/useBattleSimulation';

export function BattleArena() {
  const [pokemon1, setPokemon1] = useState<PokemonDetail | null>(null);
  const [pokemon2, setPokemon2] = useState<PokemonDetail | null>(null);
  const [battleStarted, setBattleStarted] = useState(false);

  const { result, isLoading } = useBattleSimulation(pokemon1, pokemon2, battleStarted);

  const canBattle = pokemon1 && pokemon2 && !battleStarted;

  const handleStartBattle = () => {
    if (pokemon1 && pokemon2) {
      setBattleStarted(true);
    }
  };

  const handleReset = () => {
    setPokemon1(null);
    setPokemon2(null);
    setBattleStarted(false);
  };

  // Show result
  if (battleStarted && result && pokemon1 && pokemon2) {
    return (
      <BattleResult
        pokemon1={pokemon1}
        pokemon2={pokemon2}
        result={result}
        onReset={handleReset}
      />
    );
  }

  // Loading state
  if (battleStarted && isLoading) {
    return (
      <div className="text-center py-12">
        <LoadingSpinner size={64} />
        <p className="text-gray-400 mt-4">Analyzing moves and simulating battle...</p>
        <p className="text-gray-600 text-sm mt-1">Fetching move data from PokéAPI</p>
      </div>
    );
  }

  // Selection state
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PokemonSelector
          label="Pokémon 1"
          selected={pokemon1}
          onSelect={setPokemon1}
          onClear={() => setPokemon1(null)}
        />
        <PokemonSelector
          label="Pokémon 2"
          selected={pokemon2}
          onSelect={setPokemon2}
          onClear={() => setPokemon2(null)}
        />
      </div>

      {/* Battle button */}
      <motion.div
        className="flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: canBattle ? 1 : 0.3 }}
      >
        <button
          onClick={handleStartBattle}
          disabled={!canBattle}
          className="group relative px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold text-lg rounded-xl transition-all duration-300 cursor-pointer disabled:cursor-not-allowed shadow-lg hover:shadow-red-500/25"
        >
          <span className="flex items-center gap-2">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Battle!
          </span>
        </button>
      </motion.div>

      {!pokemon1 && !pokemon2 && (
        <p className="text-center text-gray-600 text-sm">
          Select two Pokémon to start a battle simulation
        </p>
      )}
    </div>
  );
}
