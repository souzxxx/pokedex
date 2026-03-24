import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PokemonDetail } from '../../types/pokemon';
import { usePokemonSearch } from '../../hooks/usePokemonSearch';
import { useDebounce } from '../../hooks/useDebounce';
import { TypeBadge } from '../pokemon/TypeBadge';
import { capitalize, padId, getSprite } from '../../utils/helpers';
import { getTypeColor } from '../../utils/colors';

interface PokemonSelectorProps {
  label: string;
  selected: PokemonDetail | null;
  onSelect: (pokemon: PokemonDetail) => void;
  onClear: () => void;
}

export function PokemonSelector({ label, selected, onSelect, onClear }: PokemonSelectorProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const { data: results, isLoading } = usePokemonSearch(debouncedQuery);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (selected) {
    const primaryType = selected.types[0]?.type.name || 'normal';
    const color = getTypeColor(primaryType);

    return (
      <motion.div
        className="relative bg-gray-800/60 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50 overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div
          className="absolute inset-0 opacity-15"
          style={{
            background: `radial-gradient(circle at 50% 30%, ${color}, transparent 70%)`,
          }}
        />
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-2">
            <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
              {label}
            </span>
            <button
              onClick={onClear}
              className="text-gray-500 hover:text-white text-xs transition-colors cursor-pointer"
            >
              Change
            </button>
          </div>
          <div className="flex flex-col items-center">
            <img
              src={getSprite(selected.id)}
              alt={selected.name}
              className="w-36 h-36 object-contain drop-shadow-lg"
            />
            <p className="text-gray-500 font-mono text-sm">{padId(selected.id)}</p>
            <h3 className="text-white font-bold text-xl mb-2">
              {capitalize(selected.name)}
            </h3>
            <div className="flex gap-2 mb-3">
              {selected.types.map(t => (
                <TypeBadge key={t.type.name} type={t.type.name} size="sm" />
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2 text-center w-full">
              {selected.stats.slice(0, 6).map(s => (
                <div key={s.stat.name} className="bg-gray-900/50 rounded-lg px-2 py-1">
                  <p className="text-gray-500 text-[10px] uppercase">
                    {s.stat.name.replace('special-', 'sp.').replace('attack', 'atk').replace('defense', 'def')}
                  </p>
                  <p className="text-white font-bold text-sm">{s.base_stat}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50 border-dashed">
        <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider block mb-3">
          {label}
        </span>
        <div className="flex flex-col items-center gap-4">
          {/* Placeholder */}
          <div className="w-36 h-36 rounded-full bg-gray-700/30 flex items-center justify-center">
            <svg className="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          {/* Search input */}
          <div className="relative w-full">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={e => {
                setQuery(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              placeholder="Search Pokémon..."
              className="w-full bg-gray-900/60 border border-gray-700/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/25 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && debouncedQuery.length >= 2 && (
          <motion.div
            className="absolute z-50 mt-2 w-full bg-gray-800 border border-gray-700 rounded-xl shadow-2xl overflow-hidden max-h-72 overflow-y-auto"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {isLoading && (
              <div className="p-4 text-center text-gray-500 text-sm">Searching...</div>
            )}
            {!isLoading && results && results.length === 0 && (
              <div className="p-4 text-center text-gray-500 text-sm">No Pokémon found</div>
            )}
            {results?.map(pokemon => (
              <button
                key={pokemon.id}
                onClick={() => {
                  onSelect(pokemon);
                  setQuery('');
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-700/50 transition-colors cursor-pointer text-left"
              >
                <img
                  src={getSprite(pokemon.id)}
                  alt={pokemon.name}
                  className="w-10 h-10 object-contain"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">
                    {capitalize(pokemon.name)}
                  </p>
                  <p className="text-gray-500 text-xs font-mono">{padId(pokemon.id)}</p>
                </div>
                <div className="flex gap-1">
                  {pokemon.types.map(t => (
                    <TypeBadge key={t.type.name} type={t.type.name} size="sm" />
                  ))}
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
