import type { PokemonDetail, MoveDetail, TypeData } from '../types/pokemon';

const LEVEL = 50;

export interface BattlePokemon {
  pokemon: PokemonDetail;
  typeData: TypeData[];
  moves: MoveDetail[];
}

export interface MoveAnalysis {
  move: MoveDetail;
  estimatedDamage: number;
  effectiveness: number;
  isStab: boolean;
}

export interface BattleTurn {
  turn: number;
  attackerName: string;
  attackerId: number;
  moveName: string;
  moveType: string;
  damage: number;
  effectiveness: number;
  isStab: boolean;
  hp1: number;
  hp2: number;
  maxHp1: number;
  maxHp2: number;
  message: string;
}

export interface BattleAnalysis {
  bestMoves: MoveAnalysis[];
  typeAdvantage: string[];
  typeDisadvantage: string[];
}

export interface BattleResult {
  winner: 1 | 2;
  winnerName: string;
  turns: BattleTurn[];
  totalTurns: number;
  remainingHpPercent: number;
  analysis1: BattleAnalysis;
  analysis2: BattleAnalysis;
}

function getStat(pokemon: PokemonDetail, statName: string): number {
  return pokemon.stats.find(s => s.stat.name === statName)?.base_stat || 0;
}

function getHpStat(pokemon: PokemonDetail): number {
  const base = getStat(pokemon, 'hp');
  // Simplified HP calculation at level 50
  return Math.floor(((2 * base + 31) * LEVEL) / 100) + LEVEL + 10;
}

function getPokemonTypes(pokemon: PokemonDetail): string[] {
  return pokemon.types.map(t => t.type.name);
}

function getTypeEffectiveness(
  moveType: string,
  defenderTypeData: TypeData[]
): number {
  let multiplier = 1;
  for (const typeData of defenderTypeData) {
    if (typeData.damage_relations.double_damage_from.some(t => t.name === moveType)) {
      multiplier *= 2;
    } else if (typeData.damage_relations.half_damage_from.some(t => t.name === moveType)) {
      multiplier *= 0.5;
    } else if (typeData.damage_relations.no_damage_from.some(t => t.name === moveType)) {
      multiplier *= 0;
    }
  }
  return multiplier;
}

function calculateDamage(
  attacker: PokemonDetail,
  defender: PokemonDetail,
  move: MoveDetail,
  defenderTypeData: TypeData[],
  randomFactor: number = 0.925 // average random
): { damage: number; effectiveness: number; isStab: boolean } {
  const power = move.power || 0;
  if (power === 0) return { damage: 0, effectiveness: 1, isStab: false };

  const isPhysical = move.damage_class.name === 'physical';
  const atk = isPhysical ? getStat(attacker, 'attack') : getStat(attacker, 'special-attack');
  const def = isPhysical ? getStat(defender, 'defense') : getStat(defender, 'special-defense');

  const attackerTypes = getPokemonTypes(attacker);
  const isStab = attackerTypes.includes(move.type.name);
  const stabMultiplier = isStab ? 1.5 : 1;

  const effectiveness = getTypeEffectiveness(move.type.name, defenderTypeData);

  const baseDamage = Math.floor(
    ((((2 * LEVEL) / 5 + 2) * power * (atk / def)) / 50 + 2)
  );

  const finalDamage = Math.max(
    1,
    Math.floor(baseDamage * stabMultiplier * effectiveness * randomFactor)
  );

  return { damage: finalDamage, effectiveness, isStab };
}

function selectBestMoves(
  attacker: PokemonDetail,
  defender: PokemonDetail,
  availableMoves: MoveDetail[],
  defenderTypeData: TypeData[],
  count: number = 4
): MoveAnalysis[] {
  const analyses: MoveAnalysis[] = availableMoves
    .filter(m => m.power && m.power > 0)
    .map(move => {
      const { damage, effectiveness, isStab } = calculateDamage(
        attacker, defender, move, defenderTypeData
      );
      return { move, estimatedDamage: damage, effectiveness, isStab };
    })
    .sort((a, b) => b.estimatedDamage - a.estimatedDamage);

  return analyses.slice(0, count);
}

function getTypeAdvantages(
  attackerTypes: string[],
  defenderTypeData: TypeData[]
): string[] {
  return attackerTypes.filter(type => {
    const eff = getTypeEffectiveness(type, defenderTypeData);
    return eff > 1;
  });
}


function getEffectivenessMessage(effectiveness: number): string {
  if (effectiveness === 0) return "It had no effect...";
  if (effectiveness >= 4) return "It's ultra effective!";
  if (effectiveness >= 2) return "It's super effective!";
  if (effectiveness < 1) return "It's not very effective...";
  return "";
}

