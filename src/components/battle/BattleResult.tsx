import { motion } from 'framer-motion';
import type { PokemonDetail } from '../../types/pokemon';
import type { BattleResult as BattleResultType } from '../../utils/battleSimulator';
import { TypeBadge } from '../pokemon/TypeBadge';
import { BattleLog } from './BattleLog';
import { capitalize, getSprite, formatStatName } from '../../utils/helpers';
import { getTypeColor, getStatColor } from '../../utils/colors';
import { STAT_MAX } from '../../utils/constants';

interface BattleResultProps {
  pokemon1: PokemonDetail;
  pokemon2: PokemonDetail;
  result: BattleResultType;
  onReset: () => void;
}

function StatComparison({ pokemon1, pokemon2 }: { pokemon1: PokemonDetail; pokemon2: PokemonDetail }) {
  return (
    <div className="space-y-3">
      {pokemon1.stats.map((stat, i) => {
        const val1 = stat.base_stat;
        const val2 = pokemon2.stats[i]?.base_stat || 0;
        const max = STAT_MAX;
        const winner = val1 > val2 ? 1 : val2 > val1 ? 2 : 0;

        return (
          <div key={stat.stat.name} className="flex items-center gap-2">
            {/* P1 bar (reversed) */}
            <span className={`text-sm font-bold w-8 text-right ${winner === 1 ? 'text-white' : 'text-gray-500'}`}>
              {val1}
            </span>
            <div className="flex-1 bg-gray-700/30 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full rounded-full ml-auto"
                style={{ backgroundColor: getStatColor(val1) }}
                initial={{ width: 0 }}
                animate={{ width: `${(val1 / max) * 100}%` }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
              />
            </div>

            {/* Stat label */}
            <span className="text-gray-400 text-xs font-semibold w-12 text-center">
              {formatStatName(stat.stat.name)}
            </span>

            {/* P2 bar */}
            <div className="flex-1 bg-gray-700/30 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: getStatColor(val2) }}
                initial={{ width: 0 }}
                animate={{ width: `${(val2 / max) * 100}%` }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
              />
            </div>
            <span className={`text-sm font-bold w-8 ${winner === 2 ? 'text-white' : 'text-gray-500'}`}>
              {val2}
            </span>
          </div>
        );
      })}
      {/* Totals */}
      <div className="flex items-center gap-2 pt-2 border-t border-gray-700/30">
        <span className="text-sm font-bold w-8 text-right text-white">
          {pokemon1.stats.reduce((s, v) => s + v.base_stat, 0)}
        </span>
        <div className="flex-1" />
        <span className="text-gray-400 text-xs font-semibold w-12 text-center">TOTAL</span>
        <div className="flex-1" />
        <span className="text-sm font-bold w-8 text-white">
          {pokemon2.stats.reduce((s, v) => s + v.base_stat, 0)}
        </span>
      </div>
    </div>
  );
}

export function BattleResult({ pokemon1, pokemon2, result, onReset }: BattleResultProps) {
  const p1Color = getTypeColor(pokemon1.types[0]?.type.name || 'normal');
  const p2Color = getTypeColor(pokemon2.types[0]?.type.name || 'normal');

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header with both Pokemon */}
      <div className="relative bg-gray-800/40 rounded-2xl overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to right, ${p1Color}22, transparent 40%, transparent 60%, ${p2Color}22)`,
          }}
        />
        <div className="relative flex items-center justify-between px-6 py-6">
          <div className="flex flex-col items-center flex-1">
            <motion.img
              src={getSprite(pokemon1.id)}
              alt={pokemon1.name}
              className="w-32 h-32 object-contain drop-shadow-lg"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            />
            <h3 className="text-white font-bold text-lg mt-2">{capitalize(pokemon1.name)}</h3>
            <div className="flex gap-1 mt-1">
              {pokemon1.types.map(t => (
                <TypeBadge key={t.type.name} type={t.type.name} size="sm" />
              ))}
            </div>
            {result.winner === 1 && (
              <span className="mt-2 text-yellow-400 text-xs font-bold bg-yellow-400/10 px-3 py-1 rounded-full">
                WINNER
              </span>
            )}
          </div>

          <div className="text-4xl font-black text-gray-600 px-4">VS</div>

          <div className="flex flex-col items-center flex-1">
            <motion.img
              src={getSprite(pokemon2.id)}
              alt={pokemon2.name}
              className="w-32 h-32 object-contain drop-shadow-lg"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            />
            <h3 className="text-white font-bold text-lg mt-2">{capitalize(pokemon2.name)}</h3>
            <div className="flex gap-1 mt-1">
              {pokemon2.types.map(t => (
                <TypeBadge key={t.type.name} type={t.type.name} size="sm" />
              ))}
            </div>
            {result.winner === 2 && (
              <span className="mt-2 text-yellow-400 text-xs font-bold bg-yellow-400/10 px-3 py-1 rounded-full">
                WINNER
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gray-800/40 rounded-xl p-4 text-center">
        <p className="text-white text-sm">
          <span className="font-bold text-yellow-400">{capitalize(result.winnerName)}</span>
          {' '}wins in{' '}
          <span className="font-bold">{result.totalTurns} turns</span>
          {' '}with{' '}
          <span className="font-bold text-green-400">{result.remainingHpPercent}% HP</span>
          {' '}remaining
        </p>
      </div>

      {/* Stats Comparison */}
      <section>
        <h3 className="text-lg font-bold text-white mb-3">Stats Comparison</h3>
        <div className="bg-gray-800/40 rounded-xl p-5">
          <div className="flex justify-between mb-3">
            <span className="text-sm font-semibold" style={{ color: p1Color }}>
              {capitalize(pokemon1.name)}
            </span>
            <span className="text-sm font-semibold" style={{ color: p2Color }}>
              {capitalize(pokemon2.name)}
            </span>
          </div>
          <StatComparison pokemon1={pokemon1} pokemon2={pokemon2} />
        </div>
      </section>

      {/* Best Moves */}
      <section>
        <h3 className="text-lg font-bold text-white mb-3">Best Moves</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* P1 moves */}
          <div className="bg-gray-800/40 rounded-xl p-4">
            <p className="text-sm font-semibold mb-3" style={{ color: p1Color }}>
              {capitalize(pokemon1.name)}'s Best Attacks
            </p>
            <div className="space-y-2">
              {result.analysis1.bestMoves.length === 0 ? (
                <p className="text-gray-500 text-sm">No damaging moves found</p>
              ) : (
                result.analysis1.bestMoves.map((ma, i) => (
                  <div key={i} className="flex items-center gap-2 bg-gray-900/40 rounded-lg px-3 py-2">
                    <TypeBadge type={ma.move.type.name} size="sm" />
                    <span className="text-white text-sm flex-1">{capitalize(ma.move.name)}</span>
                    <span className="text-gray-400 text-xs">~{ma.estimatedDamage} dmg</span>
                    {ma.isStab && (
                      <span className="text-yellow-400 text-[10px] font-bold">STAB</span>
                    )}
                    {ma.effectiveness > 1 && (
                      <span className="text-green-400 text-[10px] font-bold">{ma.effectiveness}x</span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* P2 moves */}
          <div className="bg-gray-800/40 rounded-xl p-4">
            <p className="text-sm font-semibold mb-3" style={{ color: p2Color }}>
              {capitalize(pokemon2.name)}'s Best Attacks
            </p>
            <div className="space-y-2">
              {result.analysis2.bestMoves.length === 0 ? (
                <p className="text-gray-500 text-sm">No damaging moves found</p>
              ) : (
                result.analysis2.bestMoves.map((ma, i) => (
                  <div key={i} className="flex items-center gap-2 bg-gray-900/40 rounded-lg px-3 py-2">
                    <TypeBadge type={ma.move.type.name} size="sm" />
                    <span className="text-white text-sm flex-1">{capitalize(ma.move.name)}</span>
                    <span className="text-gray-400 text-xs">~{ma.estimatedDamage} dmg</span>
                    {ma.isStab && (
                      <span className="text-yellow-400 text-[10px] font-bold">STAB</span>
                    )}
                    {ma.effectiveness > 1 && (
                      <span className="text-green-400 text-[10px] font-bold">{ma.effectiveness}x</span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Type Matchup */}
      <section>
        <h3 className="text-lg font-bold text-white mb-3">Type Matchup</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-800/40 rounded-xl p-4">
            <p className="text-sm font-semibold mb-2" style={{ color: p1Color }}>
              {capitalize(pokemon1.name)}
            </p>
            {result.analysis1.typeAdvantage.length > 0 && (
              <div className="mb-2">
                <p className="text-green-400 text-xs mb-1">Advantages</p>
                <div className="flex gap-1 flex-wrap">
                  {result.analysis1.typeAdvantage.map(t => (
                    <TypeBadge key={t} type={t} size="sm" />
                  ))}
                </div>
              </div>
            )}
            {result.analysis1.typeDisadvantage.length > 0 && (
              <div>
                <p className="text-red-400 text-xs mb-1">Weak to opponent's</p>
                <div className="flex gap-1 flex-wrap">
                  {result.analysis1.typeDisadvantage.map(t => (
                    <TypeBadge key={t} type={t} size="sm" />
                  ))}
                </div>
              </div>
            )}
            {result.analysis1.typeAdvantage.length === 0 && result.analysis1.typeDisadvantage.length === 0 && (
              <p className="text-gray-500 text-sm">Neutral matchup</p>
            )}
          </div>

          <div className="bg-gray-800/40 rounded-xl p-4">
            <p className="text-sm font-semibold mb-2" style={{ color: p2Color }}>
              {capitalize(pokemon2.name)}
            </p>
            {result.analysis2.typeAdvantage.length > 0 && (
              <div className="mb-2">
                <p className="text-green-400 text-xs mb-1">Advantages</p>
                <div className="flex gap-1 flex-wrap">
                  {result.analysis2.typeAdvantage.map(t => (
                    <TypeBadge key={t} type={t} size="sm" />
                  ))}
                </div>
              </div>
            )}
            {result.analysis2.typeDisadvantage.length > 0 && (
              <div>
                <p className="text-red-400 text-xs mb-1">Weak to opponent's</p>
                <div className="flex gap-1 flex-wrap">
                  {result.analysis2.typeDisadvantage.map(t => (
                    <TypeBadge key={t} type={t} size="sm" />
                  ))}
                </div>
              </div>
            )}
            {result.analysis2.typeAdvantage.length === 0 && result.analysis2.typeDisadvantage.length === 0 && (
              <p className="text-gray-500 text-sm">Neutral matchup</p>
            )}
          </div>
        </div>
      </section>

      {/* Battle Log */}
      <section>
        <h3 className="text-lg font-bold text-white mb-3">Battle Log</h3>
        <BattleLog
          turns={result.turns}
          pokemon1Name={pokemon1.name}
          pokemon2Name={pokemon2.name}
          pokemon1Id={pokemon1.id}
          pokemon2Id={pokemon2.id}
          winnerName={result.winnerName}
        />
      </section>

      {/* New Battle button */}
      <div className="text-center pt-4">
        <button
          onClick={onReset}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors cursor-pointer"
        >
          New Battle
        </button>
      </div>
    </motion.div>
  );
}
