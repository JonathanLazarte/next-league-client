import { useQuery } from "@tanstack/react-query";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchChampions = async () => {
  const res = await fetch(`${API_URL}api/v1/data/champion`);
  const data = await res.json();
  const champions = Object.values(data);
  return champions;
};

export default function useChampions() {
  const { data: championsData } = useQuery({
    queryKey: ["champions"],
    queryFn: fetchChampions,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  return { championsData };
}
