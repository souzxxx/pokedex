import type { TypeData } from '../types/pokemon';

export interface TypeMultipliers {
  [typeName: string]: number;
}

export function calculateWeaknesses(typeDataList: TypeData[]): TypeMultipliers {
  const multipliers: TypeMultipliers = {};

  for (const typeData of typeDataList) {
    const { damage_relations } = typeData;

    for (const t of damage_relations.double_damage_from) {
      multipliers[t.name] = (multipliers[t.name] || 1) * 2;
    }

    for (const t of damage_relations.half_damage_from) {
      multipliers[t.name] = (multipliers[t.name] || 1) * 0.5;
    }

    for (const t of damage_relations.no_damage_from) {
      multipliers[t.name] = 0;
    }
  }

  // Only return types that are super effective (> 1)
  const weaknesses: TypeMultipliers = {};
  for (const [type, mult] of Object.entries(multipliers)) {
    if (mult > 1) {
      weaknesses[type] = mult;
    }
  }

  return weaknesses;
}

export function calculateResistances(typeDataList: TypeData[]): TypeMultipliers {
  const multipliers: TypeMultipliers = {};

  for (const typeData of typeDataList) {
    const { damage_relations } = typeData;

    for (const t of damage_relations.double_damage_from) {
      multipliers[t.name] = (multipliers[t.name] || 1) * 2;
    }

    for (const t of damage_relations.half_damage_from) {
      multipliers[t.name] = (multipliers[t.name] || 1) * 0.5;
    }

    for (const t of damage_relations.no_damage_from) {
      multipliers[t.name] = 0;
    }
  }

  const resistances: TypeMultipliers = {};
  for (const [type, mult] of Object.entries(multipliers)) {
    if (mult > 0 && mult < 1) {
      resistances[type] = mult;
    }
  }

  return resistances;
}
