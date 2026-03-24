import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { EvolutionStep } from '../../types/pokemon';
import { capitalize } from '../../utils/helpers';

interface EvolutionChainProps {
  steps: EvolutionStep[];
}

export function EvolutionChain({ steps }: EvolutionChainProps) {
  if (steps.length <= 1) {
    return <p className="text-gray-500 text-sm">This Pokémon does not evolve.</p>;
  }

  return (
    <div className="flex items-center justify-center gap-2 flex-wrap">
      {steps.map((step, i) => (
        <div key={step.id} className="flex items-center gap-2">
          {i > 0 && (
            <div className="flex flex-col items-center text-gray-500 px-1">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              <span className="text-[10px]">
                {step.minLevel ? `Lv.${step.minLevel}` : step.item ? capitalize(step.item) : ''}
              </span>
            </div>
          )}
          <Link to={`/pokemon/${step.id}`}>
            <motion.div
              className="flex flex-col items-center gap-1 p-3 rounded-xl bg-gray-800/40 hover:bg-gray-700/50 transition-colors cursor-pointer"
              whileHover={{ scale: 1.05 }}
            >
              <img
                src={step.sprite}
                alt={step.name}
                className="w-20 h-20 object-contain"
                loading="lazy"
              />
              <span className="text-white text-xs font-semibold">
                {capitalize(step.name)}
              </span>
            </motion.div>
          </Link>
        </div>
      ))}
    </div>
  );
}
