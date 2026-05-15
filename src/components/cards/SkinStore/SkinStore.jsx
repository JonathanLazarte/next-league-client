import Image from 'next/image'
import { useDispatch } from 'react-redux'
import { openPurchaseModal } from '@/redux/slices/purchaseSlice.js'
import './SkinStore.css'


export default function SkinStoreItem({ item : skin }){
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(openPurchaseModal({ itemId: skin.id, type: 'skin'}))
  }
  return(
                                    <article
                                key={skin.id}
                                className="skin-store-item"
                                onClick={() => handleClick(skin)}
                              >
                                <Image
                                  src={`/tiles/${skin.img}`}
                                  alt={skin.name}
                                  fill
                                  sizes="23vw"
                                  className="pokemon"
                                  style={{ objectFit: 'cover' }}
                                />
                                <div className="product-info">
                                  <h4 className="card-name">{skin.name}</h4>
                                  <div className="price">
                                    <div className="rp-price">
                                      {skin.availability !== 'Limited' && (
                                        <img src="/general/RP_icon.png" alt="RP" className="rp-icon-card" />
                                      )}
                                      <span className="price-number">{skin.value}</span>
                                    </div>
                                  </div>
                                </div>
                              </article>
  )
}