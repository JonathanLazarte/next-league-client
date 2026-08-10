import { BACKGROUND_URLS } from '@/utils/constants'
import { useUserInterface } from "@/hooks/useUserInterface";
import useLoadingDelay from "@/hooks/useLoadingDelay";

export default function BackgroundEngine() {
  const { actualSection, isNavigating, queue } = useUserInterface();
  const showLoading = useLoadingDelay(isNavigating)
  const isInQueue = queue !== null;

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
