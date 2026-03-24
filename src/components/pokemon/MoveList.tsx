import { useState, useMemo } from 'react';
import type { PokemonMoveEntry } from '../../types/pokemon';
import { capitalize } from '../../utils/helpers';

interface MoveListProps {
  moves: PokemonMoveEntry[];
}

export function MoveList({ moves }: MoveListProps) {
  const [showAll, setShowAll] = useState(false);

  const sortedMoves = useMemo(() => {
    return [...moves]
      .sort((a, b) => a.move.name.localeCompare(b.move.name));
  }, [moves]);

  const displayMoves = showAll ? sortedMoves : sortedMoves.slice(0, 20);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {displayMoves.map(entry => (
          <div
            key={entry.move.name}
            className="flex items-center gap-2 bg-gray-800/40 rounded-lg px-3 py-2"
          >
            <span className="text-white text-sm font-medium flex-1">
              {capitalize(entry.move.name)}
            </span>
            <span className="text-gray-500 text-xs">
              {entry.version_group_details[0]?.move_learn_method.name === 'level-up'
                ? `Lv.${entry.version_group_details[0].level_learned_at}`
                : capitalize(entry.version_group_details[0]?.move_learn_method.name || '')}
            </span>
          </div>
        ))}
      </div>
      {sortedMoves.length > 20 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-3 text-sm text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
        >
          {showAll ? 'Show less' : `Show all ${sortedMoves.length} moves`}
        </button>
      )}
    </div>
  );
}
