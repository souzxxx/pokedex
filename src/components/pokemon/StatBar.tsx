import { motion } from 'framer-motion';
import { formatStatName } from '../../utils/helpers';
import { getStatColor } from '../../utils/colors';
import { STAT_MAX } from '../../utils/constants';

interface StatBarProps {
  name: string;
  value: number;
  delay?: number;
}

export function StatBar({ name, value, delay = 0 }: StatBarProps) {
  const percentage = Math.min((value / STAT_MAX) * 100, 100);
  const color = getStatColor(value);

  return (
    <div className="flex items-center gap-3">
      <span className="text-gray-400 text-xs font-semibold w-14 text-right">
        {formatStatName(name)}
      </span>
      <span className="text-white text-sm font-bold w-8 text-right">
        {value}
      </span>
      <div className="flex-1 bg-gray-700/50 rounded-full h-2.5 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{
            duration: 0.8,
            delay: delay,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        />
      </div>
    </div>
  );
}
