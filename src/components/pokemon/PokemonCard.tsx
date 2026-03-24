import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { PokemonDetail } from '../../types/pokemon';
import { TypeBadge } from './TypeBadge';
import { padId, capitalize, getSprite } from '../../utils/helpers';
import { getTypeColor } from '../../utils/colors';

interface PokemonCardProps {
  pokemon: PokemonDetail;
  index: number;
}

export function PokemonCard({ pokemon, index }: PokemonCardProps) {
  const primaryType = pokemon.types[0]?.type.name || 'normal';
  const typeColor = getTypeColor(primaryType);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 24,
        delay: index * 0.03,
      }}
    >
      <Link to={`/pokemon/${pokemon.id}`} className="block">
        <motion.div
          className="relative bg-gray-800/60 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50 cursor-pointer overflow-hidden group"
          whileHover={{ y: -6, scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          {/* Background gradient */}
          <div
            className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at 50% 30%, ${typeColor}66, transparent 70%)`,
            }}
          />

          {/* Pokeball watermark */}
          <div className="absolute -right-6 -top-6 w-24 h-24 opacity-5 group-hover:opacity-10 transition-opacity">
            <svg viewBox="0 0 100 100" fill="currentColor">
              <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="4" />
              <line x1="2" y1="50" x2="98" y2="50" stroke="currentColor" strokeWidth="4" />
              <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="4" />
            </svg>
          </div>

          {/* Content */}
          <div className="relative z-10">
            <p className="text-gray-500 text-xs font-mono mb-1">{padId(pokemon.id)}</p>

            {/* Sprite */}
            <div className="flex justify-center mb-3">
              <img
                src={getSprite(pokemon.id)}
                alt={pokemon.name}
                className="w-32 h-32 object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
                loading="lazy"
              />
            </div>

            {/* Name */}
            <h3 className="text-white font-bold text-lg mb-2">
              {capitalize(pokemon.name)}
            </h3>

            {/* Types */}
            <div className="flex gap-2 justify-center flex-wrap">
              {pokemon.types.map(t => (
                <TypeBadge key={t.type.name} type={t.type.name} size="sm" />
              ))}
            </div>
          </div>

          {/* Hover glow */}
          <div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              boxShadow: `0 0 30px ${typeColor}33, inset 0 0 30px ${typeColor}11`,
            }}
          />
        </motion.div>
      </Link>
    </motion.div>
  );
}
