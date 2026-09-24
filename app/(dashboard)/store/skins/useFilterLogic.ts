import { Skin } from '@/types/skin';
import { SortOptionsValues } from '@/types/ui';
import { useState, useMemo, Dispatch } from 'react'

interface OwnedItem {
  id: string
}

interface FilterCategories {
  Limited: boolean;
  Legendary: boolean;
  Ultimate: boolean;
}

interface UserFilterLogicProps {
  items: Skin[];
  ownedItems: OwnedItem[];
  ownedChampions: OwnedItem[];
  categoryChecked: Record<string, any>;
  setCategoryChecked: Dispatch<React.SetStateAction<Record<string, any>>>;
}

export function useFilterLogic({
  items,
  ownedItems,
  ownedChampions,
  categoryChecked,
  setCategoryChecked,
}: UserFilterLogicProps) {

  const [searchKeys, setSearchKeys] = useState("");
  const [inCollection, setInCollection] = useState(false);
  const [championInCollection, setChampionInCollection] = useState(false);
  const [sortedBy, setSortedBy] = useState<SortOptionsValues | null>(null);

  // Filtro + ordenamiento
  const filteredItems = useMemo((): Skin[] => {
    let result = items ? [...items] : [];

    result = [...result].filter((skin: Skin) => {
      const showInCollectionFilter = inCollection
        ? true // devuelve todas las skins, incluyendo las adquiridas por el usuario
        : !ownedItems.find(( s: OwnedItem) => s.id === skin.id);
      const championInCollectionFilter = !championInCollection
        ? true // solo devuelve las skins relacionadas con los campeones adquiridos por el usuario
        : ownedChampions.find(( c: OwnedItem) => c.id === skin.champion);

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
    const activeFilters = (Object.keys(categoryChecked) as Array<keyof FilterCategories>).filter(
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
          case "AlphabeticallyDescend":
            return a.name.localeCompare(b.name);
          case "AlphabeticallyAscend":
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
