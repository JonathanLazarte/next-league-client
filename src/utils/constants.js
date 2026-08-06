/**
 * Constantes globales de la aplicación
 */

export const RARITY_LEVELS = [
  "Signature",
  "Hall",
  "Ultimate",
  "Mythic",
  "Legendary",
  "Epic",
];

export const GROUP_MODES = {
  COLLECTION: "collection",
  ALL: "all",
  CHAMPION: "champion",
  SET: "set",
  LEVEL: "level",
};

export const SORT_OPTIONS = {
  PURCHASE_DATE: "purchaseDate",
  RELEASE_DATE: "releaseDate",
  ALPHABETICAL: "alphabetical",
  MASTERY: "mastery",
  MOST_OWNED: "mostOwned",
  RARITY: "rarity",
};

export const HOVER_DELAYS = {
  INITIAL: 250,
  FAST: 0,
  RESET_AFTER: 500,
};

export const API_ENDPOINTS = {
  SKINS: "api/v1/data/skin",
  DATA: "api/v1/data",
  USERS: "api/v1/user",
};

export const SECTION_LABELS = {
  collection: "Collection",
  store: "Store",
  league: "LEAGUE"
}
