import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePokemonDetail } from '../hooks/usePokemonDetail';
import { usePokemonSpecies } from '../hooks/usePokemonSpecies';
import { useTypeData } from '../hooks/useTypeData';
import { useEvolutionChain } from '../hooks/useEvolutionChain';
import { TypeBadge } from '../components/pokemon/TypeBadge';
import { StatBar } from '../components/pokemon/StatBar';
import { WeaknessChart } from '../components/pokemon/WeaknessChart';
import { EvolutionChain } from '../components/pokemon/EvolutionChain';
import { MoveList } from '../components/pokemon/MoveList';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { padId, capitalize, getSprite } from '../utils/helpers';
import { getTypeColor } from '../utils/colors';
import type { TypeData } from '../types/pokemon';

export function PokemonDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const pokemonId = parseInt(id || '1', 10);

  const { data: pokemon, isLoading } = usePokemonDetail(pokemonId);
  const { data: species } = usePokemonSpecies(pokemonId);
  const typeNames = pokemon?.types.map(t => t.type.name) || [];
  const { data: typeDataList } = useTypeData(typeNames);
  const { data: evolutionSteps } = useEvolutionChain(species?.evolution_chain?.url);

  if (isLoading || !pokemon) {
    return <LoadingSpinner />;
  }

  const primaryType = pokemon.types[0]?.type.name || 'normal';
  const typeColor = getTypeColor(primaryType);
  const totalStats = pokemon.stats.reduce((sum, s) => sum + s.base_stat, 0);

  const flavorText = species?.flavor_text_entries
    .filter(e => e.language.name === 'en')
    .at(-1)
    ?.flavor_text.replace(/\f/g, ' ')
    .replace(/\n/g, ' ') || '';

  const genus = species?.genera
    .find(g => g.language.name === 'en')
    ?.genus || '';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Hero Section */}
      <div
        className="relative overflow-hidden"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, ${typeColor}44 0%, transparent 70%)`,
        }}
      >
        <div className="max-w-4xl mx-auto px-4 pt-6 pb-8">
          {/* Navigation */}
          <div className="flex items-center justify-between mb-6">
            <Link
              to="/"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors no-underline"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </Link>
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/pokemon/${Math.max(1, pokemonId - 1)}`)}
                disabled={pokemonId <= 1}
                className="p-2 rounded-lg bg-gray-800/60 text-gray-400 hover:text-white disabled:opacity-30 transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => navigate(`/pokemon/${pokemonId + 1}`)}
                className="p-2 rounded-lg bg-gray-800/60 text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Pokemon Info */}
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Sprite */}
            <motion.div
              className="flex-shrink-0"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
              <img
                src={getSprite(pokemon.id)}
                alt={pokemon.name}
                className="w-56 h-56 md:w-72 md:h-72 object-contain drop-shadow-2xl"
              />
            </motion.div>

            {/* Details */}
            <div className="text-center md:text-left flex-1">
              <p className="text-gray-500 font-mono text-lg mb-1">{padId(pokemon.id)}</p>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                {capitalize(pokemon.name)}
              </h1>
              {genus && (
                <p className="text-gray-400 text-sm mb-4">{genus}</p>
              )}
              <div className="flex gap-2 justify-center md:justify-start mb-4">
                {pokemon.types.map(t => (
                  <TypeBadge key={t.type.name} type={t.type.name} size="lg" />
                ))}
              </div>
              {flavorText && (
                <p className="text-gray-300 text-sm leading-relaxed max-w-md">
                  {flavorText}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Details Sections */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* About */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">About</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-gray-800/40 rounded-xl p-4 text-center">
              <p className="text-gray-500 text-xs mb-1">Height</p>
              <p className="text-white font-bold">{(pokemon.height / 10).toFixed(1)}m</p>
            </div>
            <div className="bg-gray-800/40 rounded-xl p-4 text-center">
              <p className="text-gray-500 text-xs mb-1">Weight</p>
              <p className="text-white font-bold">{(pokemon.weight / 10).toFixed(1)}kg</p>
            </div>
            <div className="bg-gray-800/40 rounded-xl p-4 text-center">
              <p className="text-gray-500 text-xs mb-1">Base Exp</p>
              <p className="text-white font-bold">{pokemon.base_experience}</p>
            </div>
            <div className="bg-gray-800/40 rounded-xl p-4 text-center">
              <p className="text-gray-500 text-xs mb-1">Abilities</p>
              <div className="text-white font-bold text-xs">
                {pokemon.abilities.map((a, i) => (
                  <span key={a.ability.name}>
                    {capitalize(a.ability.name)}
                    {a.is_hidden && <span className="text-gray-500"> (H)</span>}
                    {i < pokemon.abilities.length - 1 && ', '}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">Base Stats</h2>
          <div className="bg-gray-800/40 rounded-xl p-5 space-y-3">
            {pokemon.stats.map((stat, i) => (
              <StatBar
                key={stat.stat.name}
                name={stat.stat.name}
                value={stat.base_stat}
                delay={i * 0.1}
              />
            ))}
            <div className="flex items-center gap-3 pt-2 border-t border-gray-700/50">
              <span className="text-gray-400 text-xs font-semibold w-14 text-right">
                TOTAL
              </span>
              <span className="text-white text-sm font-bold w-8 text-right">
                {totalStats}
              </span>
            </div>
          </div>
        </section>

        {/* Weaknesses */}
        {typeDataList.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-white mb-4">Weaknesses</h2>
            <div className="bg-gray-800/40 rounded-xl p-5">
              <WeaknessChart typeDataList={typeDataList as TypeData[]} />
            </div>
          </section>
        )}

        {/* Evolution */}
        {evolutionSteps && (
          <section>
            <h2 className="text-xl font-bold text-white mb-4">Evolution Chain</h2>
            <div className="bg-gray-800/40 rounded-xl p-5">
              <EvolutionChain steps={evolutionSteps} />
            </div>
          </section>
        )}

        {/* Moves */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">
            Moves ({pokemon.moves.length})
          </h2>
          <div className="bg-gray-800/40 rounded-xl p-5">
            <MoveList moves={pokemon.moves} />
          </div>
        </section>
      </div>
    </motion.div>
  );
}
