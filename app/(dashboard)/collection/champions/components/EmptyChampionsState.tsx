import { Champion } from "@/utils/types";

interface EmptyChampionsStateProps {
  loading: boolean;
  isLoadingChampionsData: boolean;
  championsData: Champion[];
  groupedChampions: Record<string, Champion[]>;
}
export default function EmptyChampionsState({
    loading,
    isLoadingChampionsData,
    championsData,
    groupedChampions,
}: EmptyChampionsStateProps) {
    return (
        !loading &&
            !isLoadingChampionsData &&
            championsData &&
            Object.keys(groupedChampions).length == 0 ? (
            <span className="apologize-message">
                We are sorry, no collectible matches your search criteria
            </span>
        ) : null
    )
}
