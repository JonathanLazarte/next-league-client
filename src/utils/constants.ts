/**
 * Constantes globales de la aplicación
 */
export const RESOURCES_URL = "https://next-league.s3.sa-east-1.amazonaws.com";
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

export const SECTIONS = {
  LEAGUE: {
    id: 'league',
    label: 'LEAGUE',
    type: 'text',
    path: '/league'
  },
  COLLECTION: {
    id: 'collection',
    label: 'Collection',
    icon: 'collection',
    type: 'icon',
    hasSeparator: true
  },
  STORE: {
    id: 'store',
    label: 'Store',
    icon: 'store',
    type: 'icon',
    hasSeparator: true
  }
};

export const LEFT_HEADER_TABS = [SECTIONS.LEAGUE];
export const RIGHT_HEADER_TABS = [SECTIONS.COLLECTION, SECTIONS.STORE];

export const BACKGROUND_URLS = {
  league: "/Jayce_34.webp",
  store: "/store_background.webp",
  collection: "/collection_background.webp",
}

export const FILTER_OPTIONS_BY_GROUPING = {
  collection: [
    { value: "purchaseDate", label: "Adquisition Date" },
    { value: "releaseDate", label: "Release Date" },
    { value: "alphabetical", label: "Alphabetical" },
  ],
  all: [
    { value: "releaseDate", label: "Release Date" },
    { value: "alphabetical", label: "Alphabetical" },
  ],
  champion: [
    { value: "mastery", label: "Mastery" },
    { value: "mostOwned", label: "Most Owned" },
    { value: "alphabetical", label: "Alphabetical" },
  ],
  set: [
    { value: "mostOwned", label: "Most Owned" },
    { value: "alphabetical", label: "Alphabetical" },
  ],
  level: [{ value: "rarity", label: "Rarity (By default)" }],
};
