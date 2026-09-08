import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/useDebounce";
import useChampions from "@/hooks/useChampions";
import { useUserChampions } from "@/hooks/useUserChampions";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchChampionsFull = async () => {
    const res = await fetch(`${API_URL}api/v1/data/champion-full`);
    return res.json();
};

export default function useChampionsFilter() {
    const [searchKeys, setSearchKeys] = useState();
    const searchKeysWithDelay = useDebounce(searchKeys, 50);
    const [inCollection, setInCollection] = useState(true);
    const [sortedBy, setSortedBy] = useState("");
    const [groupedBy, setGroupedBy] = useState("");
    const { loading, userChampions } = useUserChampions()
    const { championsData, isLoadingChampionsData } = useChampions();

    const { data: championFull } = useQuery({
        queryKey: ["champion-full"],
        queryFn: fetchChampionsFull,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
    });

    const groupChamps = (champs, allChamps) => {
        const byRole = champs?.reduce((acumulador, campeon) => {
            if (!acumulador[campeon.tags[0]]) {
                acumulador[campeon.tags[0]] = [];
            }
            acumulador[campeon.tags[0]].push(campeon);
            return acumulador;
        }, {});
        var byPossession = {
            "En colección": [],
            "No adquiridos": [],
        };
        allChamps?.map((campeon) => {
            userChampions.some((c) => c.id === campeon.id)
                ? byPossession["En colección"].push(campeon)
                : byPossession["No adquiridos"].push(campeon);
        });

        var all = {
            Todos: champs,
        };

        switch (groupedBy) {
            case "role":
                return byRole;
            case "possession":
                return byPossession;
            default:
                return champs.length > 0 ? all : {};
        }
    };
    const filterChampions = (
        allChamps,
        searchKeysWithDelay,
        inCollection,
    ) => {
        var championsFiltered = allChamps?.filter((champ) => {
            const inCollectionFilter = inCollection
                ? userChampions.some((uc) => uc.id == champ.id)
                : true;
            const keysFilter = searchKeysWithDelay
                ? champ.name.toLowerCase().startsWith(searchKeys.toLowerCase())
                : true;

            return inCollectionFilter && keysFilter;
        });
        championsFiltered = groupChamps(championsFiltered, allChamps);
        /*if(sortedBy === "alphabetically descend"){
                sectionFiltered.sort((a, b) => {
                const nameA = a.name.toUpperCase();
                const nameB = b.name.toUpperCase();
                return nameA.localeCompare(nameB);
            }) }
            if(sortedBy === "alphabetically ascend"){
                sectionFiltered.sort((a, b) => {
                const nameA = a.name.toUpperCase();
                const nameB = b.name.toUpperCase();
                return nameB.localeCompare(nameA);
            }) }*/
        return championsFiltered;
    };

    const groupedChampions = useMemo(() => {
        if (!championsData) return {};
        let result = filterChampions(
            championsData,
            searchKeysWithDelay,
            inCollection,
            sortedBy,
            groupedBy,
        );
        return result;
    }, [championsData, searchKeysWithDelay, inCollection, sortedBy, groupedBy]);

    return {
        groupedChampions,
        userChampions,
        isLoadingChampionsData,
        loading,
        championFull,
        championsData,
        filterState: {
            searchKeys,
            inCollection,
            sortedBy,
            groupedBy,
        },
        setters: {
            setSearchKeys,
            setInCollection,
            setSortedBy,
            setGroupedBy,
        }
    }
}