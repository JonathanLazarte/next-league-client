'use client'

import './MobileHeader.css'
import PlayLobbyButton from "@/components/buttons/PlayLobby/PlayLobby";
import { RiSidebarFoldFill } from "react-icons/ri";
import { TiThMenu } from "react-icons/ti";
import { useUserInterface} from '@/hooks/useUserInterface'
import { CSSProperties, useState } from 'react'
import { GiStoneCrafting } from "react-icons/gi";
import { useRouter } from 'next/navigation'
import { useSound } from '@/hooks/useSound';
import type { Section } from '@/types/ui'



export default function MobileHeader(){
  const { actualSection, changeSection, updateSideNav } = useUserInterface();
  const [ sectionTabSelected, setSectionTabSelected ] = useState<string | null>(null)
  const route = useRouter()
  const selectedStyle = { color: "#F0E6D2"} as CSSProperties
  const [isNavigationOpen, setIsNavigationOpen] = useState(false)
  const { play : playMenuClick} = useSound('/sfx/menu-click.mp3')

  const handleClick = (section: Section) => {
      playMenuClick()
      setIsNavigationOpen(false)
      changeSection(section)
      route.push(section)
    }
  const Tab = ({ section }: { section: Section }) => {
      return (
        <div
          className="item"
          content={section}
          style={actualSection === section ? selectedStyle : undefined}
          onClick={() => handleClick(section)}>
            <svg>
              <use href={`/icon.svg#${section}`} />
              {section === 'crafting' && <GiStoneCrafting />}
            </svg>
          </div>
      )
    }

  return <header className="mobile-header">
    <PlayLobbyButton setSectionTabSelected={setSectionTabSelected}/>
    <div className="mobile-header-tabs">
      <div className="item" onClick={()=>setIsNavigationOpen(prev=>!prev)}><TiThMenu /></div>
      <div className="item" onClick={()=>updateSideNav()}><RiSidebarFoldFill /></div>
    </div>
    {isNavigationOpen &&
      <div className="mobile-navigation-window">
        <Tab section="collection"/>
        {/*<Tab onClick={() => setIsNavigationOpen(false)} section="Botín" />*/}
        <Tab section="store" />
      </div>
    }
  </header>
}
