import { BACKGROUND_URLS } from '@/utils/constants'

export default function BackgroundEngine ({ isInQueue, actualSection, showLoading }) {
  return <div
    className={`background-engine ${isInQueue && actualSection === "play" ? "in-room" : null}`}
    style={{
      backgroundImage: showLoading
        ? "var(--blue-five)"
        : `url(${BACKGROUND_URLS[actualSection]})`,
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
    }}
  >
    <div
      style={{ visibility: actualSection === "play" ? "visible" : "hidden" }}
      className="bg-layer bg-lobby"
    ></div>
    <div
      style={{ visibility: actualSection === "play" ? "visible" : "hidden" }}
      className={`bg-layer bg-room`}
    ></div>
  </div>
}
