import {
  STORE_SORT_OPTIONS,
  FILTER_OPTIONS_BY_GROUPING,
  GROUPING_OPTIONS_CHAMPION,
  CHAMPION_SORT_OPTIONS,
  CHAMPION_GROUP_OPTIONS
} from "@/utils/constants"

export type UserState = "online" | "offline" | "ingame" | "away" | string
export type Section = "league" | "play" | "store" | "collection" | "crafting"
export type Queue = "solo_duo" | "flex" | "aram" | null | "aram_mayhem" | "tutorial" | "swiftplay"
export type QueueStatus = "idle" | "found" | "searching" | "acepted"


export type StoreSortOptions = typeof STORE_SORT_OPTIONS

export type SkinSortOptions = typeof FILTER_OPTIONS_BY_GROUPING[keyof typeof FILTER_OPTIONS_BY_GROUPING]

export type ChampionSortOptions = typeof CHAMPION_SORT_OPTIONS

export type ChampionGroupOptions = typeof CHAMPION_GROUP_OPTIONS

export type SortOptions = SkinSortOptions | ChampionSortOptions | StoreSortOptions

export type SortOptionsValues = SortOptions[number]["value"]

export type SkinGroupingOptionsValues = keyof typeof FILTER_OPTIONS_BY_GROUPING

export type ChampionGroupingOptionsValues = typeof GROUPING_OPTIONS_CHAMPION[number]["value"]



export interface SkinRaritys {
  Limited: boolean;
  Legendary: boolean;
  Ultimate: boolean;
}
export interface ChampionRoles {
  Assassin: boolean;
  Fighter: boolean;
  Mage: boolean;
  Tank: boolean;
  Marksman: boolean;
  Support: boolean;
}
export type FilterCategories = SkinRaritys | ChampionRoles;
