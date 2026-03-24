import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-lg border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
        <Link to="/" className="flex items-center gap-3 no-underline">
          <svg width="32" height="32" viewBox="0 0 100 100" className="flex-shrink-0">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#ef4444" strokeWidth="6" />
            <path d="M5 50 H38" stroke="#ef4444" strokeWidth="6" />
            <path d="M62 50 H95" stroke="#ef4444" strokeWidth="6" />
            <circle cx="50" cy="50" r="12" fill="none" stroke="#ef4444" strokeWidth="6" />
            <circle cx="50" cy="50" r="5" fill="#ef4444" />
            <path d="M5 50 A45 45 0 0 0 95 50" fill="#ef4444" opacity="0.2" />
          </svg>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Pokédex
          </h1>
        </Link>
      </div>
    </header>
  );
}
