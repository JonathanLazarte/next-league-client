'use client'

import './mobileHeader.css'
import HeaderMainButton from '@/components/playButton/HeaderMainButton/HeaderMainButton'
import { RiSidebarFoldFill } from "react-icons/ri";
import { TiThMenu } from "react-icons/ti";
import { useUserInterface} from '@/hooks/useUserInterface'
import { useState } from 'react'
import { GiStoneCrafting } from "react-icons/gi";
import { useRouter } from 'next/navigation'
import { useSound } from '@/hooks/useSound';



export default function MobileHeader(){
  const { actualSection, changeSection, updateSideNav } = useUserInterface();
  const route = useRouter()
  const selectedStyle = {/*background: "linear-gradient(rgb(9, 17, 30) 50%, rgb(47, 50, 52))",*/ color: "#F0E6D2"}
  const [isNavigationOpen, setIsNavigationOpen] = useState(false)
  const { play : playMenuClick} = useSound('/sfx/menu-click.mp3')

  const handleClick = (section) => {
      playMenuClick()
      setIsNavigationOpen(false)
      changeSection(section)
      route.push(section)
    }
  const Tab = ({section}) => {
      return (
          <div className="item" content={section} style={actualSection === section ? selectedStyle : null} onClick={() => handleClick(section)}>
            <svg>
              <use href={`/icon.svg#${section}`} />
              {section === 'Botín' && <GiStoneCrafting />}
            </svg>
          </div>
      )
    }

  return <header className="mobile-header">
    <HeaderMainButton/>
    <div className="mobile-header-tabs">
      <div className="item" onClick={()=>setIsNavigationOpen(prev=>!prev)}><TiThMenu /></div>
      <div className="item" onClick={()=>updateSideNav()}><RiSidebarFoldFill /></div>
    </div>
    {isNavigationOpen &&
      <div className="mobile-navigation-window">
        <Tab onClick={() => setIsNavigationOpen(false)} section="collection"/>
        {/*<Tab onClick={() => setIsNavigationOpen(false)} section="Botín" />*/}
        <Tab onClick={() => setIsNavigationOpen(false)} section="store" />
      </div>
    }
  </header>
}
