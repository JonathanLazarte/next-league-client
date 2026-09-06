import { useState, useEffect, useMemo, useDeferredValue } from "react";
import { useUserSkins } from "@/hooks/useUserSkins";
import useSkins from "@/hooks/useSkins";
import { FILTER_OPTIONS_BY_GROUPING } from "@/utils/constants";
import applyAllLogic from "../skinsLogic";

export function useSkinsFilter() {
    const { userSkins, loading: loadingUserSkins } = useUserSkins();
    const { skinsData, isLoading: loadingSkinsData } = useSkins();

    const [searchKeys, setSearchKeys] = useState();
    const deferredSearch = useDeferredValue(searchKeys);
    const [groupedBy, setGroupedBy] = useState("collection");
    const [sortedBy, setSortedBy] = useState();
    const [showNotObtained, setShowNotObtained] = useState(false);

    // Sincronizar orden por defecto cuando cambia la agrupación
    useEffect(() => {
        const defaultOption = FILTER_OPTIONS_BY_GROUPING[groupedBy]?.[0]?.value;
        setSortedBy(defaultOption);
    }, [groupedBy]);

    // Combinar información de skins del usuario con skins globales
    const userSkinsFull = useMemo(() => {
        if (!skinsData || !userSkins) return [];
        return userSkins
            .map((us) => {
                const respectiveSkinData = skinsData.find((skinData) => skinData.id === us.id);
                return respectiveSkinData
                    ? { ...respectiveSkinData, purchaseDate: us.purchaseDate }
                    : null;
            })
            .filter(Boolean)
            .reverse();
    }, [skinsData, userSkins]);

    // Aplicar lógica de agrupamiento/filtrado
    const groupedSkins = useMemo(() => {
        return applyAllLogic({
            groupedBy,
            showNotObtained,
            skins: skinsData,
            userSkinsFull,
            sortedBy,
            deferredSearch,
            userSkins,
        });
    }, [groupedBy, showNotObtained, skinsData, userSkinsFull, sortedBy, deferredSearch, userSkins]);

    const isSkinInCollection = (id) => userSkins?.some((us) => us.id === id);

    return {
      skins: skinsData,
      userSkins,
      userSkinsFull,
      groupedSkins,
      loadingUserSkins,
      loadingSkinsData,
      filterState: {
          groupedBy,
          setGroupedBy,
          sortedBy,
          setSortedBy,
          showNotObtained,
          setShowNotObtained,
          setSearchKeys,
      },
      isSkinInCollection,
    };
}
