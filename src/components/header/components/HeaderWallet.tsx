import { useUser } from '@/hooks/useUser'
export default function HeaderWallet({ trigger }) {
  const { RP, BE } = useUser()

  return (<>
    <div className="account-coins">
      <div {...trigger({ content: `${RP.toLocaleString('es-AR')} RP` })} className="riot-points">
        <img src="/general/RP_icon.png" alt="RP" />
        <div className="RP">
          {RP > 10000
            ? `${Math.floor(RP / 1000)} K`
            : RP || 0}
        </div>
        <div className="header-buy-rp-button">
          <div className="buy-rp-icon">
            +
          </div>
        </div>
      </div>
      <div {...trigger({ content: `${BE.toLocaleString('es-AR')} Blue essences` })} className="blue-essences">
        <img src="/general/BE_icon.png" alt="BE" />
        <div className="BE">
          {BE > 10000
            ? `${Math.floor(BE / 1000)} K`
            : BE || 0}
        </div>
      </div>
    </div>
  </>)
}
