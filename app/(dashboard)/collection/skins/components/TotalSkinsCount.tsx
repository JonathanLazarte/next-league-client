import { memo } from "react";

const TotalSkinsCount = memo(function TotalSkinsCount({ count = 0 }: { count: number }) {
  return (
    <div className="total-skins-count">
      <div className="total-skins-info">
        <div className="amount">{count}</div>
        <div className="description">TOTAL SKINS OWNED</div>
      </div>

      <svg className="hextech-rounded-border" id="Capa_2" data-name="Capa 2" xmlns="http://www.w3.org/2000/svg" viewBox="-1 0 184 193.99">
        <g id="Capa_2-2" data-name="Capa 2">
          <g id="Meters">
            <g>
              <path d="M96.78,19.21l-5.78,5.78-5.78-5.78C41.53,22.19,7,58.55,7,102.99s37.61,84,84,84,84-37.61,84-84S140.47,22.18,96.78,19.21Z"/>
              <path className="path-2" stroke="var(--gold-six)" d="M103.19,12.81l-12.19,12.19-12.19-12.19C34.32,18.76,0,56.87,0,102.99c0,50.26,40.74,91,91,91s91-40.74,91-91c0-46.13-34.32-84.23-78.81-90.19h0Z"/>
              <rect x="87.46" y="1.46" width="7.07" height="7.07" transform="translate(23.12 65.81) rotate(-45)"/>
            </g>
          </g>
        </g>
      </svg>

    </div>
  );
});

export default TotalSkinsCount;
