// src/types/champion.ts
export type ChampionTag =
  | "Assassin"
  | "Fighter"
  | "Mage"
  | "Marksman"
  | "Support"
  | "Tank";

export interface Champion {
  id: string;
  key: string;
  name: string;
  title: string;
  image: ImageData;
  skins: Skin[];
  lore: string;
  blurb: string;
  allytips: string[];
  enemytips: string[];
  tags: ChampionTag[];
  partype: string;
  info: ChampionInfo;
  stats: ChampionStats;
  spells: Spell[];
  passive: Passive;
  recommended: unknown[];
}

export interface ImageData {
  full: string;
  sprite: string;
  group: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Skin {
  id: string;
  num: number;
  name: string;
  chromas: boolean;
}

export interface ChampionInfo {
  attack: number;
  defense: number;
  magic: number;
  difficulty: number;
}

export interface ChampionStats {
  hp: number;
  hpperlevel: number;
  mp: number;
  mpperlevel: number;
  movespeed: number;
  armor: number;
  armorperlevel: number;
  spellblock: number;
  spellblockperlevel: number;
  attackrange: number;
  hpregen: number;
  hpregenperlevel: number;
  mpregen: number;
  mpregenperlevel: number;
  crit: number;
  critperlevel: number;
  attackdamage: number;
  attackdamageperlevel: number;
  attackspeedperlevel: number;
  attackspeed: number;
}

export interface Spell {
  id: string;
  name: string;
  description: string;
  tooltip: string;
  leveltip: LevelTip;
  maxrank: number;
  cooldown: number[];
  cooldownBurn: string;
  cost: number[];
  costBurn: string;
  datavalues: Record<string, unknown>;
  effect: (number[] | null)[];
  effectBurn: (string | null)[];
  vars: SpellVar[];
  costType: string;
  maxammo: string;
  range: number[];
  rangeBurn: string;
  image: ImageData;
  resource: string;
}

export interface LevelTip {
  label: string[];
  effect: string[];
}

export interface SpellVar {
  link?: string;
  coeff?: number | number[];
  key?: string;
}

export interface Passive {
  name: string;
  description: string;
  image: ImageData;
}
