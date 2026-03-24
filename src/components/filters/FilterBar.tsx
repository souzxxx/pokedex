import { SearchBar } from './SearchBar';
import { TypeFilter } from './TypeFilter';
import { GenerationFilter } from './GenerationFilter';

interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedTypes: string[];
  onTypesChange: (types: string[]) => void;
  selectedGeneration: number | null;
  onGenerationChange: (genId: number | null) => void;
}

export function FilterBar({
  search,
  onSearchChange,
  selectedTypes,
  onTypesChange,
  selectedGeneration,
  onGenerationChange,
}: FilterBarProps) {
  return (
    <div className="space-y-4">
      <SearchBar value={search} onChange={onSearchChange} />
      <div className="space-y-3">
        <div>
          <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">
            Generation
          </h3>
          <GenerationFilter selected={selectedGeneration} onChange={onGenerationChange} />
        </div>
        <div>
          <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">
            Type
          </h3>
          <TypeFilter selected={selectedTypes} onChange={onTypesChange} />
        </div>
      </div>
    </div>
  );
}
