import { useMemo, useState } from 'react'

export default function useFilterLogic({ itemCategoryChecked, items, adquiredItems }) {

  const [searchKeys, setSearchKeys] = useState("");
  const [inCollection, setInCollection] = useState(false);
  const [sortedBy, setSortedBy] = useState("");


  const filteredItems = useMemo(() => {
    const activeRoles = Object.keys(itemCategoryChecked).filter(
      (role) => itemCategoryChecked[role],
    );

    let result = items?.filter((champion) => {
      const matchesSearch = searchKeys
        ? champion.name.toLowerCase().startsWith(searchKeys.toLowerCase())
        : true;

      const matchesRole =
        activeRoles.length > 0
          ? activeRoles.every((role) => champion.tags.includes(role))
          : true;

      const notInCollection = inCollection
        ? true
        : !adquiredItems.some((uc) => uc.id === champion.id);

      return matchesSearch && matchesRole && notInCollection;
    });

    // Ordenamiento
    if (sortedBy === "AlphabeticallyDescend") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }
    if (sortedBy === "AlphabeticallyAscend") {
      result.sort((a, b) => b.name.localeCompare(a.name));
    }
    if (sortedBy === "PriceRpDescend") {
      result.sort((a, b) => parseFloat(b.price.rp) - parseFloat(a.price.rp));
    }
    if (sortedBy === "PriceRpAscend") {
      result.sort((a, b) => parseFloat(a.price.rp) - parseFloat(b.price.rp));
    }
    if (sortedBy === "PriceBeDescend") {
      result.sort((a, b) => parseFloat(b.price.be) - parseFloat(a.price.be));
    }
    if (sortedBy === "PriceBeAscend") {
      result.sort((a, b) => parseFloat(a.price.be) - parseFloat(b.price.be));
    }
    if (sortedBy === "ReleaseAscend") {
      result = result.reverse();
    }

    return result;
  }, [
    itemCategoryChecked,
    items,
    adquiredItems,
    searchKeys,
    inCollection,
    sortedBy
  ]);

  return {
    filteredItems,
    filters: {
      sortedBy,
      setSortedBy,
      inCollection,
      setInCollection,
      searchKeys,
      setSearchKeys
    }
  }
}
