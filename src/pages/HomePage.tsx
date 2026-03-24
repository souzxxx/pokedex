import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { usePokemonList } from '../hooks/usePokemonList';
import { usePokemonSearch } from '../hooks/usePokemonSearch';
import { useDebounce } from '../hooks/useDebounce';
import { PokemonGrid } from '../components/pokemon/PokemonGrid';
import { FilterBar } from '../components/filters/FilterBar';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { GENERATIONS } from '../utils/constants';
import type { PokemonDetail } from '../types/pokemon';

export function HomePage() {
  const [search, setSearch] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedGeneration, setSelectedGeneration] = useState<number | null>(null);
  const debouncedSearch = useDebounce(search, 300);
  const observerRef = useRef<HTMLDivElement>(null);

  const isSearching = debouncedSearch.length >= 2;

  const gen = selectedGeneration
    ? GENERATIONS.find(g => g.id === selectedGeneration)
    : null;

  // Normal infinite scroll list
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isListLoading,
    isError: isListError,
  } = usePokemonList(
    gen ? { generationOffset: gen.offset, generationLimit: gen.limit } : undefined
  );

  // Direct API search when user types 2+ chars
  const {
    data: searchResults,
    isLoading: isSearchLoading,
    isError: isSearchError,
  } = usePokemonSearch(debouncedSearch);

  const allPokemon = useMemo(() => {
    if (!data) return [];
    return data.pages.flatMap(page => page.pokemon);
  }, [data]);

  // Use search results when searching, otherwise use scroll list
  const displayPokemon = useMemo(() => {
    let result: PokemonDetail[];

    if (isSearching && searchResults) {
      result = searchResults;
    } else if (isSearching) {
      // Still loading search results
      return [];
    } else {
      result = allPokemon;
    }

    // Apply type filter
    if (selectedTypes.length > 0) {
      result = result.filter(p =>
        selectedTypes.some(type =>
          p.types.some(t => t.type.name === type)
        )
      );
    }

    return result;
  }, [isSearching, searchResults, allPokemon, selectedTypes]);

  const isLoading = isSearching ? isSearchLoading : isListLoading;
  const isError = isSearching ? isSearchError : isListError;

  const handleFetchNext = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage && !isSearching) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, isSearching]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          handleFetchNext();
        }
      },
      { threshold: 0.1 }
    );

    const el = observerRef.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, [handleFetchNext]);

  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Hero */}
      <div className="text-center mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
          Explore all Pokémon
        </h2>
        <p className="text-gray-400">
          Browse through all generations and discover your favorites
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8">
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          selectedTypes={selectedTypes}
          onTypesChange={setSelectedTypes}
          selectedGeneration={selectedGeneration}
          onGenerationChange={setSelectedGeneration}
        />
      </div>

      {/* Results count */}
      {(isSearching || selectedTypes.length > 0) && !isLoading && (
        <p className="text-gray-500 text-sm mb-4">
          {displayPokemon.length} Pokémon found
        </p>
      )}

      {/* Error */}
      {isError && (
        <div className="text-center py-12">
          <p className="text-red-400 mb-2">Failed to load Pokémon</p>
          <button
            onClick={() => window.location.reload()}
            className="text-blue-400 hover:text-blue-300 text-sm cursor-pointer"
          >
            Try again
          </button>
        </div>
      )}

      {/* Loading */}
      {isLoading && <LoadingSpinner />}

      {/* Grid */}
      {!isLoading && (
        <>
          {displayPokemon.length === 0 && !isFetchingNextPage ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No Pokémon found</p>
              <p className="text-gray-600 text-sm mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <PokemonGrid
              pokemon={displayPokemon}
              isLoading={!isSearching && isFetchingNextPage}
            />
          )}
        </>
      )}

      {/* Infinite scroll sentinel */}
      {!isSearching && <div ref={observerRef} className="h-10" />}
    </motion.div>
  );
}
