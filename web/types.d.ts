/**
 * Sovereign 3.14 Pi Combat Simulator — TypeScript Large Data Model & Command Loader Definitions
 */

export type SPCStateCode = 'S0' | 'S1' | 'S2' | 'S3';

export type CombatModeId = 'WORLD' | 'RPG' | 'TD' | 'TDM' | 'BRAWL' | 'AMBUSH' | 'SIEGE';

export type CommandVerb =
  | 'ORBIT'
  | 'TRADE'
  | 'BOLSTER'
  | 'HOLD'
  | 'ATTACK'
  | 'DEFEND'
  | 'HEAL'
  | 'PURSUE_A_STAR'
  | 'SEAL_QUMQUM';

export type DamageType =
  | 'SLASH'
  | 'PIERCE'
  | 'BLUNT'
  | 'FIRE'
  | 'ICE'
  | 'LIGHTNING'
  | 'ARCANE'
  | 'TRUE';

export type ArmorType =
  | 'UNARMORED'
  | 'LIGHT_LEATHER'
  | 'MEDIUM_MAIL'
  | 'HEAVY_PLATE'
  | 'RUNIC_WARD'
  | 'COMPOSITE_REACTIVE'
  | 'AETHER_SHROUD'
  | 'SOVEREIGN_AEGIS';

export interface ECATAttributeTensor {
  max_hp: number;
  max_stamina: number;
  max_mana: number;
  attack_power: number;
  spell_power: number;
  armor: number;
  magic_resist: number;
  crit_chance: number;
  crit_multiplier: number;
  evasion: number;
  accuracy: number;
  attack_speed: number;
  move_speed: number;
  max_poise: number;
  tenacity: number;
  armor_penetration: number;
  magic_penetration: number;
  stamina_regen: number;
  mana_regen: number;
}

export interface SubArchetypeSpec {
  id: string;
  name: string;
  stat_multipliers: Partial<ECATAttributeTensor>;
}

export interface ArchetypeSpec {
  id: string;
  name: string;
  class_role: string;
  armor_type: ArmorType;
  corrected_policy_enabled: boolean;
  base_attributes: ECATAttributeTensor;
  default_commands: string[];
  sub_archetypes: SubArchetypeSpec[];
}

export interface CharacterProfile314 {
  profileId: string;
  characterName: string;
  arabicTitle: string;
  archetypeClass: string;
  mappedCoreArchetype: string;
  livedExperienceOrigin: string;
  commandsRuleStack: string;
  tacticalFunction: string;
  spriteAnimationForm: string;
  statWeightPi: number;
  armorWeightPi: number;
  weaponWeightPi: number;
  skillName: string;
  skillAbilityName: string;
  vfxType: string;
  skillTone: string;
  skillDefense: string;
  canonicalMetricsOfSkill: string;
  baseHp: number;
  baseAttack: number;
  baseDefense: number;
  baseRangeTiles: number;
  moveSpeedPi: number;
}

export interface GambitRuleClause {
  verb: CommandVerb;
  targetExpr: string;
  params: Record<string, string>;
}

export interface Clash11VectorOutput {
  attackerId: string;
  defenderId: string;
  initiativeRadPerSec: number;
  rawWeightedOffense: number;
  defenderArmorMitigation: number;
  netDamagePerHit: number;
  turnsToWin: number;
  lanchesterAsabiyyahWinProbPct: number;
  activeVfx: string;
  commandsStack: string;
}

export interface ICommandLoader<TInput, TOutput> {
  readonly loaderId: string;
  load(input: TInput): TOutput;
}
