export const TYPE_COLORS: Record<string, string> = {
  normal: '#A8A77A',
  fire: '#EE8130',
  water: '#6390F0',
  electric: '#F7D02C',
  grass: '#7AC74C',
  ice: '#96D9D6',
  fighting: '#C22E28',
  poison: '#A33EA1',
  ground: '#E2BF65',
  flying: '#A98FF3',
  psychic: '#F95587',
  bug: '#A6B91A',
  rock: '#B6A136',
  ghost: '#735797',
  dragon: '#6F35FC',
  dark: '#705746',
  steel: '#B7B7CE',
  fairy: '#D685AD',
};

export function getTypeColor(type: string): string {
  return TYPE_COLORS[type.toLowerCase()] || '#A8A77A';
}

export function getTypeGradient(type: string): string {
  const color = getTypeColor(type);
  return `linear-gradient(135deg, ${color}33 0%, transparent 50%)`;
}

export function getStatColor(value: number): string {
  if (value < 50) return '#ef4444';
  if (value < 80) return '#f59e0b';
  if (value < 100) return '#22c55e';
  return '#06b6d4';
}
