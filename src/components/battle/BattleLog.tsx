import { motion } from 'framer-motion';
import type { BattleTurn } from '../../utils/battleSimulator';
import { capitalize, getSprite } from '../../utils/helpers';
import { getTypeColor } from '../../utils/colors';

interface BattleLogProps {
  turns: BattleTurn[];
  pokemon1Name: string;
  pokemon2Name: string;
  pokemon1Id: number;
  pokemon2Id: number;
  winnerName: string;
}

function HpBar({ current, max, label }: { current: number; max: number; label: string }) {
  const pct = Math.max(0, (current / max) * 100);
  const color = pct > 50 ? '#22c55e' : pct > 20 ? '#f59e0b' : '#ef4444';

  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-gray-400 w-20 truncate">{capitalize(label)}</span>
      <div className="flex-1 bg-gray-700/50 rounded-full h-2 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <span className="text-gray-500 w-16 text-right">{current}/{max}</span>
    </div>
  );
}

export function BattleLog({ turns, pokemon1Name, pokemon2Name, pokemon1Id, pokemon2Id, winnerName }: BattleLogProps) {
  return (
    <div className="space-y-2">
      {turns.map((turn, i) => {
        const isP1 = turn.attackerName === pokemon1Name;
        const typeColor = getTypeColor(turn.moveType);

        return (
          <motion.div
            key={i}
            className="bg-gray-800/40 rounded-lg px-4 py-3"
            initial={{ opacity: 0, x: isP1 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08, duration: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <img
                src={getSprite(turn.attackerId)}
                alt={turn.attackerName}
                className="w-8 h-8 object-contain"
              />
              <div className="flex-1">
                <span className="text-white text-sm font-medium">
                  {capitalize(turn.attackerName)}
                </span>
                <span className="text-gray-500 text-xs ml-2">Turn {turn.turn}</span>
              </div>
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: `${typeColor}33`, color: typeColor }}
              >
                {capitalize(turn.moveName)}
              </span>
              <span className="text-red-400 text-sm font-bold">-{turn.damage}</span>
            </div>
            {turn.effectiveness !== 1 && (
              <p className={`text-xs ml-11 ${turn.effectiveness > 1 ? 'text-green-400' : 'text-orange-400'}`}>
                {turn.effectiveness >= 2 ? "⚡ Super effective!" : turn.effectiveness === 0 ? "No effect..." : "Not very effective..."}
              </p>
            )}
            {/* HP bars */}
            <div className="ml-11 space-y-1 mt-2">
              <HpBar current={turn.hp1} max={turn.maxHp1} label={pokemon1Name} />
              <HpBar current={turn.hp2} max={turn.maxHp2} label={pokemon2Name} />
            </div>
          </motion.div>
        );
      })}

      {/* Victory message */}
      <motion.div
        className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 rounded-xl p-4 text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: turns.length * 0.08 + 0.3 }}
      >
        <img
          src={getSprite(winnerName === pokemon1Name ? pokemon1Id : pokemon2Id)}
          alt={winnerName}
          className="w-16 h-16 object-contain mx-auto mb-2"
        />
        <p className="text-yellow-300 font-bold text-lg">
          🏆 {capitalize(winnerName)} wins!
        </p>
      </motion.div>
    </div>
  );
}