export function simulateBattle(
  bp1: BattlePokemon,
  bp2: BattlePokemon
): BattleResult {
  const { pokemon: p1, typeData: td1, moves: moves1 } = bp1;
  const { pokemon: p2, typeData: td2, moves: moves2 } = bp2;

  // Analyze best moves
  const bestMoves1 = selectBestMoves(p1, p2, moves1, td2);
  const bestMoves2 = selectBestMoves(p2, p1, moves2, td1);

  const analysis1: BattleAnalysis = {
    bestMoves: bestMoves1,
    typeAdvantage: getTypeAdvantages(getPokemonTypes(p1), td2),
    typeDisadvantage: getTypeAdvantages(getPokemonTypes(p2), td1),
  };

  const analysis2: BattleAnalysis = {
    bestMoves: bestMoves2,
    typeAdvantage: getTypeAdvantages(getPokemonTypes(p2), td1),
    typeDisadvantage: getTypeAdvantages(getPokemonTypes(p1), td2),
  };

  // Simulate battle
  const maxHp1 = getHpStat(p1);
  const maxHp2 = getHpStat(p2);
  let hp1 = maxHp1;
  let hp2 = maxHp2;
  const turns: BattleTurn[] = [];
  let turnCount = 0;

  const speed1 = getStat(p1, 'speed');
  const speed2 = getStat(p2, 'speed');

  // Each pokemon uses their best moves in rotation
  const movePool1 = bestMoves1.length > 0 ? bestMoves1 : [{ move: { power: 40, type: { name: 'normal' }, damage_class: { name: 'physical' }, name: 'tackle' } as MoveDetail, estimatedDamage: 20, effectiveness: 1, isStab: false }];
  const movePool2 = bestMoves2.length > 0 ? bestMoves2 : [{ move: { power: 40, type: { name: 'normal' }, damage_class: { name: 'physical' }, name: 'tackle' } as MoveDetail, estimatedDamage: 20, effectiveness: 1, isStab: false }];

  while (hp1 > 0 && hp2 > 0 && turnCount < 100) {
    turnCount++;

    const move1 = movePool1[(turnCount - 1) % movePool1.length];
    const move2 = movePool2[(turnCount - 1) % movePool2.length];

    // Determine order
    const firstIsP1 = speed1 >= speed2;

    const attackFirst = () => {
      if (firstIsP1) {
        // P1 attacks P2
        const randomFactor = 0.85 + Math.random() * 0.15;
        const { damage, effectiveness, isStab } = calculateDamage(p1, p2, move1.move, td2, randomFactor);
        hp2 = Math.max(0, hp2 - damage);
        const effMsg = getEffectivenessMessage(effectiveness);
        turns.push({
          turn: turnCount,
          attackerName: p1.name,
          attackerId: p1.id,
          moveName: move1.move.name,
          moveType: move1.move.type.name,
          damage,
          effectiveness,
          isStab,
          hp1, hp2, maxHp1, maxHp2,
          message: `${p1.name} used ${move1.move.name}! ${effMsg}`.trim(),
        });
      } else {
        // P2 attacks P1
        const randomFactor = 0.85 + Math.random() * 0.15;
        const { damage, effectiveness, isStab } = calculateDamage(p2, p1, move2.move, td1, randomFactor);
        hp1 = Math.max(0, hp1 - damage);
        const effMsg = getEffectivenessMessage(effectiveness);
        turns.push({
          turn: turnCount,
          attackerName: p2.name,
          attackerId: p2.id,
          moveName: move2.move.name,
          moveType: move2.move.type.name,
          damage,
          effectiveness,
          isStab,
          hp1, hp2, maxHp1, maxHp2,
          message: `${p2.name} used ${move2.move.name}! ${effMsg}`.trim(),
        });
      }
    };

    const attackSecond = () => {
      if (hp1 <= 0 || hp2 <= 0) return;
      if (firstIsP1) {
        // P2 attacks P1
        const randomFactor = 0.85 + Math.random() * 0.15;
        const { damage, effectiveness, isStab } = calculateDamage(p2, p1, move2.move, td1, randomFactor);
        hp1 = Math.max(0, hp1 - damage);
        const effMsg = getEffectivenessMessage(effectiveness);
        turns.push({
          turn: turnCount,
          attackerName: p2.name,
          attackerId: p2.id,
          moveName: move2.move.name,
          moveType: move2.move.type.name,
          damage,
          effectiveness,
          isStab,
          hp1, hp2, maxHp1, maxHp2,
          message: `${p2.name} used ${move2.move.name}! ${effMsg}`.trim(),
        });
      } else {
        // P1 attacks P2
        const randomFactor = 0.85 + Math.random() * 0.15;
        const { damage, effectiveness, isStab } = calculateDamage(p1, p2, move1.move, td2, randomFactor);
        hp2 = Math.max(0, hp2 - damage);
        const effMsg = getEffectivenessMessage(effectiveness);
        turns.push({
          turn: turnCount,
          attackerName: p1.name,
          attackerId: p1.id,
          moveName: move1.move.name,
          moveType: move1.move.type.name,
          damage,
          effectiveness,
          isStab,
          hp1, hp2, maxHp1, maxHp2,
          message: `${p1.name} used ${move1.move.name}! ${effMsg}`.trim(),
        });
      }
    };

    attackFirst();
    attackSecond();
  }

  const winner: 1 | 2 = hp1 > 0 ? 1 : 2;
  const remainingHp = winner === 1 ? hp1 : hp2;
  const maxHpWinner = winner === 1 ? maxHp1 : maxHp2;

  return {
    winner,
    winnerName: winner === 1 ? p1.name : p2.name,
    turns,
    totalTurns: turnCount,
    remainingHpPercent: Math.round((remainingHp / maxHpWinner) * 100),
    analysis1,
    analysis2,
  };
}
