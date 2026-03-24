export const GENERATIONS = [
  { id: 1, name: 'Gen I', label: 'Kanto', offset: 0, limit: 151 },
  { id: 2, name: 'Gen II', label: 'Johto', offset: 151, limit: 100 },
  { id: 3, name: 'Gen III', label: 'Hoenn', offset: 251, limit: 135 },
  { id: 4, name: 'Gen IV', label: 'Sinnoh', offset: 386, limit: 107 },
  { id: 5, name: 'Gen V', label: 'Unova', offset: 493, limit: 156 },
  { id: 6, name: 'Gen VI', label: 'Kalos', offset: 649, limit: 72 },
  { id: 7, name: 'Gen VII', label: 'Alola', offset: 721, limit: 88 },
  { id: 8, name: 'Gen VIII', label: 'Galar', offset: 809, limit: 96 },
  { id: 9, name: 'Gen IX', label: 'Paldea', offset: 905, limit: 120 },
] as const;

export const ALL_TYPES = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
] as const;

export const STAT_MAX = 255;

export const PAGE_SIZE = 24;

export const STAT_LABELS: Record<string, string> = {
  'hp': 'HP',
  'attack': 'ATK',
  'defense': 'DEF',
  'special-attack': 'SP.ATK',
  'special-defense': 'SP.DEF',
  'speed': 'SPD',
};
