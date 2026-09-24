import { useState, useEffect, useMemo, useDeferredValue } from "react";
import { useUserSkins } from "@/hooks/useUserSkins";
import useSkins from "@/hooks/useSkins";
import { FILTER_OPTIONS_BY_GROUPING } from "@/utils/constants";
import applyAllLogic from "../skinsLogic";
import { Skin } from "@/types/skin";
import { SkinGroupingOptionsValues, SortOptionsValues } from "@/types/ui";

export function useSkinsFilter() {
    const { userSkins, loading: loadingUserSkins } = useUserSkins();
    const { skinsData, isLoading: loadingSkinsData } = useSkins();

    const [searchKeys, setSearchKeys] = useState<string | null>(null);
    const deferredSearch = useDeferredValue<string | null>(searchKeys);
    const [groupedBy, setGroupedBy] = useState<SkinGroupingOptionsValues | null>("collection");
    const [sortedBy, setSortedBy] = useState<SortOptionsValues | null>("purchaseDate");
    const [showNotObtained, setShowNotObtained] = useState(false);



    // Sincronizar orden por defecto cuando cambia la agrupación
    useEffect(() => {
        if(groupedBy === null) return setSortedBy("purchaseDate")
        const defaultOption = FILTER_OPTIONS_BY_GROUPING[groupedBy]?.[0]?.value;
        setSortedBy(defaultOption as SortOptionsValues);
    }, [groupedBy]);

    // Combinar información de skins del usuario con skins globales
    const userSkinsFull = useMemo(() => {
        if (!skinsData || !userSkins) return [];
        return userSkins
            .map((us) => {
                const respectiveSkinData = skinsData.find((skinData: Skin) => skinData.id === us.id);
                return respectiveSkinData
                    ? { ...respectiveSkinData, purchaseDate: us.purchaseDate }
                    : null;
            })
            .filter(Boolean)
            .reverse();
    }, [skinsData, userSkins]);

    // Aplicar lógica de agrupamiento/filtrado
    const groupedSkins = useMemo((): [string, Skin[]][] => {
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
    };
}
