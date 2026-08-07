import { useSound } from '@/hooks/useSound.js'
import { useRouter } from 'next/navigation'
import { useUserInterface } from '@/hooks/useUserInterface';
/*import { color } from "framer-motion";*/
/*import { flushSync } from "react-dom";*/

export default function HeaderTab({ section, trigger, setSectionTabSeleceted, sectionTabSelected, actualSection }) {
  const { play } = useSound("/general/menu-click.mp3");
  const router = useRouter();
  const { isNavigating } = useUserInterface()
  /*const [isMouseUp, setIsMouseUp] = useState();*/

  const isPointerVisible = sectionTabSelected === section;

  const handleClick = (section) => {
    /*flushSync(() => {
      setIsMouseUp(true);
    });*/
    setSectionTabSeleceted(section)
    play();
    router.push(section);
  };

  if (section === "league")
    return (
      <div
        onMouseUp={() => handleClick("league")}
        className={`header-tab ${(actualSection === section && !isNavigating) ? "actual-section" : (!isNavigating && sectionTabSelected === section) ? "selected" : ''} main`}
        data-testid={`tab-${section}`}
      >
        {section.toUpperCase()}
        <img
          style={{
            display: isPointerVisible ? "block" : "none",
          }}
          className="header-pointer"
          src="/header-pointer.png"
        />
      </div>
    );
  return (
    <div
      className={`header-tab ${(!isNavigating && actualSection === section) ? "actual-section" : (!isNavigating && sectionTabSelected === section) ? "selected" : null}`}
      onMouseUp={() => handleClick(section)}
      {...trigger({ content: section })}
      data-testid={`tab-${section}`}
    >
      <img
        style={{
          display: isPointerVisible ? "block" : "none",
        }}
        className="header-pointer"
        src="/header-pointer.png"
      />
      <svg fill="currentColor">
        <use href={`/icon.svg#${section}`} />
      </svg>
    </div>
  );
}
