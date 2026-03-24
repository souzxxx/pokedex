export function LoadingSpinner({ size = 48 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center py-12">
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className="pokeball-spin"
      >
        <circle cx="50" cy="50" r="45" fill="none" stroke="#ef4444" strokeWidth="6" strokeDasharray="70 30" />
        <circle cx="50" cy="50" r="45" fill="none" stroke="#fff" strokeWidth="6" strokeDasharray="70 30" strokeDashoffset="100" />
        <line x1="5" y1="50" x2="95" y2="50" stroke="#374151" strokeWidth="4" />
        <circle cx="50" cy="50" r="12" fill="#374151" stroke="#fff" strokeWidth="3" />
        <circle cx="50" cy="50" r="5" fill="#fff" />
      </svg>
    </div>
  );
}
