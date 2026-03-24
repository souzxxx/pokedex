import { getTypeColor } from '../../utils/colors';
import { capitalize } from '../../utils/helpers';

interface TypeBadgeProps {
  type: string;
  size?: 'sm' | 'md' | 'lg';
  showMultiplier?: number;
}

export function TypeBadge({ type, size = 'md', showMultiplier }: TypeBadgeProps) {
  const color = getTypeColor(type);

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-3 py-1',
    lg: 'text-sm px-4 py-1.5',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-semibold text-white ${sizeClasses[size]}`}
      style={{ backgroundColor: color }}
    >
      {capitalize(type)}
      {showMultiplier && (
        <span className="opacity-80 text-[0.85em]">{showMultiplier}x</span>
      )}
    </span>
  );
}
