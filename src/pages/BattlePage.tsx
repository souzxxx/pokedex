import { motion } from 'framer-motion';
import { BattleArena } from '../components/battle/BattleArena';

export function BattlePage() {
  return (
    <motion.div
      className="max-w-4xl mx-auto px-4 py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
          Battle Simulator
        </h2>
        <p className="text-gray-400">
          Choose two Pokémon and see who would win in battle
        </p>
      </div>
      <BattleArena />
    </motion.div>
  );
}
