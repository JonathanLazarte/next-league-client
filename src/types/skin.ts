export interface Chroma {
  id: number;
  name: string;
  chromaPath: string;
  colors: string[];
}


export type SkinRarity =
  | 'NoRarity'
  | 'Standard'
  | 'Epic'
  | 'Legendary'
  | 'Ultimate'
  | 'Mythic'
  | 'Transcendent';

export type SkinValues = number | "Special" | "Battle Pass" | "Sanctum"

export interface Skin {
    id: string,
    num: number,
    name: string,
    chromas: boolean,
    img: string,
    champion: string,
    rarity: SkinRarity,
    value: SkinValues,
    release: string,
    set: string[],
    availability: string,
    purchaseDate: string
}

export interface UserSkin {
  id: string
}
