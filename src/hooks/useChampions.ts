import { useQuery } from "@tanstack/react-query";
import { Champion } from '@/types/champion'

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchChampions = async (): Promise<Champion[]> => {
  const res = await fetch(`${API_URL}api/v1/data/champion`);
  const data: Record<string, Champion> = await res.json();
  const champions = Object.values(data);
  return champions;
};

export default function useChampions() {
  const { data: championsData, isLoading } = useQuery({
    queryKey: ["champions"],
    queryFn: fetchChampions,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  return { championsData, isLoadingChampionsData: isLoading, isFetchingChampionsData: isLoading };
}
