export function Footer() {
  return (
    <footer className="border-t border-gray-800/50 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-gray-500 text-sm">
          Data provided by{' '}
          <a
            href="https://pokeapi.co/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            PokéAPI
          </a>
        </p>
        <p className="text-gray-600 text-xs mt-1">
          Pokémon and all respective names are trademark &amp; © of Nintendo
        </p>
      </div>
    </footer>
  );
}
