import { Link, useLocation } from 'react-router-dom';

export function Header() {
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-lg border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-6">
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
        <nav className="flex items-center gap-1">
          <Link
            to="/"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors no-underline ${
              pathname === '/'
                ? 'bg-gray-800 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Pokédex
          </Link>
          <Link
            to="/battle"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors no-underline flex items-center gap-1.5 ${
              pathname === '/battle'
                ? 'bg-gray-800 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Battle
          </Link>
        </nav>
      </div>
    </header>
  );
}
