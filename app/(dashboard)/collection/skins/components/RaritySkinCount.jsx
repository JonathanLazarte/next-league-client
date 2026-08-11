import { RARITY_LEVELS } from "@/utils/constants.js";

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
  </div>
}
