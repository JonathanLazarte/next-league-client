import { memo } from "react";

const TotalSkinsCount = memo(function TotalSkinsCount({ count = 0 }) {
  return (
    <div className="total-skins-count">
      <div className="total-skins-info">
        <div className="amount">{count}</div>
        <div className="description">TOTAL SKINS OWNED</div>
      </div>
    </div>
  );
});

export default TotalSkinsCount;
