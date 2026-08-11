export default function EmptyChampionsState({
    loading,
    isLoadingChampionsData,
    championsData,
    groupedChampions,
}) {
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