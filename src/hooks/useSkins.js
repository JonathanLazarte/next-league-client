import { useQuery } from "@tanstack/react-query";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const fetchSkins = async () => {
  const res = await fetch(`${API_URL}api/v1/data/skin`);
  return res.json();
};

export default function SkinsData() {
  const { data: skinsData, isLoadingSkinsData } = useQuery({
    queryKey: ["skins"],
    queryFn: fetchSkins,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  return { skinsData, isLoadingSkinsData };
}
