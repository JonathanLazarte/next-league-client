import { memo } from "react";

const EmptySkinsState = memo(function EmptySkinsState({ loading, groupedSkinsCount, hasSkinsData }) {
    if (loading || groupedSkinsCount > 0 || !hasSkinsData) return null;

    return (
        <span className="apologize-message">
            We are sorry, no collectible matches your search criteria
        </span>
    );
});

export default EmptySkinsState;
