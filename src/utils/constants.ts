/**
 * Constantes globales de la aplicación
 */
export const RESOURCES_URL = "http://d2l6vvcxr1n0o0.cloudfront.net";
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

export const GAME_DATA = {
  PVP: [
    {
      name: "summoner rift",
      hoverImg: "sr-icon-hover.png",
      enabledImg: "sr-icon-active.png",
      disabledImg: "sr-icon-default.png",
      subTitle: "5v5",
      title: "SUMMONER'S RIFT",
      queues: [
        {
          name: "swiftplay",
          description:
            "Authentic SR gameplay in a much shorter match. Play with friends of different skill levels without the fear of falling too far behind.",
          room_title: "SR · Swiftplay · ",
        },
        {
          name: "ranked_solo_duo",
          description:
            "Crush your lane, dive into epic five-on-five team fights, and destroy the enemy nexus in League`s premier competitive mode.",
          room_title: "SR · Ranked Solo/Duo · Draft",
        },
        {
          name: "ranked_flex",
          description:
            "Crush your lane, dive into epic five-on-five team fights, and destroy the enemy nexus in League`s premier competitive mode.",
          room_title: "SR · Ranked Flex · Draft",
        },
      ],
    },
    {
      name: "aram",
      hoverImg: "aram-hover.png",
      enabledImg: "aram-active.png",
      disabledImg: "aram-default.png",
      subTitle: "5v5",
      title: "ARAM",
      queues: [
        {
          name: "aram_mayhem",
          description:
            "Ten randomly-selected champions assemble on a narrow bridge. Cross to the other side and destroy everything in your path.",
          room_title: "RNG · ARAM: MAYHEM · RANDOM",
        },
        {
          name: "aram",
          description:
            "Ten randomly-selected champions assemble on a narrow bridge. Cross to the other side and destroy everything in your path.",
          room_title: "RNG · ARAM · RANDOM",
        },
      ],
    },
  ],
  CO_OP_VS_AI: [
    {
      name: "co-op vs ai",
      hoverImg: "sr-icon-hover.png",
      enabledImg: "sr-icon-active.png",
      disabledImg: "sr-icon-default.png",
      subTitle: "5v5",
      title: "SUMMONER'S RIFT",
      queues: [
        {
          name: "intro",
          description: "Team up with other players against a team of boths and destroy the enemy Nexus.",
          room_title: "SR · Intro · Blind",
        },
        {
          name: "beginner",
          description: "Team up with other players against a team of boths and destroy the enemy Nexus.",
          room_title: "SR · Begginer · Blind",
        },
        {
          name: "intermediate",
          description: "Team up with other players against a team of boths and destroy the enemy Nexus.",
          room_title: "SR · Intermediate · Blind",
        },
      ],
    },
  ],
};
