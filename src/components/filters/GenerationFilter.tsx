import { GENERATIONS } from '../../utils/constants';

interface GenerationFilterProps {
  selected: number | null;
  onChange: (genId: number | null) => void;
}

export function GenerationFilter({ selected, onChange }: GenerationFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange(null)}
        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
          selected === null
            ? 'bg-blue-500 text-white'
            : 'bg-gray-800/60 text-gray-400 hover:text-white hover:bg-gray-700/60'
        }`}
      >
        All
      </button>
      {GENERATIONS.map(gen => (
        <button
          key={gen.id}
          onClick={() => onChange(selected === gen.id ? null : gen.id)}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
            selected === gen.id
              ? 'bg-blue-500 text-white'
              : 'bg-gray-800/60 text-gray-400 hover:text-white hover:bg-gray-700/60'
          }`}
        >
          {gen.name}
        </button>
      ))}
    </div>
  );
}
