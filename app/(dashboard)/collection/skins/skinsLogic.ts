interface SkinsLogicProps {
  groupedBy: string,
  showNotObtained: boolean,
  skins: string[],
  userSkinsFull: string[]
  sortedBy: string,
  deferredSearch: string,
  userSkins: string[]
}

interface Skin {
  purchaseDate: number
  release: string
  champion: string | string[],
  rarity: string,

}

export default function skinsLogic({
  groupedBy,
  showNotObtained,
  skins,
  userSkinsFull,
  sortedBy,
  deferredSearch,
  userSkins
}: SkinsLogicProps) {

  function groupByAcquisitionYear(skins: Skin[]) {
    return Object.entries(
      skins?.reduce((acc: Record<number, Skin[]>, skin: Skin) => {
        const year = new Date(skin.purchaseDate).getFullYear();
        acc[year] = acc[year] || [];
        acc[year].push(skin);
        return acc;
      }, {} as Record<number, Skin[]>),
    ).sort(([a], [b]) => Number(b) - Number(a));
  }

  function groupByReleaseYear(skins) {
    return Object.entries(
      skins.reduce((acc, skin) => {
        const year = new Date(skin.release).getFullYear();
        acc[year] = acc[year] || [];
        acc[year].push(skin);
        return acc;
      }, {}),
    ).sort(([a], [b]) => b - a);
  }

  function groupByChampion(skins) {
    return Object.entries(
      skins.reduce((acc, skin) => {
        acc[skin.champion] = acc[skin.champion] || [];
        acc[skin.champion].push(skin);
        return acc;
      }, {}),
    ).sort(([a], [b]) => a.localeCompare(b));
  }

  function groupBySkinline(skins) {
    return Object.entries(
      skins.reduce((acc, skin) => {
        acc[skin.set[0]] = acc[skin.set[0]] || [];
        acc[skin.set[0]].push(skin);
        return acc;
      }, {}),
    ).sort(([a], [b]) => a.localeCompare(b));
  }

  function groupByRarity(skins) {
    return Object.entries(
      skins.reduce((acc, skin) => {
        acc[skin.rarity] = acc[skin.rarity] || [];
        acc[skin.rarity].push(skin);
        return acc;
      }, {}),
    ).sort(([a], [b]) => a.localeCompare(b));
  }

  function groupByChampionInitial(skins) {
    const grouped = skins.reduce((acc, skin) => {
      const initial = (skin.champion?.[0] || "#").toUpperCase();
      (acc[initial] ||= []).push(skin);
      return acc;
    }, {});
    // siempre devolver array ordenado por inicial
    return Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b));
  }

  function getGroupedSkins(mode, showNotObtained, allSkins, userSkins) {
    // primero agrupamos SOLO lo del usuario
    let groupedUser;
    switch (mode) {
      case "collection":
        if (sortedBy === "releaseDate") {
          groupedUser = groupByReleaseYear(userSkins);
        } else if (sortedBy === "alphabetical") {
          groupedUser = groupByChampionInitial(userSkins);
        } else {
          groupedUser = groupByAcquisitionYear(userSkins);
        }
        break;
      case "all":
        if (sortedBy === "alphabetical") {
          groupedUser = groupByChampionInitial(userSkins);
        } else {
          groupedUser = groupByReleaseYear(userSkins);
        }
        break;
      case "champion":
        groupedUser = groupByChampion(userSkins);
        break;
      case "set":
        groupedUser = groupBySkinline(userSkins);
        break;
      case "level":
        groupedUser = groupByRarity(userSkins);
        break;
      default:
        groupedUser = [];
    }

    // si no hay que mostrar los no obtenidos → listo
    if (!showNotObtained || mode === "") {
      return groupedUser;
    }

    // si hay que mostrar también los no obtenidos
    // eslint-disable-next-line no-undef
    const obtainedIds = new Set(userSkins?.map((s) => s.id));
    const notObtained = allSkins.filter((s) => !obtainedIds.has(s.id));

    let groupedNotObtained;
    switch (mode) {
      case "all":
        if (sortedBy === "alphabetical") {
          groupedNotObtained = groupByChampionInitial(notObtained);
        } else {
          groupedNotObtained = groupByReleaseYear(notObtained);
        }
        break;
      case "champion":
        groupedNotObtained = groupByChampion(notObtained);
        break;
      case "set":
        groupedNotObtained = groupBySkinline(notObtained);
        break;
      case "level":
        groupedNotObtained = groupByRarity(notObtained);
        break;
      default:
        groupedNotObtained = [];
    }

    // combinamos: primero obtenidos, luego no obtenidos
    const combined = [];
    // eslint-disable-next-line no-undef
    const mapNotObtained = new Map(groupedNotObtained);
    for (const [section, skins] of groupedUser) {
      const extras = mapNotObtained.get(section) || [];
      combined.push([section, [...skins, ...extras]]);
      mapNotObtained.delete(section);
    }
    for (const [section, skins] of mapNotObtained) {
      combined.push([section, skins]);
    }
    return combined;
  }

  function applySectionSorting(grouped, sortedBy, userSkins) {
    if (!grouped) return [];
    let sortedGrouped = [...grouped];
    switch (sortedBy) {
      case "purchaseDate":
        sortedGrouped.sort(([a], [b]) => Number(b) - Number(a));
        break;
      case "releaseDate":
        sortedGrouped.sort(([a], [b]) => Number(b) - Number(a));
        break;
      case "alphabetical":
        sortedGrouped.sort(([a], [b]) => a.localeCompare(b));
        break;
      case "mastery":
        sortedGrouped.sort(([, skinsA], [, skinsB]) => {
          const masteryA = skinsA.reduce(
            (sum, s) => sum + (s.championMastery || 0),
            0,
          );
          const masteryB = skinsB.reduce(
            (sum, s) => sum + (s.championMastery || 0),
            0,
          );
          return masteryB - masteryA;
        });
        break;
      case "mostOwned": {
        // eslint-disable-next-line no-undef
        const obtainedIds = new Set(userSkins?.map((s) => s.id));
        sortedGrouped.sort(([, skinsA], [, skinsB]) => {
          const ownedA = skinsA.filter((s) => obtainedIds.has(s.id)).length;
          const ownedB = skinsB.filter((s) => obtainedIds.has(s.id)).length;
          return ownedB - ownedA;
        });
        break;
      }
      default:
        break;
    }
    return sortedGrouped;
  }

  const applySearchFilter = (groupedSections, searchKeys) => {
    if (!searchKeys) return groupedSections;

    const lower = searchKeys.toLowerCase();

    return groupedSections
      .map(([section, skins]) => {
        const filteredSkins = skins.filter((s) =>
          s.name?.toLowerCase().includes(lower),
        );
        return [section, filteredSkins];
      })
      .filter(([, skins]) => skins.length > 0);
  };

  const grouped = getGroupedSkins(
    groupedBy,
    showNotObtained,
    skins,
    userSkinsFull,
  );
  const sectionSorted = applySectionSorting(
    grouped,
    groupedBy,
    sortedBy,
    userSkins,
  );
  const searched = applySearchFilter(sectionSorted, deferredSearch);

  return applySearchFilter(searched);
}
