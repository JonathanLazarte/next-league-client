import Image from 'next/image'
import { usePurchase } from '@/hooks/usePurchase'
import './Skin.css'
import { RESOURCES_URL } from '@/utils/constants';
import { Skin } from '@/types/skin'


export default function SkinStoreItem({ item: skin, owned }: { item: Skin, owned?: boolean }) {
  const { openPurchaseModal } = usePurchase();


  const handleClick = () => {
    if (owned) return;
    openPurchaseModal({
      id: skin.id,
      type: 'skin',
      name: skin.name,
      img: `${RESOURCES_URL}/splash/${skin.img}`,
      subtitle: "Elige este nuevo estilo para tu campeón!",
      value: {
        rp: skin.value,
      }
    })
  }

  return (
    <article
      key={skin.id}
      className="store-champion-item"
      onClick={() => handleClick()}
    >
      <Image
        src={`${RESOURCES_URL}/tiles/${skin.img}`}
        alt={skin.name}
        fill
        sizes="23rem"
        className="store-champion-image"
        style={{ objectFit: 'cover' }}
      />
      <div className="product-info">
        <h4 className="card-name">{skin.name}</h4>
        {!owned ? <div className="price">
          <div className="rp-price">
            {skin.availability !== 'Limited' && (
              <div className="currency-icon-wrapper">
                <svg className="rp-icon-card" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M8.63343 2.25848L6.5001 0.600098L4.36676 2.25848V8.25781L6.5001 9.7405L8.63343 8.25781V2.25848ZM12.0468 6.1152L12.9001 5.49383L10.3401 3.11553V9.11486L7.35343 11.2575V13.4001L12.9001 9.68479L12.0468 8.68634V6.1152ZM2.6601 3.11553L0.100098 5.49383L0.953431 6.1152V8.68634L0.100098 9.68479L5.64676 13.4001V11.2575L2.6601 9.11486V3.11553Z" />
                </svg>
              </div>
            )}
            <span className="price-number">{skin.value}</span>
          </div>
        </div> : (
          <div className="owned-status-wrapper">
            <span className="owned-status-badge">owned</span>
          </div>
        )}
      </div>
    </article>
  )
}
