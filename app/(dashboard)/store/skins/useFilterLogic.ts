import { useState, useMemo } from 'react'

export function useFilterLogic({ items, ownedItems, ownedChampions, categoryChecked, setCategoryChecked, }) {

  const [searchKeys, setSearchKeys] = useState("");
  const [inCollection, setInCollection] = useState(false);
  const [championInCollection, setChampionInCollection] = useState(false);
  const [sortedBy, setSortedBy] = useState("");

  // Filtro + ordenamiento
  const filteredItems = useMemo(() => {
    let result = items ? [...items] : [];

    result = [...result].filter((skin) => {
      const showInCollectionFilter = inCollection
        ? true // devuelve todas las skins, incluyendo las adquiridas por el usuario
        : !ownedItems.find((s) => s.id === skin.id);
      const championInCollectionFilter = !championInCollection
        ? true // solo devuelve las skins relacionadas con los campeones adquiridos por el usuario
        : ownedChampions.find((c) => c.id === skin.champion);

      return showInCollectionFilter && championInCollectionFilter; // si un filtro esta desactivado simplemente devolverá true por lo tanto solo se evaluara el filtro activado
    });

    // Búsqueda
    if (searchKeys) {
      const query = searchKeys.toLowerCase();
      result = result.filter((item) =>
        item.name?.toLowerCase().includes(query),
      );
    }

    // Filtros de rareza / disponibilidad limitada
    const activeFilters = Object.keys(categoryChecked).filter(
      // se detectan los filtros de rareza con checkbox marcados
      (key) => categoryChecked[key],
    );

    if (activeFilters.length > 0) {
      // se aplican los filtros segun los filtros de rareza activados
      result = result.filter((item) => {
        return activeFilters.every((filter) => {
          if (filter === "Limited") {
            return item.availability === "Limited";
          }
          return item.rarity === filter;
        });
      });
    } else {
      // Si no está marcado "Limited", ocultar los de disponibilidad limitada
      result = result.filter(
        (item) =>
          item.availability !== "Limited" &&
          item.value !== "Special" &&
          item.value !== "Battle Pass" &&
          item.value !== "Sanctum",
      );
    }

    // Ordenamiento
    if (sortedBy) {
      result.sort((a, b) => {
        switch (sortedBy) {
          case "PriceRpDescend":
            return Number(b.value) - Number(a.value);
          case "PriceRpAscend":
            return Number(a.value) - Number(b.value);
          case "alphabetically descend":
            return a.name.localeCompare(b.name);
          case "alphabetically ascend":
            return b.name.localeCompare(a.name);
          case "ReleaseAscend":
            return 0; // ya vienen ordenados por defecto (más nuevos primero)
          default:
            return 0;
        }
      });
    }

    return result;
  }, [
    items,
    searchKeys,
    inCollection,
    championInCollection,
    categoryChecked,
    sortedBy,
    ownedItems,
    ownedChampions,
  ]);

  return {
    filteredItems,
    filters: {
      searchKeys,
      setSearchKeys,
      sortedBy,
      setSortedBy,
      inCollection,
      setInCollection,
      categoryChecked,
      setCategoryChecked,
      championInCollection,
      setChampionInCollection
    }
  }
}
