import Image from 'next/image'
import { usePurchase } from '@/hooks/usePurchase'
import './Skin.css'
import { RESOURCES_URL } from '@/utils/constants';


export default function SkinStoreItem({ item : skin }){
  const { openPurchaseModal } = usePurchase();

  const handleClick = () => {
    openPurchaseModal({ itemId: skin.id, type: 'skin'})
  }
  return(
    <article
      key={skin.id}
      className="store-champion-item"
      onClick={() => handleClick(skin)}
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
        <div className="price">
          <div className="rp-price">
            {skin.availability !== 'Limited' && (
              <div className="currency-icon-wrapper">
                <img src="/general/RP_icon.png" alt="RP" className="rp-icon-card" />
              </div>
            )}
            <span className="price-number">{skin.value}</span>
          </div>
        </div>
      </div>
    </article>
  )
}
