import { ALL_TYPES } from '../../utils/constants';
import { getTypeColor } from '../../utils/colors';
import { capitalize } from '../../utils/helpers';

interface TypeFilterProps {
  selected: string[];
  onChange: (types: string[]) => void;
}

export function TypeFilter({ selected, onChange }: TypeFilterProps) {
  const toggleType = (type: string) => {
    if (selected.includes(type)) {
      onChange(selected.filter(t => t !== type));
    } else {
      onChange([...selected, type]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {ALL_TYPES.map(type => {
        const isActive = selected.includes(type);
        const color = getTypeColor(type);

        return (
          <button
            key={type}
            onClick={() => toggleType(type)}
            className="px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer border-2"
            style={{
              backgroundColor: isActive ? color : 'transparent',
              borderColor: isActive ? color : `${color}44`,
              color: isActive ? '#fff' : color,
              opacity: isActive ? 1 : 0.7,
            }}
          >
            {capitalize(type)}
          </button>
        );
      })}
    </div>
  );
}
