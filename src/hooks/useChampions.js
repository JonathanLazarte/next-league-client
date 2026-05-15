import { useQuery } from "@tanstack/react-query";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchChampions = async () => {
  const res = await fetch(`${API_URL}pokemons/data/getchamps`);
  const data = await res.json();
  const champions = Object.values(data);
  return champions;
  /*const adquiredChamps = champs.filter(c => userChampions.some(uc => uc.id === c.id))
          setRenderData({ 'Todos': adquiredChamps}); */
};

export default function useChampions() {
  const { data: championsData, isLoadingChampionsData } = useQuery({
    queryKey: ["champions"],
    queryFn: fetchChampions,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  return { championsData, isLoadingChampionsData };
}
