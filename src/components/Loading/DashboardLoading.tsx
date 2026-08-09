import Image from 'next/image'

export default function DashboardLoading() {
  return (
    <div
      className="dashboard-loading-screen flex items-center content-center justify-center w-screen min-h-screen"
    >
      <img style={{ width: "100%" }} src="/loading-golden.png"/>
      <svg id="Capa_2" className="hextech-loading-svg" data-name="Capa 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 769.62 776.17">
        <g id="Lines">
          <ellipse className="cls-1" cx="384.81" cy="388.09" rx="377.81" ry="381.09" />
        </g>
      </svg>
      <div className="text-center absolute">
        <Image
          className="lol-logo-image"
          src="/LOL_Icon_Rendered.png"
          width={240}
          height={240}
          alt="League of Legends logo"
        />
        <div className="loading-underlogo"> LOADING </div>
      </div>
    </div>
  )
}
