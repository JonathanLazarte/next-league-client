import type { Skin, UserSkin } from '@/types/skin'


interface SkinsLogicProps {
  groupedBy: string | null,
  showNotObtained: boolean,
  skins: Skin[],
  userSkinsFull: Skin[]
  sortedBy: string | null,
  deferredSearch: string | null,
  userSkins: UserSkin[]
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

  function groupByReleaseYear(skins: Skin[]) {
    return Object.entries(
      skins.reduce((acc: Record<number, Skin[]>, skin: Skin) => {
        const year = new Date(skin.release).getFullYear();
        acc[year] = acc[year] || [];
        acc[year].push(skin);
        return acc;
      }, {} as Record<number, Skin[]>),
    ).sort(([a], [b]) => Number(b) - Number(a))
  }

  function groupByChampion(skins: Skin[]) {
    return Object.entries(
      skins.reduce((acc: Record<string, Skin[]>, skin: Skin) => {
        acc[skin.champion] = acc[skin.champion] || [];
        acc[skin.champion].push(skin);
        return acc;
      }, {}),
    ).sort(([a], [b]) => a.localeCompare(b));
  }

  function groupBySkinline(skins: Skin[]) {
    return Object.entries(
      skins.reduce((acc: Record<string, Skin[]>, skin) => {
        acc[skin.set[0]] = acc[skin.set[0]] || [];
        acc[skin.set[0]].push(skin);
        return acc;
      }, {}),
    ).sort(([a], [b]) => a.localeCompare(b));
  }

  function groupByRarity(skins: Skin[]) {
    return Object.entries(
      skins.reduce((acc: Record<string, Skin[]>, skin: Skin) => {
        acc[skin.rarity] = acc[skin.rarity] || [];
        acc[skin.rarity].push(skin);
        return acc;
      }, {}),
    ).sort(([a], [b]) => a.localeCompare(b));
  }

  function groupByChampionInitial(skins: Skin[]) {
    const grouped = skins.reduce((acc: Record<string, Skin[]>, skin: Skin) => {
      const initial = (skin.champion?.[0] || "#").toUpperCase();
      (acc[initial] ||= []).push(skin);
      return acc;
    }, {});
    // siempre devolver array ordenado por inicial
    return Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b));
  }

  function getGroupedSkins(mode: string | null, showNotObtained: boolean, allSkins: Skin[], userSkins: Skin[] ): [string, Skin[]][] {
    // primero agrupamos SOLO lo del usuario
    let groupedUser: [string, Skin[]][];

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
    const obtainedIds = new Set(userSkins?.map((s) => s.id));
    const notObtained = allSkins.filter((s) => !obtainedIds.has(s.id));

    let groupedNotObtained: [string, Skin[]][];
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
    const combined: [string, Skin[]][] = [];
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

  function applySectionSorting(grouped: [string, Skin[]][], sortedBy: string | null) {
    if (!grouped) return [];
    const sortedGrouped = [...grouped];
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
      default:
        break;
    }
    return sortedGrouped;
  }

  const applySearchFilter = (groupedSections: [string, Skin[]][], searchKeys: string | null) => {
    if (!searchKeys) return groupedSections;

    const lower = searchKeys.toLowerCase();

    return groupedSections
      .map(([section, skins]) => {
        const filteredSkins = skins.filter((s) =>
          s.name?.toLowerCase().includes(lower),
        );
        return [section, filteredSkins];
      })
      .filter(([, skins]) => skins.length > 0) as [string, Skin[]][];
  };

  const grouped = getGroupedSkins(
    groupedBy,
    showNotObtained,
    skins,
    userSkinsFull,
  );
  const sectionSorted = applySectionSorting(
    grouped,
    sortedBy,
  );
  const searched = applySearchFilter(sectionSorted, deferredSearch);

  return searched;
}
