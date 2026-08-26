"use client";

import "./DesktopHeader.css";
import PlayLobbyButton from "@/components/buttons/PlayLobby/PlayLobby";
import { memo } from "react";
import { useState } from 'react'
import useTooltipTrigger from '@/components/tooltips/GlobalTooltip/TooltipTrigger'
import HeaderTab from './components/HeaderTab'
import HeaderWallet from './components/HeaderWallet'
import { LEFT_HEADER_TABS, RIGHT_HEADER_TABS } from '@/utils/constants'

export default memo(function DesktopHeader({ showSideNav }) {
  const [sectionTabSelected, setSectionTabSelected] = useState()
  const trigger = useTooltipTrigger()

  return (
    <>
      <header
        style={{
          marginRight: !showSideNav ? "0px" : null
        }}
        className="index-header"
      >
        <PlayLobbyButton setSectionTabSelected={setSectionTabSelected} />
        {LEFT_HEADER_TABS.map(section => (
          <HeaderTab
            key={section.id}
            setSectionTabSeleceted={setSectionTabSelected}
            sectionTabSelected={sectionTabSelected}
            section={section.id}
            type={section.type}
          />
        ))}
        <div className="header-sections">
          {RIGHT_HEADER_TABS.map(section => (
            <>
              <HeaderTab
                trigger={trigger}
                section={section.id}
                setSectionTabSeleceted={setSectionTabSelected}
                sectionTabSelected={sectionTabSelected}
                type={section.type}
              />
              {section.hasSeparator && <div className="tab-separator"></div>}
            </>
          ))}
          <HeaderWallet trigger={trigger} />
        </div>
      </header>
    </>
  );
});
