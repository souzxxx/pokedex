import type { TypeData } from '../../types/pokemon';
import { calculateWeaknesses } from '../../utils/typeEffectiveness';
import { TypeBadge } from './TypeBadge';

interface WeaknessChartProps {
  typeDataList: TypeData[];
}

export function WeaknessChart({ typeDataList }: WeaknessChartProps) {
  const weaknesses = calculateWeaknesses(typeDataList);
  const entries = Object.entries(weaknesses).sort((a, b) => b[1] - a[1]);

  if (entries.length === 0) {
    return <p className="text-gray-500 text-sm">No weaknesses</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {entries.map(([type, multiplier]) => (
        <TypeBadge
          key={type}
          type={type}
          size="md"
          showMultiplier={multiplier}
        />
      ))}
    </div>
  );
}
