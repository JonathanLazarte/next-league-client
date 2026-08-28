import { RARITY_LEVELS } from "@/utils/constants";

export default function RaritySkinsCount({ trigger, userSkinsFull }) {
  const raritys = RARITY_LEVELS;

  const countRarity = userSkinsFull
    ? userSkinsFull?.reduce((acc, skin) => {
        acc[skin.rarity] = (acc[skin.rarity] || 0) + 1;
        return acc;
      }, {})
    : raritys.reduce((acc, rarity) => {
        acc[rarity] = 0;
        return acc;
      }, {});

  return <div className="rarity-icons-container">

      <div className="rarity-icons">
        {raritys?.map((rarity) => (
          <div key={rarity} className="rarity-item" {...trigger({content: rarity})}>
            <img
              className="rarity-image"
              src={`/collection/rarity-gem-icons/${rarity === 'Signature' ? 'transcendent' : rarity === 'Hall' ? 'exalted' : rarity.toLowerCase()}.png`}
              alt={`Rareza ${rarity}`}
              loading="lazy"
            />
            {countRarity[rarity] ? countRarity[rarity] : "0"}
          </div>
        ))}
      </div>

      <div className="legacy-chromas-icons">
        <div className="legacy-item" {...trigger({ content: "Legacy" })}>
          <img
            className="rariry-image w-7"
            src="/raritys/Legacy.png"
            alt="Legacy"
            loading="lazy"
          />
          {countRarity["NoRarity"] || "0"}
        </div>

        <div className="chroma-item" {...trigger({content: "Chromas"})}>
          <img
            className="rariry-image w-7"
            src="/raritys/Chroma.png"
            alt="Chroma"
            loading="lazy"
            />
            0
        </div>

    </div>

    <svg
      className="skins-hextech-border absolute"
      id="Capa_2"
      data-name="Capa 2"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 170.3 192.39"
    >
      <g id="Containers">
        <g>
          <g>
            <path
              className="cls-1"
              d="M.5,6.47c3.31,0,6-2.67,6-5.97h157.3c0,3.3,2.69,5.97,6,5.97"
            />
            <path
              className="cls-1"
              d="M11.36,188.16c-1.55-4.48-5.82-7.71-10.86-7.71V12.19c5.04,0,9.31-3.22,10.86-7.71"
            />
            <path
              className="cls-1"
              d="M169.8,185.92c-3.31,0-6,2.67-6,5.97H6.5c0-3.3-2.69-5.97-6-5.97"
            />
            <path
              className="cls-1"
              d="M158.95,4.23c1.55,4.48,5.82,7.71,10.86,7.71v168.26c-5.04,0-9.31,3.22-10.86,7.71"
            />
          </g>
        </g>
      </g>
    </svg>

  </div>
}
